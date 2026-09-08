// ============================================================
// DỌN BẢN DEPLOY CŨ CỦA FIREBASE HOSTING
// Chạy SAU MỖI LẦN deploy, giữ lại 2 bản mới nhất (1 bản đang chạy
// + 1 bản để rollback), xoá hết bản cũ hơn.
//
// Lý do: mỗi bản deploy của dự án này nặng ~241MB, gói Spark chỉ cho
// 10GB -> chỉ khoảng 40 lần deploy là đầy và bị chặn deploy (HTTP 429).
//
// Cách dùng (từ thư mục habit-tracker):
//   node scripts/prune-hosting-versions.js            # chỉ liệt kê, không xoá
//   node scripts/prune-hosting-versions.js --delete   # thực sự xoá
//   KEEP=5 node scripts/prune-hosting-versions.js --delete   # đổi số bản giữ lại
// ============================================================

const path = require("path");
const { JWT } = require("google-auth-library");

// Service account key nằm NGOÀI repo (thư mục cha) để không bị commit nhầm.
const KEY_PATH = process.env.FIREBASE_KEY_PATH
  || path.join(__dirname, "..", "..", "sonnhai-2600f-firebase-adminsdk-fbsvc-95976c69d2.json");
const KEY = require(KEY_PATH);

const SITES = (process.env.SITES || "habitmastery,sonnhai-2600f").split(",");
const KEEP = Number(process.env.KEEP || 2);
const DO_DELETE = process.argv.includes("--delete");

async function main() {
  const client = new JWT({
    email: KEY.client_email,
    key: KEY.private_key,
    scopes: [
      "https://www.googleapis.com/auth/cloud-platform",
      "https://www.googleapis.com/auth/firebase.hosting",
    ],
  });
  await client.authorize();

  for (const site of SITES) {
    console.log(`\n=== SITE: ${site} ===`);

    // CHỐT AN TOÀN: xác định bản đang thực sự phục vụ ở channel live và ép giữ
    // lại. Xoá nhầm bản này là sập site, nên không xác định được thì bỏ qua site.
    let liveVersion = null;
    try {
      const rel = await client.request({
        url: `https://firebasehosting.googleapis.com/v1beta1/sites/${site}/channels/live/releases?pageSize=1`,
      });
      liveVersion = rel.data.releases?.[0]?.version?.name || null;
    } catch (e) {
      console.error(`  !! Không đọc được release đang chạy: ${e.message.slice(0, 120)}`);
    }
    if (!liveVersion) {
      console.error(`  !! DỪNG site ${site}: không xác định được bản đang chạy, không xoá gì cả.`);
      continue;
    }

    let all = [];
    let pageToken = "";
    do {
      const url = `https://firebasehosting.googleapis.com/v1beta1/sites/${site}/versions?pageSize=100`
        + (pageToken ? `&pageToken=${pageToken}` : "");
      const res = await client.request({ url });
      all = all.concat(res.data.versions || []);
      pageToken = res.data.nextPageToken || "";
    } while (pageToken);

    all.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));

    // Bản đã xoá vẫn còn trong danh sách API với status DELETED nhưng KHÔNG còn
    // chiếm quota nữa -> chỉ tính bản còn sống, nếu không số liệu sẽ gây hiểu nhầm.
    const alive = all.filter(v => v.status !== "DELETED");
    const totalBytes = alive.reduce((s, v) => s + Number(v.versionBytes || 0), 0);
    console.log(`Đang chiếm quota: ${alive.length} bản, ~${(totalBytes / 1e9).toFixed(2)} GB`
      + ` (API còn liệt kê ${all.length - alive.length} bản đã xoá trước đó)`);
    console.log(`Bản đang phục vụ (live): ${liveVersion.split("/").pop()}`);

    const keep = all.slice(0, KEEP).map(v => v.name);
    if (!keep.includes(liveVersion)) keep.push(liveVersion);

    const deletable = all.filter(v => !keep.includes(v.name) && v.status !== "DELETED");
    if (deletable.some(v => v.name === liveVersion)) {
      throw new Error("CHẶN: bản live lọt vào danh sách xoá!");
    }

    all.slice(0, KEEP).forEach(v =>
      console.log(`   GIỮ ${v.name.split("/").pop()}  ${v.createTime}  ${(Number(v.versionBytes || 0) / 1e6).toFixed(0)}MB`)
    );

    const freeBytes = deletable.reduce((s, v) => s + Number(v.versionBytes || 0), 0);
    console.log(`Sẽ xoá ${deletable.length} bản cũ, giải phóng ~${(freeBytes / 1e9).toFixed(2)} GB`);

    if (!DO_DELETE) {
      console.log("   (chế độ liệt kê — thêm --delete để thực sự xoá)");
      continue;
    }

    let ok = 0, fail = 0;
    for (const v of deletable) {
      try {
        await client.request({
          url: `https://firebasehosting.googleapis.com/v1beta1/${v.name}`,
          method: "DELETE",
        });
        ok++;
      } catch (e) {
        fail++;
        if (fail <= 3) console.log(`   LỖI xoá ${v.name.split("/").pop()}: ${e.message.slice(0, 100)}`);
      }
    }
    console.log(`   => Xoá xong: ${ok} thành công, ${fail} thất bại`);
  }
}

main().catch(e => { console.error("CRASH:", e.message); process.exit(1); });
