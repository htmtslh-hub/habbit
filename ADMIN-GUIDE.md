# 🔧 TÀI LIỆU KỸ THUẬT — DÀNH CHO ADMIN

> **Phiên bản:** 1.0.0 | **Cập nhật:** 10/07/2026

---

## 1. THÔNG TIN HỆ THỐNG

| Hạng mục | Giá trị |
|----------|---------|
| Firebase Project | `sonnhai-2600f` |
| Console | [Firebase Console](https://console.firebase.google.com/project/sonnhai-2600f) |
| Web App | `https://habitmastery.web.app` |
| Webhook (Vercel) | `https://habbit-opal.vercel.app/api/sepay-webhook` |
| Admin Email | `htmt.slh@gmail.com` |
| Admin UID | `PEjFfUwCSgeu2oxG9sgRsLQUB5p2` |
| GitHub | `https://github.com/htmtslh-hub/habbit` |

## 2. ADMIN DASHBOARD

- **URL:** `https://habitmastery.web.app/admin.html`
- **Desktop:** `Ctrl+Shift+A`
- Chỉ tài khoản có `role: "admin"` trong Firestore mới truy cập được

### Thêm Admin mới

1. Vào Firestore → Collection `users` → chọn user
2. Thêm field: `role` = `"admin"`

## 3. CẤU TRÚC THƯ MỤC

```
habit-tracker/
├── index.html / app.js / style.css    ← App chính
├── auth.html / auth.js / auth.css     ← Đăng nhập
├── admin.html / admin.js / admin.css  ← Admin Dashboard
├── api/sepay-webhook.js               ← Webhook SePay (Vercel)
├── firebase.json / firestore.rules    ← Firebase config
├── vercel.json / .vercelignore        ← Vercel config
├── electron/                          ← Desktop app wrapper
└── dist/                              ← File .exe đã build
```

## 4. DEPLOY

```bash
# Deploy web
firebase deploy --only hosting --project sonnhai-2600f

# Deploy Firestore rules
firebase deploy --only firestore:rules --project sonnhai-2600f

# Deploy tất cả
firebase deploy --project sonnhai-2600f
```

## 5. BUILD DESKTOP (.exe)

```bash
cd electron
npm install          # Lần đầu
npm run build        # Build installer
npm run build:all    # Build installer + portable
```

Output: `dist/HabitGameTracker-Setup-1.0.0.exe`

## 6. THANH TOÁN SEPAY

**Thông tin ngân hàng:**
- VietinBank: `109887120806` — DINH VAN TRIEN
- Webhook: `https://habbit-opal.vercel.app/api/sepay-webhook`
- Dashboard SePay: [my.sepay.vn](https://my.sepay.vn)

**Vercel Environment Variables:**
- `SEPAY_API_KEY`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

## 7. XỬ LÝ SỰ CỐ

| Sự cố | Giải pháp |
|-------|-----------|
| Google login lỗi | Thêm domain vào Firebase Auth → Authorized domains |
| Admin bị từ chối | Set `role: "admin"` trong Firestore |
| Webhook 404 | Kiểm tra Vercel deployment + file `api/sepay-webhook.js` |
| Build exe lỗi | Chạy `npx electron-builder --win --config.win.signAndEditExecutable=false` |

---

*Tài liệu nội bộ — không chia sẻ cho khách hàng.*
