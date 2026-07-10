# 📘 TÀI LIỆU HƯỚNG DẪN — HABIT GAME TRACKER

> **Phiên bản:** 1.0.0 | **Cập nhật:** 10/07/2026 | **Tác giả:** SonnHai

---

## MỤC LỤC

1. [Tổng quan dự án](#1-tổng-quan-dự-án)
2. [Cấu trúc thư mục](#2-cấu-trúc-thư-mục)
3. [Hướng dẫn Admin](#3-hướng-dẫn-admin---quản-trị-hệ-thống)
4. [Hệ thống gói dịch vụ](#4-hệ-thống-gói-dịch-vụ)
5. [Deploy Firebase Hosting](#5-deploy-lên-firebase-hosting)
6. [Đổi tên miền](#6-đổi-tên-miền)
7. [Đóng gói Desktop (.exe)](#7-đóng-gói-desktop-exe)
8. [Tài khoản & Firebase Console](#8-tài-khoản--firebase-console)
9. [Xử lý sự cố](#9-xử-lý-sự-cố)

---

## 1. TỔNG QUAN DỰ ÁN

**Habit Game Tracker** là ứng dụng theo dõi thói quen hàng ngày với gamification, hỗ trợ:

- ✅ Theo dõi thói quen với bảng check hàng ngày
- ✅ Biểu đồ thống kê, heatmap hoạt động cả năm
- ✅ Streak tracking (chuỗi ngày liên tiếp) 🔥
- ✅ Ghi chú hàng ngày, kéo-thả sắp xếp thói quen
- ✅ Đa ngôn ngữ: Tiếng Việt, English, 中文
- ✅ Đăng nhập Google / Email
- ✅ Đồng bộ dữ liệu qua Firebase Firestore
- ✅ Hệ thống quản lý user (Admin Dashboard)
- ✅ Phân quyền: Free / Trial (14 ngày) / Premium

### Nền tảng triển khai

| Nền tảng | URL / File | Trạng thái |
|----------|-----------|------------|
| Web (Production) | `https://habit-tracker-sonnhai.web.app` | ✅ Live |
| Desktop Windows | `dist/HabitGameTracker-Setup-1.0.0.exe` | ✅ Build xong |
| Firebase Project | `sonnhai-2600f` | ✅ Active |

---

## 2. CẤU TRÚC THƯ MỤC

```
habit-tracker/
│
├── 📄 index.html          ← Trang chính (bảng thói quen)
├── 📄 app.js              ← Logic ứng dụng chính
├── 📄 style.css            ← CSS toàn cục
│
├── 📄 auth.html            ← Trang đăng nhập / đăng ký
├── 📄 auth.js              ← Logic xác thực Firebase Auth
├── 📄 auth.css             ← CSS trang đăng nhập
│
├── 📄 admin.html           ← Dashboard quản trị viên
├── 📄 admin.js             ← Logic quản lý user
├── 📄 admin.css            ← CSS dashboard admin
│
├── 📄 firebase.json        ← Cấu hình Firebase (Hosting + Firestore)
├── 📄 firestore.rules      ← Quy tắc bảo mật Firestore
├── 📄 firestore.indexes.json ← Chỉ mục Firestore
├── 📄 .firebaserc          ← Liên kết project Firebase
│
├── 📄 manifest.json        ← PWA manifest
├── 📄 sw.js                ← Service Worker (cache offline)
├── 📄 404.html             ← Trang lỗi 404
├── 🖼️ icon-192.png         ← Icon ứng dụng
├── 🖼️ icon-512.png         ← Icon ứng dụng (HD)
│
├── 📁 electron/            ← Electron wrapper (desktop app)
│   ├── main.js             ← Main process
│   ├── preload.js          ← Context bridge
│   ├── package.json        ← Build config
│   └── icon-clean.png      ← Icon cho Windows
│
└── 📁 dist/                ← File .exe đã build
    └── HabitGameTracker-Setup-1.0.0.exe
```

---

## 3. HƯỚNG DẪN ADMIN — QUẢN TRỊ HỆ THỐNG

### 3.1 Truy cập Admin Dashboard

- **URL:** `https://habit-tracker-sonnhai.web.app/admin.html`
- **Desktop:** Menu → File → Admin Dashboard (hoặc `Ctrl+Shift+A`)
- **Tài khoản Admin:** `htmt.slh@gmail.com`

> ⚠️ Chỉ tài khoản có `role: "admin"` trong Firestore mới truy cập được.

### 3.2 Tổng quan Dashboard

Dashboard hiển thị:
- **Tổng số user** đã đăng ký
- **User active** (hoạt động trong 30 ngày gần nhất)
- **User Premium** (đang sử dụng gói trả phí)
- **Yêu cầu chờ duyệt** (upgrade Premium)

### 3.3 Quản lý tài khoản người dùng

#### Xem danh sách user
- Bảng hiển thị: Avatar, Tên, Email, Gói dịch vụ, Ngày đăng ký, Lần đăng nhập cuối, Trạng thái
- Tìm kiếm theo tên hoặc email
- Lọc theo gói: All / Free / Trial / Premium

#### Vô hiệu hóa tài khoản
1. Click vào nút **"Vô hiệu hóa"** (🚫) bên cạnh user
2. Xác nhận hành động
3. User sẽ **không thể đăng nhập** hoặc sử dụng ứng dụng
4. Trạng thái hiển thị: `Disabled`

#### Kích hoạt lại tài khoản
1. Click **"Kích hoạt"** (✅) bên cạnh user đang bị vô hiệu hóa
2. User có thể đăng nhập lại bình thường

#### Duyệt yêu cầu Premium
1. Tab **"Chờ duyệt"** hiển thị danh sách user yêu cầu nâng cấp
2. Click **"Duyệt"** → User chuyển sang gói Premium
3. Click **"Từ chối"** → Yêu cầu bị hủy

### 3.4 Thêm Admin mới

Để thêm admin mới, cập nhật trường `role` trong Firestore:

1. Vào [Firebase Console](https://console.firebase.google.com/project/sonnhai-2600f/firestore)
2. Collection: `users` → Chọn document của user cần set admin
3. Thêm/sửa field: `role` = `"admin"`
4. User đó sẽ có quyền truy cập Admin Dashboard

---

## 4. HỆ THỐNG GÓI DỊCH VỤ

### 4.1 Bảng so sánh gói

| Tính năng | Free | Trial (14 ngày) | Premium |
|-----------|:----:|:----------------:|:-------:|
| Số thói quen tối đa | 3 | Không giới hạn | Không giới hạn |
| Bảng theo dõi hàng ngày | ✅ | ✅ | ✅ |
| Streak tracking | ✅ | ✅ | ✅ |
| Heatmap hoạt động | ❌ | ✅ | ✅ |
| Ghi chú hàng ngày | ❌ | ✅ | ✅ |
| Biểu đồ thống kê | ❌ | ✅ | ✅ |
| Đồng bộ đa thiết bị | ✅ | ✅ | ✅ |

### 4.2 Luồng đăng ký

```
User mới đăng ký
    ↓
Tự động nhận gói Trial (14 ngày)
    ↓
Hết 14 ngày → Tự động chuyển về Free
    ↓
User yêu cầu nâng cấp Premium
    ↓
Admin duyệt/từ chối trên Dashboard
    ↓
Nếu duyệt → User sử dụng Premium
```

### 4.3 Dữ liệu user trong Firestore

Collection: `users` → Document ID = UID của user

```json
{
  "uid": "abc123...",
  "email": "user@gmail.com",
  "displayName": "Nguyễn Văn A",
  "photoURL": "https://...",
  "provider": "google.com",
  "plan": "trial",              // "free" | "trial" | "premium"
  "trialExpiresAt": Timestamp,  // Ngày hết hạn trial
  "role": "user",               // "user" | "admin"
  "disabled": false,            // true = bị vô hiệu hóa
  "createdAt": Timestamp,
  "lastLoginAt": Timestamp,
  "habitData": "{ ... }"        // JSON chứa dữ liệu thói quen
}
```

---

## 5. DEPLOY LÊN FIREBASE HOSTING

### 5.1 Yêu cầu

- Node.js 18+ đã cài đặt
- Firebase CLI: `npm install -g firebase-tools`
- Đã đăng nhập: `firebase login`

### 5.2 Deploy nhanh

```bash
cd "d:\ghi chú\habit-tracker"
firebase deploy --only hosting --project sonnhai-2600f
```

### 5.3 Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules --project sonnhai-2600f
```

### 5.4 Deploy tất cả

```bash
firebase deploy --project sonnhai-2600f
```

### 5.5 Cấu hình hiện tại

File `firebase.json` đã được cấu hình:
- **Site:** `habit-tracker-sonnhai` (tách riêng, không ảnh hưởng site mặc định)
- **Ignore:** `electron/`, `dist/`, `node_modules/`, config files
- **Cache:** JS/CSS (1 giờ), ảnh (24 giờ)

> ⚠️ **LƯU Ý:** Config `"site": "habit-tracker-sonnhai"` đảm bảo deploy vào site riêng, không ghi đè site mặc định `sonnhai-2600f.web.app`.

---

## 6. ĐỔI TÊN MIỀN

### 6.1 Đổi subdomain (.web.app)

Tạo site mới với tên mong muốn:

```bash
# Tạo site mới
firebase hosting:sites:create TEN-MOI --project sonnhai-2600f

# Cập nhật firebase.json
# Sửa "site": "TEN-MOI" trong phần hosting

# Deploy
firebase deploy --only hosting --project sonnhai-2600f
```

### 6.2 Kết nối domain riêng

Nếu bạn có domain riêng (ví dụ: `tracker.thuviensonnhai.com`):

```bash
# Thêm custom domain
firebase hosting:sites:update habit-tracker-sonnhai --project sonnhai-2600f
```

Hoặc qua Firebase Console:
1. Vào [Firebase Console → Hosting](https://console.firebase.google.com/project/sonnhai-2600f/hosting)
2. Click **"Add custom domain"**
3. Nhập domain: `tracker.thuviensonnhai.com`
4. Firebase sẽ yêu cầu thêm bản ghi DNS:
   - Loại: `CNAME` hoặc `A`
   - Tên: `tracker`
   - Giá trị: theo hướng dẫn Firebase
5. Cập nhật DNS tại nhà cung cấp domain
6. Chờ xác minh (thường 24-48 giờ)

### 6.3 Xóa site cũ

```bash
firebase hosting:sites:delete TEN-SITE-CU --project sonnhai-2600f
```

---

## 7. ĐÓNG GÓI DESKTOP (.EXE)

### 7.1 Yêu cầu

- Node.js 18+
- Windows 10/11

### 7.2 Cài đặt lần đầu

```bash
cd "d:\ghi chú\habit-tracker\electron"
npm install
```

### 7.3 Chạy chế độ phát triển

```bash
npm start
```

Ứng dụng sẽ mở cửa sổ desktop với:
- Local server tại `http://127.0.0.1:17532`
- Firebase Auth hoạt động bình thường
- System tray icon

### 7.4 Build file .exe

```bash
# Build installer (.exe setup)
npm run build

# Build portable (chạy trực tiếp, không cần cài)
npm run build:portable

# Build cả hai
npm run build:all
```

**File output** nằm trong `habit-tracker/dist/`:
- `HabitGameTracker-Setup-1.0.0.exe` — File cài đặt (~78 MB)
- `HabitGameTracker-Portable-1.0.0.exe` — File portable

### 7.5 Cập nhật phiên bản

Khi có bản cập nhật:

1. Sửa code web (index.html, app.js, style.css, v.v.)
2. Cập nhật version trong `electron/package.json`:
   ```json
   "version": "1.1.0"
   ```
3. Build lại:
   ```bash
   cd electron
   npm run build
   ```
4. Phân phối file `.exe` mới cho người dùng

### 7.6 Tính năng Desktop App

| Tính năng | Phím tắt |
|-----------|----------|
| Về trang chính | `Ctrl+Shift+H` |
| Admin Dashboard | `Ctrl+Shift+A` |
| Tải lại | `Ctrl+R` |
| Phóng to/Thu nhỏ | `Ctrl++` / `Ctrl+-` |
| Toàn màn hình | `F11` |
| Developer Tools | `Ctrl+Shift+I` |
| Thoát hoàn toàn | `Ctrl+Q` |

> Khi đóng cửa sổ → ứng dụng **thu nhỏ xuống System Tray** (không thoát). Click phải icon tray → "Thoát" để thoát hoàn toàn.

---

## 8. TÀI KHOẢN & FIREBASE CONSOLE

### 8.1 Thông tin Firebase

| Thông tin | Giá trị |
|-----------|---------|
| Project ID | `sonnhai-2600f` |
| Console | [https://console.firebase.google.com/project/sonnhai-2600f](https://console.firebase.google.com/project/sonnhai-2600f) |
| Admin Email | `htmt.slh@gmail.com` |
| Admin UID | `PEjFfUwCSgeu2oxG9sgRsLQUB5p2` |
| Hosting URL | `https://habit-tracker-sonnhai.web.app` |

### 8.2 Firebase Services đang sử dụng

| Service | Mục đích |
|---------|----------|
| **Authentication** | Đăng nhập Google + Email/Password |
| **Cloud Firestore** | Lưu trữ user profiles + habit data |
| **Hosting** | Deploy web app (site: habit-tracker-sonnhai) |

### 8.3 Firestore Collections

| Collection | Mô tả |
|------------|-------|
| `users` | Hồ sơ người dùng (plan, role, habitData, v.v.) |

### 8.4 Authorized Domains

Cần đảm bảo các domain sau được thêm trong Firebase Auth → Settings → Authorized domains:
- `sonnhai-2600f.firebaseapp.com` (mặc định)
- `sonnhai-2600f.web.app` (mặc định)
- `habit-tracker-sonnhai.web.app`
- `localhost` (cho development + desktop app)
- Domain tùy chỉnh (nếu có)

---

## 9. XỬ LÝ SỰ CỐ

### 9.1 User không đăng nhập được bằng Google

**Nguyên nhân:** Domain chưa được authorize trong Firebase Auth.

**Giải pháp:**
1. Vào Firebase Console → Authentication → Settings → Authorized domains
2. Thêm domain hiện tại vào danh sách

### 9.2 Desktop app không mở được

**Nguyên nhân:** Port 17532 đã bị chiếm.

**Giải pháp:** App sẽ tự động thử port tiếp theo (17533). Nếu vẫn lỗi, kiểm tra:
```bash
netstat -ano | findstr :17532
```

### 9.3 Admin Dashboard trả về "Không có quyền"

**Nguyên nhân:** Tài khoản chưa có `role: "admin"` trong Firestore.

**Giải pháp:**
1. Vào Firestore → Collection `users`
2. Tìm document theo UID
3. Thêm field: `role` = `"admin"`

### 9.4 Dữ liệu thói quen không đồng bộ

**Nguyên nhân:** Firestore save bị lỗi do rules hoặc mạng.

**Giải pháp:**
- Kiểm tra kết nối internet
- Kiểm tra Firestore Rules cho phép user đọc/ghi document của mình
- Xem Console → Firestore → Rules playground để test

### 9.5 Build .exe thất bại

**Nguyên nhân phổ biến:**
- Thiếu quyền tạo symbolic link → Chạy `npx electron-builder --win --config.win.signAndEditExecutable=false`
- Icon format lỗi → Dùng PNG 256x256 thay vì ICO

### 9.6 Deploy ghi đè site khác

**Phòng tránh:** Luôn đảm bảo `firebase.json` có field `"site"` chỉ định đúng hosting site:
```json
{
  "hosting": {
    "site": "habit-tracker-sonnhai",
    ...
  }
}
```

---

## PHỤ LỤC: LỆNH THƯỜNG DÙNG

```bash
# === FIREBASE ===
firebase login                                          # Đăng nhập
firebase deploy --only hosting --project sonnhai-2600f   # Deploy web
firebase deploy --only firestore:rules --project sonnhai-2600f  # Deploy rules
firebase hosting:sites:list --project sonnhai-2600f      # Liệt kê hosting sites
firebase hosting:sites:create TEN --project sonnhai-2600f # Tạo site mới

# === ELECTRON ===
cd electron
npm start            # Chạy dev
npm run build        # Build installer
npm run build:all    # Build installer + portable

# === KIỂM TRA ===
firebase emulators:start    # Chạy emulator local
```

---

*Tài liệu này được tạo tự động và cập nhật theo tiến trình phát triển dự án.*
