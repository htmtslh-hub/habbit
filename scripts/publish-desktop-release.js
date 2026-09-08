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

  for (const rel of ASSETS) {
    const name = path.basename(rel);
    const existing = (release.assets || []).find(a => a.name === name);
    if (existing) {
      await gh(token, `${api}/releases/assets/${existing.id}`, { method: "DELETE" });
      console.log(`  xoá asset cũ: ${name}`);
    }

    const buf = fs.readFileSync(path.join(ROOT, rel));
    const up = `https://uploads.github.com/repos/${OWNER}/${REPO}/releases/${release.id}/assets?name=${encodeURIComponent(name)}`;
    const res = await fetch(up, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/zip",
        "Content-Length": String(buf.length),
      },
      body: buf,
    });
    if (!res.ok) throw new Error(`Upload ${name} lỗi: ${res.status} ${(await res.text()).slice(0, 200)}`);
    const data = await res.json();
    console.log(`  tải lên xong: ${name} (${(data.size / 1e6).toFixed(1)} MB)`);
  }

  console.log(`\nLink tải công khai:`);
  for (const rel of ASSETS) {
    console.log(`  https://github.com/${OWNER}/${REPO}/releases/download/${TAG}/${path.basename(rel)}`);
  }
}

main().catch(e => { console.error("LỖI:", e.message); process.exit(1); });
