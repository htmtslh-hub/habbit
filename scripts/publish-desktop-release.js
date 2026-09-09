// ============================================================
// ĐẨY BẢN CÀI DESKTOP LÊN GITHUB RELEASES
//
// auth.html trỏ tới tag CỐ ĐỊNH `desktop-latest`, nên mỗi lần có bản cài mới
// chỉ cần chạy lại script này để thay asset — KHÔNG phải sửa lại auth.html.
//
// Chạy sau `npm run build:all` + `python scripts/package-installers.py`:
//     node scripts/publish-desktop-release.js
//
// Token: lấy từ biến môi trường GITHUB_TOKEN, nếu không có thì đọc từ
// Git Credential Manager (cùng token mà `git push` đang dùng).
// ============================================================

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const OWNER = "htmtslh-hub";
const REPO = "habbit";
const TAG = "desktop-latest";
const ROOT = path.dirname(__dirname);

const ASSETS = [
  "downloads/HabitMastery-Setup.zip",
  "downloads/HabitMastery-Portable.zip",
];

function getToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  const out = execSync("git credential fill", {
    input: "protocol=https\nhost=github.com\n\n",
    encoding: "utf8",
  });
  const m = out.match(/^password=(.+)$/m);
  if (!m) throw new Error("Không lấy được token GitHub (đặt biến GITHUB_TOKEN hoặc đăng nhập git).");
  return m[1].trim();
}

async function gh(token, url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${res.statusText} — ${body.slice(0, 300)}`);
  }
  return res.status === 204 ? null : res.json();
}

async function main() {
  const token = getToken();
  const api = `https://api.github.com/repos/${OWNER}/${REPO}`;

  for (const rel of ASSETS) {
    if (!fs.existsSync(path.join(ROOT, rel))) {
      throw new Error(`Thiếu file ${rel} — chạy build + package-installers.py trước.`);
    }
  }

  // Lấy release theo tag, chưa có thì tạo mới
  let release;
  try {
    release = await gh(token, `${api}/releases/tags/${TAG}`);
    console.log(`Đã có release '${TAG}' (id ${release.id}) — sẽ thay asset.`);
  } catch (e) {
    if (!String(e.message).startsWith("404")) throw e;
    release = await gh(token, `${api}/releases`, {
      method: "POST",
      body: JSON.stringify({
        tag_name: TAG,
        name: "Habit Mastery — Bản cài Desktop (mới nhất)",
        body:
          "Bản cài desktop mới nhất cho Windows.\n\n"
          + "- **HabitMastery-Setup.zip** — bản cài đặt (tạo shortcut, Start Menu, thông báo hệ thống)\n"
          + "- **HabitMastery-Portable.zip** — bản chạy ngay, không cần cài\n\n"
          + "Tag này luôn giữ bản mới nhất; trang đăng nhập của web trỏ thẳng vào đây.",
        draft: false,
        prerelease: false,
      }),
    });
    console.log(`Đã tạo release '${TAG}' (id ${release.id}).`);
  }

  // ---------------------------------------------------------------
  // TẢI LÊN TRƯỚC — XOÁ SAU. Thứ tự này rất quan trọng.
  //
  // Bản cũ xoá asset trước rồi mới tải lên. Ngày 09/09/2026 việc tải lên
  // HabitMastery-Portable.zip đứt giữa chừng SAU khi asset cũ đã bị xoá,
  // nên release chỉ còn mỗi bản Setup và nút tải bản Portable trên trang
  // đăng nhập trả về 404 — không có cảnh báo nào.
  //
  // Nay tải lên dưới tên tạm trước; xong xuôi mới xoá bản cũ rồi đổi tên
  // tạm thành tên thật. Tải lên hỏng thì chỉ có tên tạm bị bỏ đi, còn
  // bản cũ vẫn nguyên vẹn và người dùng vẫn tải được.
  // ---------------------------------------------------------------
  const uploadOne = async (rel) => {
    const name = path.basename(rel);
    const tmpName = `${name}.uploading`;
    const buf = fs.readFileSync(path.join(ROOT, rel));

    // Dọn tên tạm còn sót lại từ lần chạy hỏng trước đó.
    const staleTmp = (release.assets || []).find(a => a.name === tmpName);
    if (staleTmp) {
      await gh(token, `${api}/releases/assets/${staleTmp.id}`, { method: "DELETE" });
    }

    const up = `https://uploads.github.com/repos/${OWNER}/${REPO}/releases/${release.id}/assets?name=${encodeURIComponent(tmpName)}`;
    const res = await fetch(up, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/zip",
        "Content-Length": String(buf.length),
      },
      body: buf,
    });
    if (!res.ok) {
      throw new Error(`Tải lên ${name} lỗi: ${res.status} ${(await res.text()).slice(0, 200)}`);
    }
    const uploaded = await res.json();

    // GitHub báo state 'starter' nếu file chưa nhận đủ. Chỉ 'uploaded'
    // mới là hoàn tất — kiểm tra cả kích thước cho chắc.
    if (uploaded.state !== "uploaded" || uploaded.size !== buf.length) {
      await gh(token, `${api}/releases/assets/${uploaded.id}`, { method: "DELETE" }).catch(() => {});
      throw new Error(
        `Tải lên ${name} không trọn vẹn (state=${uploaded.state}, ` +
        `nhận ${uploaded.size}/${buf.length} byte) — đã bỏ tên tạm, bản cũ giữ nguyên.`
      );
    }
    console.log(`  tải lên xong: ${name} (${(uploaded.size / 1e6).toFixed(1)} MB)`);

    // Tới đây bản mới đã nằm an toàn trên GitHub -> mới được phép xoá bản cũ.
    const existing = (release.assets || []).find(a => a.name === name);
    if (existing) {
      await gh(token, `${api}/releases/assets/${existing.id}`, { method: "DELETE" });
      console.log(`  xoá bản cũ:   ${name}`);
    }

    await gh(token, `${api}/releases/assets/${uploaded.id}`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    });
    return { name, size: buf.length };
  };

  const published = [];
  for (const rel of ASSETS) {
    published.push(await uploadOne(rel));
  }

  // ---- Kiểm tra lại sau cùng ----
  // Sự cố lần trước không ai phát hiện ra vì script chỉ in log rồi kết
  // thúc. Nay hỏi lại GitHub xem thực tế còn những gì trên release.
  const finalRel = await gh(token, `${api}/releases/tags/${TAG}`);
  const finalAssets = finalRel.assets || [];
  let bad = 0;
  console.log(`\nKiểm tra lại trên GitHub:`);
  for (const { name, size } of published) {
    const found = finalAssets.find(a => a.name === name);
    if (!found) {
      console.error(`  THIẾU: ${name}`);
      bad++;
    } else if (found.size !== size) {
      console.error(`  SAI KÍCH THƯỚC: ${name} (${found.size} ≠ ${size})`);
      bad++;
    } else {
      console.log(`  OK: ${name} (${(found.size / 1e6).toFixed(1)} MB)`);
    }
  }
  const leftover = finalAssets.filter(a => a.name.endsWith(".uploading"));
  for (const a of leftover) console.error(`  CÒN TÊN TẠM: ${a.name}`);
  if (bad || leftover.length) {
    throw new Error("Release không đúng như mong đợi — xem log bên trên.");
  }

  console.log(`\nLink tải công khai:`);
  for (const rel of ASSETS) {
    console.log(`  https://github.com/${OWNER}/${REPO}/releases/download/${TAG}/${path.basename(rel)}`);
  }
}

main().catch(e => { console.error("LỖI:", e.message); process.exit(1); });
