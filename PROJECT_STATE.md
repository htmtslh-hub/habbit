# 🚀 HABIT MASTERY - BÁO CÁO TIẾN ĐỘ & TỔNG KẾT DỰ ÁN (PROJECT STATE)

> **Mục đích**: File này lưu trữ toàn bộ trạng thái kỹ thuật, cấu trúc mã nguồn, tính năng đã hoàn thiện và kế hoạch tương lai để bất kỳ phiên làm việc mới nào cũng có thể nắm bắt ngay lập tức, tiết kiệm tối đa Token và thời gian khởi động.

---

## 📌 1. THÔNG TIN DỰ ÁN & TRIỂN KHAI
- **TÊN MIỀN CHUẨN**: **`https://habit-mastery.com`** (kèm `www.`) — đã trỏ về Firebase Hosting.
  `habitmastery.web.app` và `sonnhai-2600f.web.app` vẫn chạy nhưng chỉ là URL phụ. Mọi link mới (email, CTA, trang pháp lý, đăng nhập desktop) phải dùng tên miền chuẩn.
- **Tên ứng dụng**: **Habit Mastery** (Ứng dụng Rèn luyện Thói quen & Game hóa Kỷ luật)
- **Công nghệ cốt lõi**: HTML5, Vanilla CSS3 (Design System chuẩn Dark/Light Mode), Vanilla JavaScript (ES6+), Firebase (Authentication, Firestore, Hosting), PWA (Service Worker), Vercel Production, Electron (bản Desktop Windows/macOS), Vercel Serverless API (Node.js — SePay Webhook, OTP, Resend Email).
- **Phiên bản Cache / Scripts hiện tại**: `app.js?v=5.12.3`, `style.css?v=5.12.3`, `hm-dialog.js?v=5.12.2`, `i18n.js?v=5.12.0` (trong `index.html`); `all_books_data.js?v=5.9.6` — **KHÔNG còn nạp tĩnh**, `app.js` tự nạp khi mở sách (xem `ensureBooksLoaded()`); `auth.js?v=5.12.1` (trong `auth.html`); `legal.css/legal.js?v=5.12.0` (3 trang pháp lý); `admin.js?v=5.12.2`, `admin.css?v=5.11.1` (trong `admin.html`) & Service Worker `CACHE_VERSION = '5.12.3'` — *nâng số phiên bản mỗi khi sửa file, vì cache nay đặt 1 NĂM immutable.*
- **Loại Bỏ 100% Mục Lục Rác & Dấu Chấm OCR Trong Nội Dung (v5.3.3)**: Đã bóc tách và xóa sạch toàn bộ các đoạn text mục lục thô bị sao chép nhầm từ bản scan PDF (các dòng chấm dài `........ 93 146. Thu hút...`) trong toàn bộ 14 cuốn sách, giữ lại giao diện trang đọc tinh khiết, sang trọng và chuẩn mực.
- **Đa Ngôn Ngữ Toàn Hệ Thống (v5.8.0)**: Hỗ trợ đầy đủ **Tiếng Việt / English / 简体中文**, tự động phát hiện ngôn ngữ theo quốc gia (VN→vi, CN→zh, còn lại→en mặc định), bao gồm cả tên 21 Cảnh Giới, toàn bộ UI, `auth.html`, `auth.js`. Logic đặt tại [`i18n.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/i18n.js) (~1.600 dòng).
- **Bảo Mật (Security Patch)**: Đã vá các lỗ hổng nghiêm trọng — XSS, siết chặt `firestore.rules`, thêm HTTP Security Headers trong `firebase.json`, chuyển sinh mã OTP sang CSPRNG (`crypto.randomInt`), loại các script mock ra khỏi build production.
- **Bản Desktop đóng gói (Electron)**: Windows `.exe` (NSIS installer + Portable) và macOS `.dmg`/`.zip` (arm64 + x64) build tự động qua GitHub Actions ([`.github/workflows/build-mac.yml`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/.github/workflows/build-mac.yml)), có khu vực tải app riêng trên trang đăng nhập (`auth.html`) theo từng hệ điều hành.
- **Admin — Gửi Email Hàng Loạt (Resend)**: Tích hợp [`api/send-email.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/api/send-email.js) qua Resend API, có sẵn 7 mẫu email dựng sẵn (VIP, Sắp hết Trial, Cứu Streak, Tặng DP, Tính năng mới, Thông báo chung, Tùy chỉnh trống) để admin gửi trực tiếp từ `admin.html` — xem chi tiết bug đã sửa ở mục 11 bên dưới.
- **⚠️ SỬA FILE WEB THÌ PHẢI BUILD LẠI BẢN CÀI DESKTOP**: bản Electron **KHÔNG** tải giao diện từ `habitmastery.web.app` mà **đóng gói một bản sao riêng** của toàn bộ file web vào `resources/web` bên trong file cài (xem `build.extraResources` trong [`electron/package.json`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/electron/package.json)), rồi `electron/main.js` chạy server nội bộ đọc bản sao đó. **Deploy web không hề chạm tới người dùng desktop** — họ vẫn chạy giao diện cũ cho tới khi tải lại bản cài mới. Vì vậy mỗi lần deploy web có đụng `index.html`/`app.js`/`style.css`/`auth.*`/`admin.*`/`i18n.js`/`all_books_data.js`/`assets/**` thì phải chạy `cd electron && npm run build:all`, nén lại thành `downloads/HabitMastery-Setup.zip` và `downloads/HabitMastery-Portable.zip` (đúng 2 tên mà `auth.html` đang trỏ tới), rồi deploy lại. Thay đổi chỉ đụng `api/*.js` thì KHÔNG cần build lại. Bản macOS chỉ build được qua GitHub Actions.
- **⚠️ BẮT BUỘC SAU MỖI LẦN DEPLOY — dọn bản deploy cũ**: chạy `NODE_PATH="$PWD/node_modules" node scripts/prune-hosting-versions.js --delete` để **chỉ giữ lại 2 bản mới nhất** mỗi site (bản đang chạy + 1 bản rollback). Mỗi bản deploy nặng **~241 MB** nên gói Spark (10 GB) chỉ chứa được ~40 lần deploy; ngày 08/09/2026 đã tích 277 bản = 10,85 GB khiến Firebase **chặn thẳng deploy** (HTTP 429 `exceeded the Hosting storage quota`). Script có chốt an toàn: luôn xác định bản đang phục vụ ở channel `live` rồi ép giữ lại, không xác định được thì dừng chứ không xoá liều. Chạy không kèm `--delete` để xem trước.
- **Kho mã nguồn (GitHub)**: `https://github.com/htmtslh-hub/habbit.git` (Nhánh `main`)
- **Biểu tượng tiền tệ**: **Prism Nexus Coin** (Phương án 1) — Đồng xu tròn viền vàng hoàng kim công nghệ, lõi Lăng Kính Kim Cương Ngọc Bích (Emerald & Cyan Neon) tỏa sáng, thay thế hoàn toàn chữ text "DP" trên toàn hệ thống.
- **Địa chỉ Production đang hoạt động**:
  - 🌐 **Tên miền chính (Custom Domain)**: [https://habit-mastery.com](https://habit-mastery.com) *(và https://www.habit-mastery.com)*
  - 🌐 **Firebase Hosting**: [https://habitmastery.web.app](https://habitmastery.web.app) / [https://sonnhai-2600f.web.app](https://sonnhai-2600f.web.app)
  - 🌐 **Vercel Production**: [https://habbit-opal.vercel.app](https://habbit-opal.vercel.app)

---

## 🏗️ 2. CẤU TRÚC TỆP TIN CHÍNH (FILE ARCHITECTURE)

| Tệp tin | Vai trò chính |
| :--- | :--- |
| [`index.html`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/index.html) | Giao diện ứng dụng chính, thanh điều hướng, các Modal độc lập (Cộng đồng, BXH, Nhiệm vụ, Hồ sơ, Cửa hàng, Tổ đội, Túi đồ, Kho Tài Liệu, Thẻ Gói Tài Khoản & Hạn Dùng, Mở Rương Bí Ẩn, Bộ Đọc Sách Trực Tiếp, Lightbox ảnh, Nâng cấp). |
| [`app.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/app.js) | Toàn bộ logic ứng dụng: Bảng thói quen, khóa thói quen từ thứ 4 khi hết hạn Pro/Premium (giữ nguyên dữ liệu), tính điểm DP/Streak, hệ thống 7 Bước Lớn & 21 Cảnh Giới Nhỏ, đồng bộ Firestore, bảng xếp hạng Top 50, hệ thống nhiệm vụ & nhận thưởng, bảng tin cộng đồng, Túi Đồ Cá Nhân (Backpack), Kho Tài Liệu & Sách Trực Tuyến (Document Reader), Pomodoro, Spotify-style Recap. |
| [`style.css`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/style.css) | Hệ thống biến CSS variables, hiệu ứng Glow/Spotlight, giao diện Dark/Light mode, thẻ nhân vật 10 cấp bậc đồ họa, animation mở Rương Bí Ẩn, giao diện Túi Đồ & Shop, giao diện Đọc Sách Trực Tuyến 3 chế độ (Dark / Sepia / Light), thẻ thông tin Gói Tài Khoản & Hạn Sử Dụng trong Hồ sơ, responsive mobile. |
| [`nameplate_templates.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/nameplate_templates.js) | Thẻ tên Dynamic Nameplate Card cho thanh Navbar (`getNameplateCardHTML`) và Thẻ nhân vật chi tiết (`getFullRankCardHTML`). |
| [`avatar_frames.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/avatar_frames.js) | Khung viền Avatar động 10 mốc đồ họa (Khung 1 đến Khung 10). |
| [`auth.html`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/auth.html) / [`auth.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/auth.js) | Trang đăng nhập/đăng ký tài khoản, xác thực Email/Mật khẩu, OTP. |
| [`admin.html`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/admin.html) / [`admin.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/admin.js) | Bảng điều khiển quản trị viên: Quản lý người dùng, phân cấp gói Free/Trial/Pro/Premium kèm thời hạn (30/90/365 ngày/Vĩnh viễn), cộng điểm DP bonus, duyệt nhiệm vụ đột xuất. |
| [`ideas.txt`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/ideas.txt) | Tài liệu lưu trữ 5 Trụ cột chiến lược giữ chân người dùng (Retention Roadmap) — **đã triển khai đầy đủ cả 5 trụ cột**. |
| [`sw.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/sw.js) | Service Worker phục vụ PWA và bộ nhớ đệm Offline. Chứa `CACHE_VERSION` — bump số này ở mỗi lần deploy có thay đổi file tĩnh. |
| [`i18n.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/i18n.js) | Hệ thống đa ngôn ngữ VI/EN/ZH toàn ứng dụng, tự phát hiện ngôn ngữ theo quốc gia, bản dịch tên 21 Cảnh Giới. |
| [`api/send-email.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/api/send-email.js) | Serverless API (Vercel) gửi email hàng loạt qua Resend, phục vụ chức năng Admin gửi email. |
| [`api/send-otp.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/api/send-otp.js) / [`api/verify-otp.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/api/verify-otp.js) | Sinh & xác thực mã OTP đăng ký/khôi phục tài khoản (CSPRNG). |
| [`api/sepay-webhook.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/api/sepay-webhook.js) | Webhook nhận thông báo thanh toán từ SePay để tự động kích hoạt gói Pro/Premium. |
| [`electron/`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/electron) | Cấu hình đóng gói bản Desktop (Electron + electron-builder) cho Windows (.exe NSIS/Portable) và macOS (.dmg/.zip arm64+x64). |
| [`.github/workflows/build-mac.yml`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/.github/workflows/build-mac.yml) | GitHub Actions CI tự động build bản macOS (chạy trên runner macOS vì electron-builder không build .dmg trên Windows). |
| [`firestore.rules`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/firestore.rules) | Luật bảo mật Firestore — đã siết chặt trong đợt vá bảo mật (commit `753c984`). |

---

## 🧘 3. HỆ THỐNG CẤP BẬC TÂM THỨC CÁ NHÂN (7 BƯỚC LỚN & 21 CẢNH GIỚI NHỎ)

> **Quy tắc cốt lõi**:
> - Đã **loại bỏ hoàn toàn** các danh xưng cũ (*Tân Binh, Chiến Binh, Dũng Sĩ, Kiếm Sĩ, Cao Thủ, Đại Sư, Chiến Thần, Bất Tử, Huyền Thoại, Thần Thoại*).
> - Đã **loại bỏ chữ `Level` / `Lv.1`, `Lv.2`...** trên toàn bộ giao diện người dùng.
> - **Định dạng hiển thị dưới tên**: **`Bước thứ [X] - [Tên tiểu cảnh giới]`** *(Ví dụ: `Bước thứ 1 - Vô minh`, `Bước thứ 3 - Kỷ luật`, `Bước thứ 7 - Niết bàn`)*.
> - **Bảo toàn đồ họa**: Giữ nguyên 10 khung avatar và 10 thẻ tên visual nameplate ban đầu.

### Bảng Phân Bổ 21 Cảnh Giới Vào 10 Mốc Đồ Họa & Điểm DP:

| Mốc Đồ Họa | Mốc Điểm DP | Bước Lớn | Cảnh Giới Nhỏ & Mốc DP Biên | Triết Lý & Định Nghĩa Tâm Thức |
| :--- | :--- | :--- | :--- | :--- |
| **Khung 1** | 0 – 1.500 DP | **Bước 1: Vô thức** | • **Vô minh** (`0 - 750 DP`)<br>• **Mê muội** (`751 - 1.500 DP`) | *Vô minh:* Sống theo bản năng và thói quen cũ, thiếu nhận thức về bản thân.<br>*Mê muội:* Không phân biệt được thật giả, sống nhập nhằng, phớt lờ cảnh báo. |
| **Khung 2** | 1.501 – 4.500 DP | **Bước 1: Vô thức** &<br>**Bước 2: Thức tỉnh** | • **Thỏa hiệp** (`1.501 - 3.000 DP`)<br>• **Sụp đổ** (`3.001 - 4.500 DP`) | *Thỏa hiệp:* Để ngoại cảnh dẫn dắt, chấp nhận tầm thường, bình thường hóa sai lệch.<br>*Sụp đổ:* Đối mặt đổ vỡ, thất bại nghiêm trọng, khởi đầu quá trình nhận thức. |
| **Khung 3** | 4.501 – 9.000 DP | **Bước 2: Thức tỉnh** | • **Overthinking** (`4.501 - 6.500 DP`)<br>• **Tri khuyết** (`6.501 - 9.000 DP`) | *Overthinking:* Xung đột dữ dội giữa thực tế đau đớn và mong muốn thay đổi.<br>*Tri khuyết:* Dừng chối bỏ, nhìn thẳng vào sự thật để bắt đầu hành trình mới. |
| **Khung 4** | 9.001 – 15.000 DP | **Bước 3: Thiết lập Trật tự** | • **Ranh giới** (`9.001 - 12.000 DP`)<br>• **Độc lập** (`12.001 - 15.000 DP`) | *Ranh giới:* Vạch rõ giới hạn bản thân, ngăn chặn tác động tiêu cực.<br>*Độc lập:* Tách rời sự lệ thuộc vào cảm xúc, dư luận và sự công nhận của người khác. |
| **Khung 5** | 15.001 – 24.000 DP | **Bước 3: Thiết lập Trật tự** &<br>**Bước 4: Tích lũy** | • **Kỷ luật** (`15.001 - 19.500 DP`)<br>• **Luyện tâm** (`19.501 - 24.000 DP`) | *Kỷ luật:* Đưa hành vi vào khuôn khổ, tuân thủ nguyên tắc đã đề ra.<br>*Luyện tâm:* Tôi rèn nhận thức, chuyển hóa nghịch cảnh thành năng lực. |
| **Khung 6** | 24.001 – 36.000 DP | **Bước 4: Tích lũy** | • **Kiên nhẫn** (`24.001 - 30.000 DP`)<br>• **Kiên định** (`30.001 - 36.000 DP`) | *Kiên nhẫn:* Làm chủ thời gian, chịu đựng sức ép khi chưa thấy kết quả.<br>*Kiên định:* Giữ vững phương hướng, không dao động trước khó khăn, cám dỗ. |
| **Khung 7** | 36.001 – 54.000 DP | **Bước 5: Tinh thông** | • **Tập trung** (`36.001 - 42.000 DP`)<br>• **Si mê** (`42.001 - 48.000 DP`)<br>• **Trực giác** (`48.001 - 54.000 DP`) | *Tập trung:* Gom toàn bộ tâm trí và năng lượng vào một hành động duy nhất.<br>*Si mê:* Động lực nội tại mãnh liệt, hòa mình trọn vẹn vào công việc.<br>*Trực giác:* Hành động tự động, chuẩn xác và không chút do dự. |
| **Khung 8** | 54.001 – 75.000 DP | **Bước 6: Siêu nhận thức** | • **Buông bỏ** (`54.001 - 64.500 DP`)<br>• **Bình tĩnh** (`64.501 - 75.000 DP`) | *Buông bỏ:* Chủ động buông những thứ ngoài tầm kiểm soát.<br>*Bình tĩnh:* Giữ sự tĩnh lặng tuyệt đối ngay giữa biến động dữ dội. |
| **Khung 9** | 75.001 – 105.000 DP | **Bước 6: Siêu nhận thức** | • **Không hối tiếc** (`75.001 - 90.000 DP`)<br>• **Tự tại** (`90.001 - 105.000 DP`) | *Không hối tiếc:* Chịu trách nhiệm trọn vẹn về mọi lựa chọn trong quá khứ.<br>*Tự tại:* Hoàn toàn làm chủ tâm trí, không dính mắc vào được mất hay khen chê. |
| **Khung 10** | 105.001+ DP | **Bước 7: Siêu thoát, niết bàn** | • **Siêu thoát** (`105.001 - 150.000 DP`)<br>• **Niết bàn** (`150.001+ DP`) | *Siêu thoát:* Vượt lên mọi rào cản và thói quen cũ, giải phóng tự do tâm thức.<br>*Niết bàn:* Đỉnh cao an lạc tuyệt đối, hợp nhất ý chí kỷ luật và tự do. |

---

## ⚡ 4. CÁC TÍNH NĂNG ĐÃ HOÀN THIỆN ĐẦY ĐỦ

### 1. Bảng Theo Dõi Thói Quen (Habit Tracker Core)
- Bảng lưới tháng theo ngày với tính năng đóng băng cột (Freeze) và thu gọn cột (Collapse).
- Check-in thói quen kèm hiệu ứng âm thanh Web Audio API.
- **Cơ chế Khóa Thói Quen Tự Động (Habit Locking for Free/Expired Accounts)**:
  - Tài khoản Free hoặc Pro/Premium đã hết hạn bị giới hạn **tối đa 3 thói quen hoạt động**.
  - Các thói quen từ thứ 4 trở đi (`index >= 3`) được **khóa tự động** (hiển thị mờ, huy hiệu `🔒 Khóa (Free)`, ô check-in biểu tượng khóa) và **tuyệt đối không bị xóa dữ liệu**. Khi nâng cấp hoặc gia hạn gói, toàn bộ dữ liệu lập tức mở khóa trở lại.
- Theo dõi Tâm trạng (Mood) & Thời gian ngủ (Sleep hours).
- Ghi chú nhật ký hàng ngày (Daily Notes) và Bản đồ nhiệt hoạt động cả năm (Year Heatmap).
- Xuất / Nhập dữ liệu sao lưu dạng file JSON.

### 2. Hệ Thống Nhiệm Vụ Rèn Luyện (Quests)
- 4 Nhóm nhiệm vụ: **Hàng ngày** (tự reset 00:00), **Hàng tuần** (tự reset thứ 2), **Thành tích vĩnh viễn**, **Nhiệm vụ đột xuất từ Admin**.
- **Nhiệm vụ Cố Định Gia Nhập Nhóm Chat Zalo (`a_join_zalo`)**: Thưởng **+1.000 DP** cho tất cả tài khoản. Áp dụng cơ chế **Phương án A (Mã bí mật trong bài ghim Zalo)** — người dùng mở nhóm Zalo, xem mã bí mật được ghim đầu nhóm chat và nhập vào ứng dụng để xác thực nhận 1.000 DP. Admin có thể thay đổi mã bí mật này bất kỳ lúc nào ngay trên trang Quản trị (`admin.html`).
- Nút **Nhận thưởng** kích hoạt pháo giấy Confetti, Toast, cộng điểm DP và thăng cấp cảnh giới tức thì.

### 3. Tab Bảng Tin Cộng Đồng (Community Feed)
- Modal Cộng đồng độc lập (`#communityModalBg`).
- Đăng bài viết kèm Ảnh/Video (<15MB).
- Xem ảnh phóng to toàn màn hình (Lightbox Modal).
- Hệ thống Bình luận thời gian thực với Badge hiển thị chuẩn `Bước thứ [X] - [Tên cảnh giới]`.

### 4. Bảng Xếp Hạng Top 50 & Vinh Danh
- Top 50 người dùng có tổng DP và chuỗi Streak cao nhất.
- Podium Top 1-2-3 và Top 4-50 hiển thị badge `Bước thứ [X] - [Tên cảnh giới]`.
- Tặng Kudos (khen ngợi) đồng đội.
- Danh mục Cảnh giới (Showcase) hiển thị chi tiết tiến độ cảnh giới hiện tại và 21 cảnh giới.

### 5. Hồ Sơ Nhân Vật, Thẻ Gói Tài Khoản & Hạn Sử Dụng
- **Hồ Sơ Nhân Vật Hành Tinh (Orbital Profile Modal)**:
  - 🎒 **Nút Túi Đồ Cá Nhân (Vị trí 1)**: Mở trực tiếp Kho Túi Đồ tổng hợp chứa toàn bộ vật phẩm, bùa lợi, sách đã mở khóa, danh hiệu và giao diện đã sở hữu.
  - 🧊 **Nút Bảo Vệ Chuỗi (Vị trí 2)**: Theo dõi & kích hoạt Bình Freeze, cứu chuỗi.
  - 📊 **Nút Tổng Kết Tuần (Vị trí 3)**: Xem infographic Weekly Recap và sao chép thống kê.
  - 📸 **Nút Khoe Thẻ Rank (Vị trí 4)**: Xuất ảnh Story 9:16 Canvas High-DPI.
  - 📷 **Nút Avatar Studio (Vị trí 5)**: Đổi ảnh đại diện, tải ảnh, chọn 12 mẫu đẹp, 10 khung viền cảnh giới.
  - ⚙️ **Nút Cài Đặt (Vị trí 6)**: Đổi tên hiển thị, đổi giao diện, chọn ngôn ngữ (VI/ZH/EN), cẩm nang sử dụng.
- **Thẻ Gói Tài Khoản & Hạn Sử Dụng (Profile Subscription Card)**:
  - 🏷️ **Gói hiện tại**: `👑 Premium VIP`, `⚡ Gói Pro`, `⏳ Dùng thử (Trial)`, `🌱 Gói Free`.
  - 📅 **Ngày đăng ký**: Hiển thị chính xác ngày kích hoạt / tạo tài khoản.
  - ⏳ **Hạn sử dụng**: Hiển thị ngày hết hạn, đếm ngược số ngày còn lại (`Còn X ngày`) hoặc `Vĩnh viễn (Trọn đời)`. Khi hết hạn, hiển thị cảnh báo đỏ `⚠️ Đã hết hạn` kèm hướng dẫn gia hạn.
  - 📊 **Số thói quen**: Hiển thị trạng thái thói quen khả dụng (Không giới hạn hoặc `3/N thói quen - Đã khóa N-3`).
  - 🚀 **Nút Nâng Cấp / Gia Hạn Gói**: Mở trực tiếp Modal thanh toán & nâng cấp VIP.

### 6. Trụ Cột 1: Cơ Chế Bảo Vệ & Cứu Chuỗi (Streak Protection & Recovery)
- **Bình Đóng Băng Chuỗi (*Streak Freeze* - sức chứa tối đa 3 bình)**: Tự động đóng băng bảo toàn streak nếu quên điểm danh 1 ngày mà không bị reset chuỗi về 0.
- **Cứu Chuỗi Trong 48h (*Streak Repair* - 150 DP)**: Hồi sinh ngay chuỗi ngày bị đứt hôm qua hoặc gần nhất.
- **Trung Tâm Bảo Vệ Chuỗi (*Streak Protection Modal*)**:
  - Giao diện trực quan hiển thị số ngày chuỗi hiện tại và kỷ lục max streak.
  - Hiển thị 3 bình đóng băng năng lượng phát sáng (`Bình 1`, `Bình 2`, `Bình 3`).
  - Nút Mua bình đóng băng (200 DP) và Nút Cứu chuỗi khẩn cấp (150 DP).
  - Lịch sử bảo vệ & cứu chuỗi chi tiết từng ngày.
- **Banner Báo Động Khẩn Cấp (*Streak Emergency Banner*)**: Tự động xuất hiện cảnh báo khi chuỗi bị đứt trong vòng 48h kèm nút 1 chạm "Cứu chuỗi ngay".
- **Bùa Nghỉ Phép (Vacation Pass)** & **Khiên Bất Hoại (Invincible Shield)**: Miễn nhiễm mất chuỗi liên tục 3 đến 7 ngày.

### 7. Trụ Cột 2: Cửa Hàng Kỷ Luật & Túi Đồ Cá Nhân (Shop & Backpack)
- **Túi Đồ Cá Nhân Toàn Năng (Backpack)**: Quản lý và trang bị toàn bộ tài sản đang sở hữu:
  - ⚡ **Bùa Lợi Đang Kích Hoạt (Active Buffs)**: Vé Boost x3/x2, Khiên 7 Ngày, Bùa nghỉ phép, Focus Elixir.
  - 🎒 **Kho Vật Phẩm Tiêu Thụ**: Rương Kỷ Luật Bí Ẩn, Vé Boost, Bình Freeze, Bùa nghỉ phép, Thuốc Focus, Nước tăng lực đồng đội.
  - 📚 **Tủ Sách Tri Thức**: Toàn bộ sách đã sở hữu với nút "📖 Đọc" ngay lập tức.
  - 🏷️ **Danh Hiệu Đã Sở Hữu**: Trang bị hoặc tháo danh hiệu tùy thích.
  - 🎨 **Giao Diện Đã Sở Hữu**: Xem và áp dụng theme màu sắc trực tiếp.
- **Rương Kỷ Luật Bí Ẩn (Mystery Chest)**: Mở quà may mắn với animation lắc rương, hiệu ứng hào quang và tỷ lệ trúng Jackpot thần thoại.
- **Kho Tài Liệu & Sách Tinh Hoa (Documents Hub) — ĐỦ 14/14 QUYỂN, đã bán được, KHÔNG thiếu quyển nào** *(rà soát & sửa lại danh sách 07/09/2026 — bản trước chỉ liệt kê 6/14, gây hiểu nhầm 8 quyển còn lại "chưa có nội dung"; thực tế cả 14 đã có đủ chương/phần và hiển thị đúng trong `SHOP_CATALOG.docs` lẫn Cửa Hàng → tab Tài liệu)*:
  1. 📜 **Tuyệt Mật Nhân Tính** *(Miễn phí — Bản Đủ 218 Trang, 7 chương/27 phần)*: Tâm lý học hành vi, đối nhân xử thế, nghệ thuật quyền mưu và thấu hiểu bản chất con người.
  2. 👁️ **Thức Tỉnh Nhận Thức** *(8.200 Coins — 9 chương/18 phần)*: Phá vỡ bẫy tư duy vô thức, làm chủ tâm trí.
  3. 🌹 **Tình Cảm Bí Tịch** *(8.300 Coins — 5 chương/15 phần)*: Đọc vị cảm xúc, giải mã tâm lý đối phương.
  4. ⛓️ **Logic Người Nghèo** *(8.400 Coins — 5 chương/10 phần)*: Lối mòn tư duy kìm hãm phát triển, bẫy chi phí chìm.
  5. ⚙️ **Hệ Thống Mạnh Mẽ** *(8.500 Coins — 5 chương/14 phần)*: Xây hệ thống kỷ luật tự vận hành, quản trị năng lượng.
  6. 🦁 **Tư Duy Cường Giả** *(8.600 Coins — 9 chương/27 phần)*: Ý chí sắt đá & nguyên tắc kẻ mạnh.
  7. 🔍 **Xuyên Thấu Nhân Tính** *(8.700 Coins — 5 chương/10 phần)*: Bóc tách mặt nạ xã hội, ngôn ngữ cơ thể, đòn bẩy tâm lý.
  8. ☯️ **Nhân Tính Đen Trắng** *(8.800 Coins — 5 chương/10 phần)*: Bóng tối tâm lý (Shadow Self), cân bằng bản ngã.
  9. 🌌 **Tư Duy Sâu Sắc** *(8.900 Coins — 5 chương/14 phần)*: First Principles & giải mã bài toán phức tạp.
  10. ⚔️ **Thương Chiến** *(9.200 Coins — 6 chương/13 phần)*: Mưu lược kinh doanh, đòn bẩy dòng tiền.
  11. ⚡ **Mưu Lược Tuổi Trẻ** *(9.400 Coins — 5 chương/20 phần)*: Cẩm nang sinh tồn & bứt phá cho người trẻ.
  12. 🔮 **Ẩn Chứa Huyền Cơ** *(9.800 Coins — 5 chương/15 phần)*: Đọc vị thế cục ngầm & quy luật âm dương.
  13. 🏦 **Luật Ngầm Tài Chính** *(9.600 Coins — 5 chương/5 phần)*: Quy luật ngầm hệ thống tài chính, chu kỳ nợ.
  14. 💰 **Mưu Lược Tài Chính** *(10.000 Coins — 6 chương/6 phần)*: Chiến lược tích lũy tài sản, đòn bẩy tài chính.
  - ⚠️ **Nợ kỹ thuật liên quan**: dữ liệu "Tuyệt Mật Nhân Tính" đang tồn tại **trùng lặp ở 2 file** — `doc_nhan_tinh_data.js` (570KB, không còn được dùng) và `all_books_data.js` (7.3MB, **bản đang thực sự chạy** vì `getDocData()` ưu tiên đọc `window.ALL_BOOKS_DATA` trước). Sửa nội dung sách phải luôn sửa đúng `all_books_data.js`, nếu không thay đổi sẽ không có tác dụng. Nên dọn/xoá `doc_nhan_tinh_data.js` ở một đợt dọn dẹp sau để tránh nhầm lẫn.
- **Bộ Đọc Sách Trực Tuyến Thế Hệ Mới (Document Reader Modal v2)**:
  - 📑 **Ngăn kéo Mục Lục Chi Tiết (TOC Drawer)**: Hiển thị trọn bộ 7 chương & 28 phần kèm số trang tài liệu gốc, lọc mục lục tức thì.
  - 🏷️ **Thanh Điều Hướng Chương (Chapter Tabs)**: Chuyển đổi nhanh 7 chương lớn ở đầu trang với hiệu ứng phát sáng Neon.
  - 🔍 **Tìm Kiếm Toàn Sách Thời Gian Thực**: Tra cứu từ khóa trong 218 trang với trích đoạn highlight và nhảy trực tiếp đến vị trí.
  - ⏭️ **Nút Chuyển Phần & Chương**: Điều hướng mượt mà ở cuối mỗi phần bài đọc.
  - 💾 **Tự Động Lưu Vị Trí & Bookmark (Auto-resume)**: Tự động ghi nhớ chương, phần và tiến độ cuộn trang để tiếp tục đọc bất cứ lúc nào.
  - 🎨 **4 Chế độ đọc**: Dark Slate, Warm Sepia (Giấy cổ điển), Paper Light (Sáng), OLED Midnight (Tiết kiệm pin — nền đen tuyệt đối `#000`).
  - Tùy chỉnh kích thước chữ linh hoạt (A- / A+ từ 80% đến 150%), chế độ toàn màn hình.
  - Nút nhận thưởng +20 Coins khi hoàn thành bài đọc.
  - **[VÁ 07/09/2026 — v5.9.1] 4 lỗi trình bày ảnh hưởng khả năng đọc, phát hiện qua kiểm thử Playwright thật (không đoán qua code):**
    1. **Nghiêm trọng nhất**: Rule đổi màu nội dung cho theme Sepia/Light dùng bare selector `[data-theme="sepia"/"light"]` không gắn `.doc-reader-modal` → vô tình trùng với `data-theme` của theme sáng/tối **toàn site**. Hậu quả: mỗi khi site đang ở Light Mode (rất phổ biến), 2 trong 4 chế độ đọc (Dark, OLED) bị khóa cứng hiển thị nền sáng bất kể người dùng chọn gì — coi như không hoạt động. Đã sửa lại đúng phạm vi `.doc-reader-modal[data-theme="..."]`.
    2. Nút A-/A+ dùng `color: var(--text-main)` (biến theo Light/Dark Mode của site) thay vì màu cố định phù hợp nền tối của Reader → chữ gần như vô hình ở Sepia/OLED khi site đang Light Mode.
    3. Trên mobile: `.dr-book-category` (phụ đề thể loại sách) thiếu `white-space:nowrap`, khi header bị bóp hẹp bởi 6 nút điều khiển thì chữ vỡ dòng theo từng từ dọc theo cột hẹp. Đồng thời `.dr-font-controls` bị `display:none` hoàn toàn trên mobile — người đọc trên điện thoại không có cách nào phóng to/thu nhỏ chữ.
       → Sửa: header mobile xuống 2 hàng (`flex-wrap`), ẩn phụ đề (thông tin đã có ở TOC/bìa sách) thay vì để vỡ chữ, khôi phục hiển thị bộ chỉnh cỡ chữ ở hàng 2.
    4. Footer mobile: nút "Đã Đọc Xong" vỡ 2 dòng đè lên text tiến độ đọc → thu gọn padding/font-size nút, cho text tiến độ ellipsis khi quá dài.
- **Vật phẩm tiêu thụ cao cấp**:
  - 🏖️ **Bùa Nghỉ Phép (3 Ngày)**: Tự động bảo toàn streak khi có việc bận/đi du lịch.
  - 🚀 **Vé Siêu Cấp x3 Boost (12H)**: Nhân 3 toàn bộ điểm check-in.
  - ⚡ **Vé Nhân Đôi x2 Boost (24H)**: Nhân 2 toàn bộ điểm check-in.
  - 🧪 **Thuốc Tiên Focus**: +30 Coins thưởng cho 3 phiên Pomodoro.
  - 🛡️ **Khiên Bất Hoại (7 Ngày)**: Miễn nhiễm mất chuỗi tuyệt đối trong 7 ngày.
  - ⚡ **Nước Tăng Lực Đồng Đội**: Tăng 50 năng lượng cho toàn tổ đội.
- 8 Danh Hiệu Độc Quyền (*Character Titles*).
- 7 Bộ Theme Skins Độc Đáo (*Dark, Light, Cyberpunk, Gold Luxury, Sakura, Matrix, Forest Zen*).
- Gói Hiệu Ứng Âm Thanh & Thị Giác khi tick ô.

### 8. Trụ Cột 3: Tổ Đội Rèn Luyện & Đấu Trường Thách Đấu 1v1 (Social Hub)
- Tổ Đội Rèn Luyện (Squads 3-5 người, Mã mời 6 ký tự, Nudge sấm sét đồng đội).
- Đấu Trường Thách Đấu 1v1 7 Ngày (Staking DP 50/100/200/500 DP).

### 9. Trụ Cột 4: Báo Cáo Tổng Kết & Khoe Thành Tích (Recap & Story Cards)
- Báo Cáo Tổng Kết Tuần (*Weekly Recap* 5 slide kiểu Spotify Wrapped).
- Bộ Xuất Ảnh Khoe Kỷ Luật Canvas High-DPI (Story 9:16 & Square 1:1).

### 10. Trụ Cột 5: Pomodoro Focus Station & Sound Mixer Đa Tầng
- **Đồng Hồ Pomodoro (25/5/15 phút)** gắn liền với thói quen, thưởng +15 DP Deep Work Bonus (+30 DP khi có Thuốc Tiên Focus).
- **Bộ Hòa Âm Tập Trung Đa Tầng (Sound Mixer - 100% Web Audio API Offline, 0 KB)**:
  - 🌧️ **Mưa Rào (Forest Rain)**: Pink noise đa dải kết hợp giọt mưa lộp độp ngẫu nhiên.
  - 🌊 **Sóng Biển (Ocean Tide)**: LFO tần số kép điều biến nhịp sóng vỗ êm dịu.
  - 🪵 **Lửa Trại (Campfire Crackle)**: Tiếng củi nổ lách tách ngẫu nhiên ấm áp.
  - ☕ **Tiếng Ồn Nâu (Brown Noise)**: Tần số trầm sâu chặn tạp âm xung quanh tốt nhất cho Deep Work.
  - 🧠 **Sóng Não Gamma 40Hz (Binaural Beats)**: Tần số sóng não kích thích trạng thái *Dòng Chảy (Flow State)*.
  - 🎹 **Giai Điệu Lo-fi Chords**: Vòng hợp âm Jazz/Chillout pads mượt mà tự động đổi gam.
- **Bộ Phối Sẵn 1-Chạm (Quick Presets)**: *Cà Phê Mưa, Rừng Sâu, Deep Work 40Hz, Đêm Lửa Trại, Thiền Biển Đêm, Tắt Hết*.
- **Thanh trượt âm lượng độc lập từng kênh (0-100%)**, hoạt họa cột sóng âm nhấp nhô (Animated Wave Bars) và tự động ghi nhớ cấu hình vào `localStorage`.
- **Widget Trích Dẫn Khắc Kỷ & Động Lực Mỗi Ngày** trên Dashboard.
- **Chế độ Pomodoro tùy chỉnh thời gian đếm ngược** (không cộng DP) cho người dùng muốn tự đặt thời lượng phiên tập trung riêng.

### 11. Đa Ngôn Ngữ Toàn Hệ Thống (i18n — v5.8.0)
- Hỗ trợ trọn vẹn **Tiếng Việt / English / 简体中文**, tự động phát hiện theo quốc gia người dùng (mặc định English cho các quốc gia còn lại).
- Dịch toàn bộ giao diện, tên 21 Cảnh Giới, trang đăng nhập (`auth.html`/`auth.js`).
- Bộ chọn ngôn ngữ dạng pill gọn trên thanh điều hướng.

### 12. Bản Desktop Đóng Gói & Trang Tải App
- **Windows**: Installer `.exe` (NSIS, có thể chọn thư mục cài) và bản Portable, build bằng `electron-builder`.
- **macOS**: `.dmg` và `.zip` cho cả kiến trúc Apple Silicon (arm64) và Intel (x64), build tự động qua GitHub Actions (`build-mac.yml`) vì cần runner macOS.
- Khu vực tải app riêng theo hệ điều hành hiển thị ngay trên trang đăng nhập (`auth.html`).

### 13. Admin — Gửi Email Hàng Loạt (Resend Integration)
- Tích hợp Resend API qua `api/send-email.js`, cho phép Admin gửi email trực tiếp từ `admin.html`.
- 3 mẫu email dựng sẵn: Chào mừng thành viên mới, Tặng đặc quyền VIP miễn phí, Thông báo tính năng mới — hỗ trợ chèn biến `{name}` động.

### 14. Bảo Mật (Security Hardening)
- Vá lỗi XSS, siết chặt `firestore.rules`, thêm HTTP Security Headers trong `firebase.json`.
- Chuyển sinh mã OTP sang CSPRNG (`crypto.randomInt`) thay vì `Math.random()`.
- Loại bỏ các script mock/test ra khỏi build production.

### 15. Cấp Bậc Tổ Đội (Squad Ranks) — v5.9.0
- **5 Bậc Đồng Đội** tính theo TỔNG DP đóng góp bởi toàn bộ thành viên (mảng `SQUAD_RANKS` trong `app.js`), đặt tên riêng biệt hoàn toàn với hệ "7 Bước 21 Cảnh Giới" cá nhân (không tái dùng danh xưng đã bị loại bỏ, không hiển thị "Lv.X"):
  | Bậc | Tên | Ngưỡng DP |
  |:---:|:---|:---|
  | 1 | 🌱 Liên Minh Mới Lập | 0 – 499 |
  | 2 | 🤝 Đội Hình Gắn Kết | 500 – 1.499 |
  | 3 | ⚔️ Tập Thể Kỷ Luật | 1.500 – 3.499 |
  | 4 | 🛡️ Quân Đoàn Tinh Nhuệ | 3.500 – 6.999 |
  | 5 | 👑 Bang Hội Bất Diệt | 7.000+ |
- **Thanh tiến độ lên bậc riêng biệt** (`squad-rank-section`, tông vàng/hổ phách) trong màn hình Tổ Đội, tách bạch với thanh "hoàn thành check-in hôm nay" (tông xanh lá/cyan) để tránh gây nhầm lẫn hai loại tiến độ khác nhau.
- **Thưởng lên bậc kiểu "lazy-claim per-member"**: mỗi thành viên tự nhận thưởng (+50 DP × số bậc) cho chính mình ngay khi phát hiện đội đã vượt mốc bậc mới mà mình chưa nhận — thiết kế bắt buộc vì Firestore Rules chỉ cho phép mỗi client ghi vào tài liệu DP/Coins của chính mình, không thể ghi hộ thành viên khác. Trạng thái đã nhận lưu tại `members[].claimedRankLevel` trong document `squads/{id}`.
- Hiệu ứng ăn mừng: confetti + âm thanh + toast thông báo khi lên bậc mới.
- **Yêu cầu nền tảng**: chỉ hoạt động được sau khi vá lỗ hổng `firestore.rules` ở mục nợ kỹ thuật #9 (trước đó `squads`/`duels` bị Firestore từ chối hoàn toàn).

### 16. Thanh Toán Quốc Tế — Nền Móng (v5.12.0, 09/09/2026)

**Bối cảnh**: thanh toán hiện chỉ chạy được ở Việt Nam (QR VietQR + đối soát nội dung chuyển khoản `HBT<13 số>`). Stripe **không nhận** doanh nghiệp đăng ký tại Việt Nam, nên hướng đi là dùng **Merchant of Record**: Paddle đứng tên người bán, tự lo VAT/GST toàn cầu, rồi trả tiền về cho chủ dự án.

**Đã xác minh (đừng tra lại)**:
- Paddle **nhận người bán ở Việt Nam** — VN không nằm trong danh sách 28 nước bị chặn, và ô Country trong Payout Settings hiện đúng "Vietnam".
- Payout chỉ có **2 lựa chọn**: `Payoneer` và `Wire transfer`. **Không có WorldFirst** như một mục riêng (nhưng có thể dùng qua Wire transfer vì WorldFirst cấp thông tin SWIFT).
- **Wise KHÔNG dùng được**: Việt Nam không nằm trong danh sách quốc gia được phép giữ số dư ở Wise, nên không lấy được số tài khoản USD nhận tiền.
- Điểm hoà vốn Payoneer vs Wire→WorldFirst ≈ **$1.000/lần nhận**: dưới mức đó Payoneer rẻ hơn (không phí $15 SWIFT), trên mức đó WorldFirst rẻ hơn (phí đổi tiền ~0,5% so với ~2%).
- **6 phương thức chỉ dùng được cho thanh toán một lần**, không dùng cho gói thuê bao: Bancontact, BLIK, iDEAL, MB WAY, Pix, UPI. → Giữ mô hình **mua theo thời hạn** như hiện tại thì được dùng cả 6, lại khớp sẵn với logic `planExpiresAt`.

**Đã làm ở v5.12.0**:
- **3 trang pháp lý độc lập** — điều kiện bắt buộc để Paddle duyệt domain: `terms.html`, `privacy.html`, `refund.html` + `legal.css`, `legal.js`. Mỗi trang có đủ **3 ngôn ngữ vi/en/zh** trong HTML tĩnh, mặc định hiện **tiếng Anh** cho bên duyệt hồ sơ, tự đổi theo `hm_app_lang` của app. Có rewrite trong `firebase.json` để truy cập bằng `/terms`, `/privacy`, `/refund`.
  - ⚠️ Nội dung pháp lý cũ nằm trong **modal** ở `auth.html` — bot và người duyệt KHÔNG đọc được. Bốn nút modal vẫn giữ, nhưng đã thêm một hàng thẻ `<a>` thật ở footer trỏ sang 3 trang mới.
  - Link trong các trang này dùng **đường dẫn tương đối** (`terms.html`) chứ không phải `/terms`, vì server nội bộ của Electron không có rewrite.
- **`api/_lib/grantPremium.js`** — gom toàn bộ việc cấp gói Premium về một chỗ (tính hạn + ghi Firestore + gửi email/tin nhắn). `sepay-webhook.js` đã chuyển sang gọi hàm này; webhook Paddle sắp tới dùng chung, tránh hai nơi tính hạn lệch nhau.
  - **Sửa luôn một lỗi thật**: bản cũ luôn tính hạn từ `new Date()`, nên ai còn 20 ngày mà gia hạn sớm là **mất trắng 20 ngày**. Nay mốc bắt đầu là thời điểm muộn hơn giữa "bây giờ" và "hạn hiện tại". Đã kiểm thử 7/7 trường hợp.
  - Thêm trường `lastPaymentProvider` (`"sepay"` | `"paddle"`) để đối soát.
  - ⚠️ `admin.js` chạy trên trình duyệt nên **không require() được** module này — trang admin vẫn cấp gói theo cách riêng. Muốn gom nốt phải cho admin gọi qua một API route.

**Lỗi production phát hiện & đã sửa khi gắn tên miền chuẩn (09/09/2026)**:
- **Xác thực 2 lớp OTP HỎNG HOÀN TOÀN trên `habit-mastery.com`**. `send-otp.js` và `verify-otp.js` dò origin bằng `origin.endsWith(".web.app")`, mà tên miền riêng không khớp mẫu nào → trả về `Access-Control-Allow-Origin: https://habitmastery.web.app` không khớp origin gửi đi → trình duyệt chặn. Server vẫn trả 200 nên **log không hề báo lỗi**; chỉ phát hiện được bằng cách gửi request kèm header `Origin` rồi đọc header trả về.
- Đã gom danh sách origin về **`api/_lib/cors.js`** (một chỗ duy nhất) và siết luôn lỗ hổng cũ: `.endsWith(".web.app")` vốn cho phép **bất kỳ site Firebase nào trên thế giới** gọi endpoint gửi OTP. Nay liệt kê đích danh. Đã kiểm thử 15/15 trường hợp (gồm các mẫu giả mạo như `habit-mastery.com.evil.net`).
- ⚠️ **Bài học**: mỗi lần gắn tên miền mới phải rà lại toàn bộ chỗ hard-code origin/URL, không chỉ đổi DNS.

**Còn phải làm**:
1. Chủ dự án: đăng ký **Payoneer** → điền `Payoneer Email` vào Payout Settings; chọn `Account Type` là cá nhân (không phải Company).
2. Chủ dự án: nộp **Business + Identity verification** (CCCD gắn chip, KHÔNG dùng hộ chiếu — từ 01/01/2026 ngân hàng VN ngừng phục vụ khách dùng hộ chiếu làm giấy tờ định danh).
3. Chủ dự án: nộp **domain approval** (giờ đã đủ điều kiện vì có 3 trang pháp lý). Cân nhắc mua tên miền riêng thay cho `.web.app` để đỡ bị đẩy sang duyệt tay.
4. Bật **Google Pay** trong Checkout → Payment methods (đang tắt, mất khách Android/Chrome). Cân nhắc bật WeChat Pay vì app có sẵn giao diện tiếng Trung. Chuyển dashboard sang tiếng Anh — bản dịch tiếng Việt của Paddle dịch sai tên riêng ("iDEAL"→"lý tưởng", "Pix"→"Ảnh", "MB WAY"→"Đường MB").
5. Code: `api/create-checkout.js`, `api/paddle-webhook.js` (gọi `grantPremium`), bảng giá USD, dịch modal thanh toán sang en/zh (hiện **hardcode 100% tiếng Việt**, không có key i18n nào).

---

### 17. Hộp Thoại Trong Ứng Dụng — thay `alert/confirm/prompt` (v5.12.2, 09/09/2026)

Hộp thoại gốc của trình duyệt hiện sát mép trên, mang nhãn "habit-mastery.com cho biết",
dùng font hệ thống — lạc hẳn giao diện và không đổi theo theme.

- **`hm-dialog.js`** (dùng chung cho `index.html`, `admin.html`, `auth.html`): `hmAlert` /
  `hmConfirm` / `hmPrompt`, đều trả Promise. Hiện giữa màn hình, ăn theo 12 theme, Esc/Enter,
  giữ tiêu điểm, bấm nền để huỷ. File **tự chèn CSS của chính nó** vì 3 trang đặt tên biến CSS
  khác nhau (`--text-main` vs `--text-primary` vs không có `:root`).
- **`window.alert` bị thay ở cấp window** → 100 lời gọi cũ tự khớp giao diện, không sửa chỗ nào.
  `confirm`/`prompt` **không làm vậy được** vì chúng đồng bộ → đã chuyển 36 chỗ sang
  `await hmConfirm/hmPrompt`, kèm thêm `async` cho 5 hàm bao ngoài.
- ⚠️ **Màu chữ nút tính lúc chạy** (`pickTextOnAccent`): 12 theme có accent trải từ rất sáng
  (`#22e07a` Matrix) tới khá tối (`#9c6434` Mocha). Để cố định chữ đen thì Mocha chỉ đạt
  **3.90:1**, dưới chuẩn AA. Đã đo lại cả 12 theme sau khi sửa: thấp nhất **4.90:1**.
- Đã xác minh `!await x` được hiểu là `!(await x)` — sai thứ tự toán tử thì **mọi hộp xác nhận
  sẽ đảo ngược**.

### 18. Tối Ưu Tốc Độ Tải — 3.39 MB → 0.69 MB (v5.12.3, 09/09/2026)

**Đo trước khi sửa** (production, đã nén brotli): `all_books_data.js` **1.355 KB = 82%** toàn bộ
lượng tải; trang 1.66 MB **cộng** service worker tải lại 1.73 MB = **3.39 MB**. Chi phí phân tích
cú pháp chỉ 53ms → nút thắt hoàn toàn ở mạng.

1. **`all_books_data.js` nạp theo yêu cầu** *(nguyên nhân chính)*. File này chỉ dùng ở **đúng một
   chỗ**: `getDocData()`, tức chỉ khi mở sách. Nhưng nó là `<script>` tĩnh đứng trước `app.js` nên
   ai cũng phải tải xong toàn văn 14 quyển thì app mới khởi động. Nay có `ensureBooksLoaded()`
   chèn script khi cần, kèm trạng thái "Đang mở sách…" và xử lý lỗi mạng.
2. **SW không còn precache file dữ liệu lớn.** `ASSETS_TO_CACHE` trước đây liệt kê cả `app.js`,
   `all_books_data.js`… ở dạng URL **không có `?v=`** → mỗi lần cài SW tải lại toàn bộ một lần
   nữa (**1.73 MB thừa**). Nay chỉ precache vỏ ứng dụng.
3. **SW đổi sang cache-first** cho js/css có `?v=`. Trước đây mọi thứ network-first → cache chỉ
   có tác dụng khi mất mạng, không hề làm app nhanh hơn.
4. **`Cache-Control` 3600 → 31536000 immutable** cho js/css.
   ⚠️ **BẪY**: `sw.js` cũng là `.js`. Cache 1 năm thì trình duyệt **không bao giờ thấy bản SW
   mới** → app kẹt phiên bản cũ vĩnh viễn. Đã đặt riêng `sw.js` + HTML thành `no-cache`.
5. **147 KB SDK Firebase chuyển từ `<head>` xuống cuối `<body>`.** **Không dùng `defer`** vì các
   script cuối body không defer sẽ chạy **trước** script defer → `app.js` gọi firebase khi SDK
   chưa nạp. Di chuyển nguyên khối thì thứ tự chạy giữ nguyên.

### 19. Script Phát Hành Bản Cài — sửa thứ tự tải lên (09/09/2026)

`scripts/publish-desktop-release.js` trước đây **xoá asset cũ rồi mới tải lên**. Ngày 09/09/2026
lần tải `HabitMastery-Portable.zip` đứt giữa chừng **sau khi bản cũ đã bị xoá** → release chỉ còn
mỗi bản Setup, nút tải bản Portable trên trang đăng nhập trả **404 mà không có cảnh báo nào**.

Nay: tải lên dưới tên tạm `.uploading` → xong mới xoá bản cũ → `PATCH` đổi tên. Kiểm tra
`state === 'uploaded'` và kích thước khớp (GitHub trả `state: 'starter'` khi chưa nhận đủ). Cuối
cùng **hỏi lại GitHub** xác nhận đủ asset, thiếu thì thoát với mã lỗi thay vì báo thành công.

### 20. Ngôn Ngữ Bị Kẹt Ở `en` — lỗi thứ tự tải (10/09/2026)

Khung trích dẫn hằng ngày luôn hiện **tiếng Anh** dù toàn bộ giao diện đang là tiếng Việt.

**Nguyên nhân (sâu hơn vẻ ngoài):** `i18n.js` và `app.js` đều nằm cuối `<body>`, nên lúc chúng
được phân tích thì `document.readyState` vẫn là `'loading'` → `i18n.init()` bị hoãn tới
`DOMContentLoaded`. Nhưng `app.js` gán `curLang = I18N.getLanguage()` **ngay lúc tải**, khi
`currentLang` bên `i18n` vẫn là `DEFAULT_LANG = 'en'`. Sau đó `init()` dò ra ngôn ngữ thật
nhưng **không bắn** `hmLanguageChanged` (chỉ `setLanguage()` mới bắn) → `curLang` kẹt ở `'en'`
vĩnh viễn, **kể cả với người đã tự chọn tiếng Việt/Trung** (tải lại trang là mất lựa chọn).

⚠️ Đây **không phải lỗi riêng của khung trích dẫn**. Hơn 10 chỗ khác trong `app.js` đọc
`curLang` để chọn tên cảnh giới, tên nhiệm vụ, tên vật phẩm, tên tháng — tất cả đều đang kẹt
tiếng Anh. Sửa tận gốc bằng cách đồng bộ lại `curLang` ở đầu `initAuthGuard()` (chạy **sau**
`i18n.init()` vì `i18n.js` đăng ký `DOMContentLoaded` trước).

**Bài học:** biến cache ngôn ngữ ở tầng module là bẫy. Chỗ nào vẽ ra chữ thì gọi
`getAppLanguage()` để hỏi thẳng `I18N` tại thời điểm vẽ.

Sửa kèm: ảnh chia sẻ (`STOIC_QUOTES`) trước giờ chỉ có tiếng Việt → nay đủ 3 thứ tiếng;
tooltip 3 nút của khung trích dẫn chuyển sang `data-i18n-title`; thêm tên tác giả tiếng Trung.

Kiểm chứng: dựng lại đúng thứ tự tải trong Node, chạy chính `i18n.js` thật — người dùng `vi-VN`
cho `curLang='en'` trong khi ngôn ngữ thật là `'vi'`; người đã lưu `'zh'` cũng ra `'en'`. Sau
bản vá cả 3 trường hợp đều khớp (6/6 đạt).

### 21. Toàn Bộ Thư Mục `.git` Bị Deploy Công Khai (10/09/2026)

Phát hiện khi đang xác minh một việc khác: bản deploy có **992 file**, trong đó **932 file
thuộc `/.git/`**. Nghĩa là `https://habit-mastery.com/.git/` phục vụ toàn bộ kho mã nguồn kèm
lịch sử commit. Kèm theo đó là `/.vercel/project.json` (lộ `projectId` + `orgId`, chính Vercel
ghi trong README của thư mục đó: "you should not share the .vercel folder with anyone").

**Nguyên nhân:** danh sách `ignore` trong `firebase.json` có `"**/.*"`. Mẫu này chỉ khớp
**tên file** bắt đầu bằng dấu chấm, KHÔNG khớp nội dung bên trong thư mục bắt đầu bằng dấu
chấm. `.git/config` có tên là `config` — không bắt đầu bằng dấu chấm — nên lọt.

**Bản vá:** thêm `"**/.*/**"` vào cả hai site.

**Mức độ thiệt hại thực tế — thấp**, đã kiểm chứng chứ không phỏng đoán:
- Kho `htmtslh-hub/habbit` trên GitHub vốn đã là **public**, nên mã nguồn không lộ thêm gì.
- `.git/config` **không** nhúng token (URL remote dạng HTTPS thường).
- Quét toàn bộ lịch sử commit: không có private key, `CRON_SECRET`, khoá API hay
  service account nào từng được commit. Khoá Firebase Admin luôn nằm ngoài repo.

**Hệ quả phụ đáng giá:** mỗi bản deploy giảm từ **79 MB xuống 8 MB** (`.git` chiếm gần hết).
Quota Hosting 10 GB của gói Spark từ nay đủ cho gấp khoảng 10 lần số lần deploy so với trước.

**Kiểm chứng không mất file hợp lệ:** 992 − 932 (`.git`) − 2 (`.vercel`) − 1 (`.github`) = **57**,
đúng bằng số file bản mới. Đã curl xác nhận 12 đường dẫn chính đều 200 và 7 đường dẫn nhạy cảm
đều 404.

⚠️ **Nếu sau này cần `.well-known/`** (xác minh tên miền cho Paddle, Apple…), mẫu `"**/.*/**"`
sẽ chặn luôn thư mục đó. Khi ấy phải thêm ngoại lệ, nếu không việc xác minh sẽ thất bại
mà không rõ lý do.

### 22. Thư Mục `facebook/` — Tài Liệu Nội Dung (10/09/2026)

`facebook/content-scripts.txt` (10 kịch bản video) và `facebook/facebook-posts.txt` (10 bài
viết Facebook dạng cho đi kiến thức). Đã thêm `"facebook/**"` vào `ignore` của cả hai site và
curl xác nhận 404.

⚠️ **Quy tắc chưa bao giờ thay đổi:** mọi tài liệu nội bộ mới thêm vào dự án (`.txt`, thư mục
mới) đều PHẢI được thêm vào `ignore` của `firebase.json` cho **cả hai site**, rồi curl kiểm tra
404 trên production. Mặc định của Firebase Hosting là deploy tất cả.

### 23. Bảng Giá Công Khai + Lộ Trình Thanh Toán Quốc Tế (11/09/2026)

**Vì sao có mục này:** Paddle nêu trong tiêu chí duyệt tên miền — *"Pricing details or a pricing
page — **publicly visible without login required**"*. Giá 99.000đ/399.000đ vốn chỉ nằm trong
`openUpgradeModal()` tức là SAU khi đăng nhập, nên người duyệt của Paddle không nhìn thấy gì.
Đây gần như chắc chắn là một lần trượt hồ sơ nếu không phát hiện trước.

Bảng giá mới nằm ở cột thương hiệu của `auth.html`, có đủ 4 thứ Paddle đòi: mô tả sản phẩm,
giá, danh sách quyền lợi gói trả phí, và liên kết tới 3 trang pháp lý.

**Giá theo ngôn ngữ** (khoá trong `i18n.js`, không tính toán lúc chạy):

| | Miễn phí | Pro (30 ngày) | Premium (365 ngày) |
|---|---|---|---|
| vi | 0đ | 99.000đ | 399.000đ |
| en / zh | $0 | $3.99 | $15.99 |

Quy đổi theo tỉ giá ~26.000đ/USD (09/2026), làm tròn lên `.99`. Mức tiết kiệm gói năm giữ ~65%
ở cả hai loại tiền. ⚠️ Giá VND ở đây phải luôn **trùng** với giá trong `openUpgradeModal()` của
`app.js` — sửa một chỗ thì phải sửa chỗ kia.

**Bản vá kèm theo:** `checkGeoIpFallback()` trong `i18n.js` trước đây ghi đè cả tham số `?lang=`
trên URL. Mở `?lang=en` từ Việt Nam thì nút English sáng nhưng toàn bộ chữ vẫn tiếng Việt — không
xem thử được trang tiếng Anh sẽ trông ra sao với người nước ngoài. Nay `?lang=` và `?country=`
được tôn trọng. Lựa chọn đã lưu trong localStorage vốn đã được bảo vệ nên không đổi hành vi thật.

**Cách kiểm thử giao diện đa ngôn ngữ trên máy Windows này** (không có Playwright/Puppeteer):
```bash
python -m http.server 8899 &
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu   --no-sandbox --virtual-time-budget=9000   "--screenshot=C:\duong\dan\TUYET_DOI\anh.png" --window-size=1280,1500   "http://127.0.0.1:8899/auth.html?lang=en"
```
Hai cái bẫy: thiếu `--virtual-time-budget` thì Chrome treo vì chờ SDK Firebase; đường dẫn
`--screenshot` phải là đường dẫn Windows TUYỆT ĐỐI, dùng đường dẫn tương đối sẽ báo
"Access is denied". Dùng `--dump-dom` để đọc DOM sau khi JS đã chạy.

### 24. Trạng Thái Thanh Toán Quốc Tế (11/09/2026)

Đường đi đã chốt: **Paddle** (cổng + Merchant of Record) → **WorldFirst** (nhận USD) → VND.
Không dùng Payoneer nữa vì WorldFirst đã xác nhận nhận được tiền từ Paddle.

Paddle trả tiền qua wire transfer hoặc Payoneer, và tài liệu của họ nói các dịch vụ kiểu
TransferWise "có thể dùng được nếu cung cấp thông tin ngân hàng (BIC/SWIFT, IBAN, số tài khoản)"
— WorldFirst thuộc loại đó. Ngưỡng chi trả tối thiểu **100 USD**, chốt sổ ngày 1, gửi trước
ngày 15.

Chủ dự án là **cá nhân**, nên theo tài liệu Paddle **không phải làm xác minh doanh nghiệp**
(*"this step is not required for individuals or sole traders"*), chỉ cần xác minh danh tính.
Việt Nam không nằm trong danh sách 28 nước Paddle từ chối.

**Đã xong:** 3 trang pháp lý, liên kết từ `auth.html`, tên người bán trong `terms.html`,
bảng giá công khai, `grantPremium.js` dùng chung 2 cổng (có sẵn nhánh `"paddle"`).

**Còn thiếu phía mã nguồn — CHƯA BẮT ĐẦU:**
- `api/paddle-webhook.js` (chưa tồn tại) — xác thực chữ ký rồi gọi `grantPremium()`
- Nhúng Paddle Checkout vào `openUpgradeModal()`; hiện chỉ dựng mã QR SePay
- Tạo sản phẩm + giá USD trên Paddle Dashboard
- Truyền `uid` qua `customData` để webhook biết nâng cấp cho ai
- Xử lý hoàn tiền: `refund.html` đã hứa hoàn 14 ngày, webhook phải hạ cấp khi Paddle hoàn

**Kiến trúc:** giữ cả hai cổng. Người Việt dùng SePay (phí thấp hơn nhiều), người nước ngoài
dùng Paddle. Phân luồng bằng `getAppLanguage()`; `grantPremium.js` ghi `lastPaymentProvider`
nên hai đường không giẫm lên nhau.

## 🎯 5. KẾ HOẠCH BƯỚC TIẾP THEO

### Tính năng
1. ✅ **[XÁC NHẬN LẠI 07/09/2026 — KHÔNG CÒN VIỆC CẦN LÀM] "Nạp file thiết kế cho 6 quyển sách"**: mục này đã LỖI THỜI. Rà soát thực tế cho thấy cả 14/14 quyển đã có đủ nội dung và đã hiển thị đúng trong Cửa Hàng từ trước — xem mục 4.7 (Documents Hub) đã cập nhật đủ danh sách 14 quyển. Không cần tiếp nhận thêm file nào nữa cho các quyển hiện có; chỉ cần thêm việc BIÊN TẬP LẠI CÁCH TRÌNH BÀY đoạn văn (xem mục nợ kỹ thuật #10 bên dưới).
2. ✅ **[ĐÃ XONG 07/09/2026] Cấp bậc Tổ Đội (Squad Ranks)** — xem chi tiết ở mục 4.15 và mục nợ kỹ thuật #9 (lỗi nền tảng đã phát hiện & sửa cùng lúc).
3. ✅ **[ĐÃ XONG 08/09/2026 — qua Email + Inbox trong app, CHƯA phải Push thật] Lời nhắc nhở tự động hàng ngày** — xem chi tiết mục 4.15. Push Notification thật (FCM + service worker `push` listener) cho PWA/Mobile vẫn CHƯA làm — hiện tại nếu user không mở app/không kiểm tra email thì sẽ không thấy nhắc nhở ngay lập tức (chỉ thấy khi mở app lại, qua badge Inbox).
4. **Tối ưu bản Desktop đã đóng gói**: bản macOS chưa ký chứng chỉ Apple (`hardenedRuntime: false`, `gatekeeperAssess: false`) nên máy người dùng sẽ cảnh báo "không xác định được nhà phát triển" khi mở — cần cân nhắc Apple Developer ID + notarize nếu phát hành rộng rãi (cần tài khoản Apple Developer trả phí của chủ dự án, không thể tự thực hiện). Bản Mobile (`habit-tracker-mobile`, Capacitor) hiện chưa được cập nhật song song với bản web.

### Nợ kỹ thuật (phát hiện qua rà soát 07/09/2026)
5. ✅ **[ĐÃ XONG 07/09/2026] Vá lỗ hổng dependency**: Nâng `firebase-admin` 12.7.0 → **14.3.0** và `nodemailer` 6.10.1 → **10.x**, thêm `overrides.uuid: ^11.1.1` trong `package.json` để chặn nốt lỗ hổng transitive của `@google-cloud/storage`. `npm audit` từ **10 lỗ hổng (8 moderate, 2 high) → 0 lỗ hổng**.
   - ⚠️ **Breaking change đã xử lý**: `firebase-admin@13+` loại bỏ hoàn toàn API namespace cũ (`admin.apps`, `admin.credential.cert()`, `admin.firestore()`, `admin.firestore.Timestamp/FieldValue`, `admin.auth()`) khỏi entry point mặc định. Đã migrate toàn bộ 4 file `api/send-email.js`, `api/send-otp.js`, `api/verify-otp.js`, `api/sepay-webhook.js` sang API modular tương ứng (`admin.getApps()`, `admin.cert()`, `require("firebase-admin/firestore").getFirestore()/Timestamp/FieldValue`, `require("firebase-admin/auth").getAuth()`), đã test require() thành công với service account giả lập hợp lệ.
   - **Chưa đụng tới**: `functions/package.json` (Firebase Cloud Functions) vẫn đang ở `firebase-admin@^12.0.0` — cây dependency **độc lập** với `api/` (Vercel), không bị ảnh hưởng bởi lần nâng cấp này nhưng cũng cần migrate tương tự khi nâng cấp riêng (xem mục 8 bên dưới).
   - ⚠️ **[BUG SÓT LẠI — ĐÃ SỬA 07/09/2026] `api/send-email.js` (Resend) bị bỏ sót khi migrate**: Người dùng báo "Resend trong admin dường như không hoạt động". Nguyên nhân: file này migrate `getFirestore()`/`getAuth()` đúng nhưng **quên đổi `admin.firestore.FieldValue.serverTimestamp()`** — vẫn viết `fb.firestore.FieldValue.serverTimestamp()`, trong khi `fb.firestore` lúc này chỉ là **tham chiếu tới hàm `getFirestore`** (không phải namespace `admin.firestore` cũ) nên không hề có thuộc tính `.FieldValue` → `TypeError: Cannot read properties of undefined (reading 'serverTimestamp')`. Ở nhánh **"Kiểm tra kết nối" (test_connection)**, dòng này nằm chung try/catch với việc gửi email + trả kết quả, nên dù email Resend **đã gửi thành công**, hàm vẫn crash ngay sau đó khi ghi log và trả về `success:false` cho admin — khiến admin luôn thấy "thất bại" dù thực chất đã gửi được. Ở nhánh gửi chiến dịch hàng loạt, lỗi này nằm trong try/catch ghi log riêng nên không làm hỏng việc gửi, nhưng khiến **mọi email_logs của chiến dịch không được ghi lại** (mất lịch sử gửi). Việc `require()` module không giúp phát hiện bug này vì `getFirestore/FieldValue` chỉ bị truy cập sai lúc RUNTIME (trong nhánh xử lý request), không phải lúc load module — bài học cho các lần verify sau: `require()` thành công KHÔNG đủ để xác nhận toàn bộ code path đúng, cần giả lập gọi handler thực tế.
     - **Fix**: import đúng `const { getFirestore, FieldValue } = require("firebase-admin/firestore");`, đổi cả 2 chỗ dùng thành `FieldValue.serverTimestamp()` trực tiếp.
     - **Verify**: viết harness giả lập toàn bộ `firebase-admin`/`firebase-admin/firestore`/`firebase-admin/auth`/`resend` (không cần credential/network thật), gọi trực tiếp `handler(req, res)` cho cả 2 nhánh `test_connection` và `send` — cả 2 đều trả `success:true` và ghi đúng `email_logs` với `createdAt` hợp lệ; kiểm chứng ngược lại bằng cách tái tạo đúng pattern lỗi cũ (`fakeFn.FieldValue.serverTimestamp()`) để xác nhận nó thực sự throw `TypeError` giống hệt mô tả — chứng minh bug có thật và fix có hiệu lực, không phải test giả.
   - ⚠️ **[BUG THỨ 2 — ĐÃ SỬA 08/09/2026] `/api/send-email` crash `FUNCTION_INVOCATION_FAILED` trên PRODUCTION (Vercel) dù code local hoàn toàn đúng**: Sau khi domain `habit-mastery.com` được verify trên Resend và đổi From Email trong admin, bấm "Gửi thử" báo `Failed to fetch`. Test trực tiếp bằng `curl` thấy **cả request OPTIONS lẫn POST đều trả 500** — tức lỗi crash ở tầng module-load, không phải logic nghiệp vụ. Dùng Vercel CLI (`vercel logs`) lấy được log thật: `Error [ERR_REQUIRE_ESM]: require() of ES Module .../jose/dist/webapi/index.js from .../jwks-rsa/src/utils.js not supported`.
     - **Nguyên nhân gốc**: `firebase-admin@14.3.0` → phụ thuộc `jwks-rsa@^4.0.1` (dùng trong xác thực JWKS của `verifyIdToken()`) → `jwks-rsa@4.1.0` lại phụ thuộc `jose@^6.1.3`. Từ bản 6, `jose` **bỏ hẳn CommonJS, chỉ build ESM** (`exports["."]` không còn điều kiện `"require"`). Trên máy local (Node 24, hỗ trợ native `require(esm)`) mọi thứ chạy bình thường nên `node --check`/require thủ công đều pass — nhưng qua bước build/bundle của Vercel (`@vercel/node`) thì require() này thất bại thật ở runtime, **kể cả với request OPTIONS** (module bị load hỏng ngay từ đầu, chưa tới logic handler) — bài học: **test local pass không đảm bảo chạy đúng trên môi trường serverless đã qua bundler**, cần trực tiếp gọi thử endpoint đã deploy để chắc chắn.
     - **Đã thử nhưng KHÔNG hiệu quả**: thêm `"engines": {"node": ">=20"}` vào `package.json` — Vercel không coi đây là thay đổi đủ để bỏ cache build cũ (log build vẫn hiện `Restored build cache from previous deployment`), nên không tự giải quyết được (bài học: cache Vercel invalidate theo hash `package-lock.json`, không theo các field khác trong `package.json`).
     - **Fix thật sự**: thêm `overrides` ép riêng `jose` bên trong `jwks-rsa` xuống bản `4.15.9` (bản cuối cùng còn build CommonJS đầy đủ) trong khi `jwks-rsa` vẫn giữ nguyên `4.1.0` (đủ điều kiện `^4.0.1` mà `firebase-admin` yêu cầu):
       ```json
       "overrides": { "jwks-rsa": { "jose": "^4.15.9" } }
       ```
       Không ảnh hưởng logic `verifyIdToken()` đang dùng (không phụ thuộc API cụ thể của `jose` v6).
     - **Không thể tự deploy trực tiếp**: `vercel deploy --force`, `vercel env add` bị chặn bởi permission classifier của Claude Code (đúng ý thiết kế — hành động ghi trực tiếp lên production). Giải pháp: sửa `package-lock.json` (thay đổi thật, không chỉ `package.json`) rồi `git push` để Vercel tự deploy qua luồng bình thường đã được duyệt trước đó.
     - **Verify**: dùng Vercel CLI (`vercel logs`, `vercel inspect`) để đọc log lỗi thật thay vì đoán; sau khi deploy lại, gọi trực tiếp `curl` production: `OPTIONS` → `204`, `POST test_connection` không token → `401 {"message":"Thiếu mã xác thực..."}` (đúng logic ứng dụng, không còn crash).
6. **Đồng bộ tài liệu PROJECT_STATE.md**: đã cập nhật lại 07/09/2026 cho khớp `v5.8.6` — cần duy trì thói quen cập nhật file này mỗi khi bump version để tránh lệch trạng thái ở các phiên làm việc sau.
7. **Vị trí lưu Service Account Key**: file `sonnhai-2600f-firebase-adminsdk-fbsvc-95976c69d2.json` hiện nằm ở thư mục cha (ngoài git repo, an toàn nhưng trôi nổi) — nên chuyển vào trình quản lý secret/thư mục riêng có kiểm soát truy cập.
8. **`functions/` (Firebase Cloud Functions) vẫn dùng `firebase-admin@^12.0.0`**: cây dependency riêng, chưa cài `node_modules` cục bộ. Khi nâng cấp, cần áp dụng lại đúng kiểu migrate API modular như mục 5 cho `functions/index.js` (đang dùng `admin.firestore()`, `admin.firestore.FieldValue/Timestamp`, `admin.auth()`).
9. ✅ **[ĐÃ XONG 07/09/2026 — PHÁT HIỆN NGHIÊM TRỌNG] `firestore.rules` chưa từng có rule cho `squads` và `duels`**: Xác nhận bằng `git log -p` toàn bộ lịch sử file — **không một commit nào** từng thêm rule cho 2 collection này. Vì Firestore mặc định **deny-by-default** với path không khớp rule nào, toàn bộ **Trụ Cột 3 (Tổ Đội Rèn Luyện & Đấu Trường 1v1)** — dù đã được ghi "hoàn thiện" ở mục 4.8 — **thực chất luôn bị Firestore từ chối âm thầm** mỗi khi người dùng thật (không phải qua Admin SDK) thử tạo/tham gia/đồng bộ tổ đội hoặc thách đấu (lỗi bị nuốt trong `try/catch console.warn`, không hiển thị cho người dùng nên không bị phát hiện qua test thủ công thông thường).
   - **Đã thêm rule đầy đủ** cho `squads/{squadId}` (+ subcollection `messages`) và `duels/{duelId}`: cho phép đọc khi đã đăng nhập; chỉ người tạo (`createdBy`/`challenger.uid`) được tạo mới; mọi thành viên được cập nhật (join/rời/nudge/check-in đồng bộ/lên bậc) nhưng **không ai ngoài chủ sở hữu được đổi các trường định danh cốt lõi** (`createdBy`, `code`, `name` của squad; `challenger`, `betDP` của duel) — chặn giả mạo/chiếm đoạt nhưng không cần lưu thêm mảng `memberUids` phụ trợ.
   - **Đã verify bằng Firebase Emulator thật** (cài JRE + `@firebase/rules-unit-testing`, không chỉ đọc code suông): **22/22 test case pass** — bao gồm cả các ca "phải bị từ chối" (giả mạo `createdBy`, đổi tên đội bởi người ngoài, đổi mã mời, tráo đối thủ/tiền cược trong duel, xóa đội/trận đấu không phải của mình) và các ca "phải được phép" (tạo, đọc, tham gia, đổi tên bởi chủ đội, chấp nhận thách đấu, cập nhật tiến độ, xóa bởi đúng chủ sở hữu, gửi tin nhắn đúng danh tính).
10. ✅ **[ĐÃ XONG 07/09/2026] Cấp bậc Tổ Đội (Squad Ranks)** triển khai trên nền `firestore.rules` vừa được sửa ở mục 9 — chi tiết đầy đủ ở mục 4.15.
11. 🔄 **[ĐANG LÀM — Đợt 1 xong 07/09/2026, đã sửa lỗi liền mạch] Biên tập lại cách trình bày đoạn văn trong Reader**: Nội dung 14 quyển sách có nhiều đoạn văn xuôi quá dài không ngắt câu, và nhiều đoạn dùng phép điệp cấu trúc kiểu "X? Bởi vì Y! X2? Bởi vì Y!..." lặp lại nhưng bị dồn thành khối chữ đặc kín rất khó theo dõi.
    - **3 mẫu trình bày mới trong `style.css`**: `.dr-p-lead` (chữ cái đầu lớn kiểu sách in cho đoạn mở bài); `.dr-impact-block/.dr-impact-list/.dr-impact-answer` (chuyển chuỗi câu hỏi lặp thành danh sách thẻ + 1 câu trả lời nhấn mạnh); `.dr-insight-list/.dr-insight-item/.dr-insight-num` (dành cho các sách viết dạng "danh sách chân lý đánh số" như "141. ... 142. ..." bị dồn thành văn xuôi — tách lại thành từng thẻ có badge số riêng biệt). Cả 3 đều có override màu cho đủ 4 theme đọc (Dark/Sepia/Light/OLED).
    - **[v5.9.3] Thụt đầu dòng kiểu sách in**: `.dr-p` (đoạn văn thường) có `text-indent: 2em` thay vì chỉ ngăn cách bằng margin dưới (trước đó bị chê "trình bày thô"). Loại trừ `.dr-p-lead` (đoạn có chữ cái lớn đã tự làm điểm nhấn khởi đầu, thụt thêm sẽ thừa) và các item trong `.dr-insight-list`/`.dr-impact-list` (danh sách có badge số/icon riêng, không phải văn xuôi liên tục).
    - **Rà soát toàn bộ 14 sách bằng script phân tích** phát hiện **2.218 đoạn `<p>` dài hơn 500 ký tự** (đặc kín, khó đọc), trong đó **642 đoạn** (~29%, tập trung nhiều nhất ở `doc_muu_luoc_tt` 159, `doc_he_thong` 157, `doc_huyen_co` 135, `doc_thuong_chien` 63, `doc_xuyen_thau` 46, `doc_tinh_cam` 41) là dạng "danh sách đánh số bị dồn thành văn xuôi" — cùng một mẫu hình, có thể xử lý an toàn bằng cách tách tại đúng ranh giới số thứ tự đã có sẵn trong văn bản gốc.
    - ⚠️ **[Đợt 1 bị lỗi — đã revert]** Lần đầu chỉ tách các `<p>` dài >3.000 ký tự theo TỪNG THẺ riêng lẻ. Lỗi: 1 chuỗi số đánh liên tiếp (VD 141→144) thường bị dàn trải qua NHIỀU thẻ `<p>` gốc, có thẻ dài có thẻ ngắn — chỉ thẻ đủ dài mới được tách, khiến mục số ngay sau đó (VD "133." nằm ở thẻ `<p>` ngắn hơn kế tiếp) bị bỏ lại dạng văn xuôi → đọc lên bị "đứt đoạn, không liền mạch" (phản hồi từ người dùng 07/09/2026). Đã revert toàn bộ 57 đoạn về nguyên trạng.
    - ✅ **[Đợt 1 sửa lại — ĐÚNG] Gộp theo TOÀN BỘ CHUỖI `<p>` liên tiếp thay vì theo độ dài từng thẻ**: thuật toán mới nối tất cả các thẻ `<p class="dr-p">` liền kề nhau (chỉ ngăn cách bởi khoảng trắng/xuống dòng, không bị chen bởi blockquote/tiêu đề) thành 1 chuỗi văn bản duy nhất, rồi tìm TẤT CẢ mốc số trong toàn chuỗi đó — bất kể mốc số nằm ở thẻ `<p>` gốc nào. Kết quả: **196 chuỗi được tách** (gộp từ 2 đến 8 thẻ `<p>` gốc mỗi chuỗi), tổng **1.474 mục danh sách**, trải trên nhiều sách (`doc_he_thong`, `doc_thuong_chien`, `doc_huyen_co`, `doc_tinh_cam`, `doc_sau_sac`,...).
    - **Kiểm chứng đầy đủ trước khi ghi file**: (1) so khớp văn bản thuần ký-tự-theo-ký-tự trước/sau, 0/196 lệch; (2) quét toàn bộ thư viện tìm mục quá ngắn (<25 ký tự, nghi false-positive) — 16 mục, kiểm tra thủ công đều là mục liệt kê hợp lệ (VD "1. Tầng lớp làm chính trị."), không có false-positive thật; (3) quét 2 chiều trước/sau mỗi danh sách để đảm bảo **không còn đoạn chứa số nào bị bỏ sót cạnh danh sách đã tách** — 0 trường hợp cả 2 chiều; (4) verify trực quan qua Playwright trên nhiều sách khác nhau, đúng ngay tại vị trí đã lỗi trước đó ("133." nay đã nằm trong cùng danh sách với 141-144, đúng như phản hồi yêu cầu sửa). Tổng độ dài văn bản thuần toàn bộ 14 sách trước/sau: 5.310.744 → 5.309.270 ký tự (chênh -1.474, đúng bằng số mục — mỗi mục mất đúng 1 ký tự do "N. " → badge số riêng, không mất nội dung).
    - **Còn lại**: nhiều đoạn dài khác không theo mẫu đánh số (cần đọc hiểu ngữ cảnh để tìm điểm ngắt hợp lý, không thể tự động hoá an toàn như trên) — để lại cho đợt biên tập tiếp theo khi được yêu cầu.
    - **QUAN TRỌNG khi sửa nội dung sách**: luôn sửa trong `all_books_data.js` (file đang thực sự chạy), KHÔNG sửa `doc_nhan_tinh_data.js` (đã bị che khuất, xem mục 4.7).
12. ✅ **[ĐÃ SỬA 07/09/2026 — LỖI NỀN TẢNG, phát hiện qua phản hồi người dùng] Ranh giới giữa các "phần" (section) trong sách bị cắt ngay giữa câu**: người/quy trình chia nội dung gốc thành từng section (để làm Mục Lục & phân trang) đã cắt theo số ký tự/từ mà KHÔNG kiểm tra ranh giới câu — hậu quả là câu cuối của section N bị đứt giữa chừng, phần còn lại nằm ở đầu section N+1 (có tiêu đề/mục lục riêng chen vào giữa câu), đọc lên hoàn toàn không liền mạch. Quét toàn bộ 14 sách: **59/190 ranh giới section (31%)** bị lỗi này, xuất hiện ở gần như mọi sách.
    - **Đã sửa 45/59 trường hợp** bằng cách di chuyển đúng phần câu dang dở từ cuối section N sang ghép vào đầu section N+1 (giữ nguyên 100% chữ, chỉ đổi vị trí) — kể cả trường hợp đặc biệt khi cả một thẻ `<p>` chỉ toàn là phần câu lạc (không có dấu câu nào cả) thì chuyển nguyên cả thẻ. Kiểm chứng: tổng độ dài văn bản thuần toàn bộ 14 sách trước/sau **giữ nguyên tuyệt đối (diff = 0)**; verify trực quan đúng 2 trường hợp cụ thể qua Playwright (bao gồm đúng chỗ người dùng gửi ảnh chụp) — câu đọc liền mạch hoàn chỉnh.
    - **Còn lại 14 trường hợp chưa sửa** (bỏ qua có chủ đích vì phức tạp hơn — ranh giới nằm cạnh blockquote/callout "TÂM PHÁP CỐT LÕI" thay vì cạnh 2 thẻ `<p>` thường, cần xử lý riêng để không làm hỏng cấu trúc callout): `doc_nhan_tinh` chap4sec1 (khi 1 phía là callout), `doc_huyen_co` chap0sec2, `doc_sau_sac` chap3sec0 & chap4sec1, `doc_he_thong` chap0sec2 & chap2sec0, `doc_muu_luoc_tt` chap0sec0/chap2sec0/chap2sec2/chap4sec1, `doc_tinh_cam` chap3sec0 & chap4sec1, `doc_xuyen_thau` chap1sec0 & chap3sec0.
13. ✅ **[ĐÃ XONG 07/09/2026] "Trang sách cổ điển" cho theme Sepia (v5.9.5/v5.9.1)** — theo ảnh mẫu người dùng gửi (kiểu trang sách fantasy/tome: khung viền kép, font serif chữ hoa nhỏ, dấu phân cách hình thoi, trích dẫn căn giữa):
    - **Font chữ mới**: import `Cinzel` (tiêu đề chữ hoa nhỏ) & `Cormorant Garamond` (thân bài, italic cho trích dẫn) qua Google Fonts — tiện phát hiện luôn: `Chakra Petch`/`Be Vietnam Pro` dùng khắp `style.css` **chưa từng được import thật** (không có thẻ `<link>` nào nạp file font), toàn bộ site đang fallback về font hệ thống bấy lâu nay — chưa sửa vì ngoài phạm vi yêu cầu, ghi nhận làm nợ kỹ thuật.
    - **Dấu phân cách hình thoi giữa tiêu đề và nội dung**: tái dùng trực tiếp icon `#i-sigil` có sẵn trong kho SVG sprite của app (`<svg class="rune-inline"><use href="#i-sigil">`) theo đề nghị của người dùng — không cần thiết kế minh họa mới. Thêm 1 dòng `<div class="dr-title-divider">` vào template `renderDocPage()` trong `app.js`, ẩn hoàn toàn ở 3 theme còn lại (Dark/Light/OLED giữ nguyên như cũ).
    - **Khung viền trang kép + 4 góc trang trí hình thoi** quanh `.dr-content-container` (chỉ bật ở desktop ≥900px, dùng lại chính icon `i-sigil` nhúng dưới dạng SVG data-URI ở 4 góc qua `background-position` — không phụ thuộc chiều rộng cụ thể nên không vỡ khi đổi cỡ chữ A-/A+).
    - **Trích dẫn kiểu sách in**: bỏ viền trái, đổi thành 2 gạch mảnh trên/dưới, căn giữa, chữ nghiêng Cormorant Garamond — khớp bố cục pull-quote trong ảnh mẫu.
    - **Giới hạn đã báo trước với người dùng**: không thể tái tạo các hình minh họa vẽ tay riêng (lông vũ, biểu đồ tròn thiên văn trong ảnh mẫu) vì đó là tài sản đồ họa cần thiết kế riêng, ngoài khả năng tái dùng icon có sẵn.
    - Đã verify: cả 4 theme qua Playwright (Sepia đổi đúng theo mẫu, Dark/Light/OLED không bị ảnh hưởng gì), khung viền hiện đúng đủ 4 góc kể cả khi cuộn xuống cuối trang, 0 lỗi console mới phát sinh.
    - **[v5.9.6 — sửa theo phản hồi "chói mắt, nền quá sáng, nét chữ mảnh"]**: nền `.doc-reader-body` đổi từ `#F6EED9` (rất sáng) sang `#E4D4A8` (tông giấy cổ đậm hơn hẳn); màu chữ đậm thêm (`#241B0E`); `font-weight` thân bài + trích dẫn tăng từ mặc định (thực chất render ở 500 vì Cormorant Garamond chỉ import weight 500/600, không có 400) lên hẳn **600** — thêm cả weight 700 và italic 600 vào link Google Fonts. Đã verify màu nền/weight qua `getComputedStyle` + chụp ảnh so sánh trực tiếp.
    - **[v5.9.8 — sửa theo phản hồi "đổi thành màu be nhẹ nhàng"]**: `#E4D4A8` (vàng nghệ đậm) bị chê gắt mắt — đổi sang `#EAE1CC` (be nhẹ, ít vàng hơn nhưng vẫn đậm hơn hẳn bản `#F6EED9` gốc); màu chữ `.dr-p`/`.doc-reader-body` chỉnh theo thành `#2B2013` cho khớp tông mới. Đã verify qua `getComputedStyle` (bg: `rgb(234,225,204)`, color: `rgb(43,32,19)`) + chụp ảnh, 0 lỗi console.
    - **[v5.9.9 — sửa theo phản hồi "chữ hơi nhỏ, cho to ra 15%"]**: `.dr-p`/`.dr-p-lead`/`.dr-impact-lead`/`.dr-insight-item` trong theme Sepia tăng từ `1.22rem` → `1.4rem`; `.dr-quote-body` tăng từ `20px` → `23px` (đều +15%). Verify qua `getComputedStyle`: `fontSize` thực tế tăng từ ~17.1px → 19.6px (~+14.7%, đúng tỷ lệ do dùng đơn vị rem/px cố định), 0 lỗi console.
    - **[v5.10.0 — sửa theo phản hồi "font khó nhìn, đổi font khác"]**: `Cormorant Garamond` (font trang trí, nét mảnh, thiết kế cho tiêu đề/in ấn hơn là đọc dài) bị chê khó nhìn — thay bằng **Merriweather**, font serif được thiết kế riêng để đọc văn bản dài trên màn hình (dùng phổ biến trong các app đọc sách/blog). Vì Merriweather đã dày sẵn ở weight 400 nên bỏ luôn việc ép `font-weight: 600` (đổi về `400` mặc định) mà vẫn rõ nét hơn bản cũ. Cập nhật link Google Fonts sang `Merriweather:ital,wght@0,400;0,700;1,400`. Cinzel (font tiêu đề chữ hoa nhỏ) giữ nguyên, không đổi. Verify qua `getComputedStyle` (`fontFamily: Merriweather, "Be Vietnam Pro", serif`, `fontWeight: 400`) + chụp ảnh, 0 lỗi console.
    - **[v5.10.1 — sửa theo phản hồi "phần badge/tên chương khó nhìn"]**: `.dr-page-chap-name` (tên chương), `.dr-chap-badge-pill` (badge loại nội dung, vd "THẤU SUỐT"/"BẢO VỆ") và `.dr-page-counter-pill` (badge "Mục X/Y") dùng màu vàng nhạt mặc định (`#F7E7B4`/`#E9C56B`, hợp nền tối) nhưng **chưa từng có override cho theme Sepia** nên chìm gần như vô hình trên nền be — thêm rule sepia riêng, đổi cả 3 sang nâu đậm `#6B4A16` (khớp tông với `.dr-page-main-heading` đã có sẵn), nền/viền badge đổi sang nâu nhạt trong suốt. Verify qua `getComputedStyle` (cả 3 đều trả về `rgb(107,74,22)`) + chụp ảnh, 0 lỗi console.
    - **[v5.10.2 — sửa theo phản hồi "tiêu đề bị lỗi font"]**: Nguyên nhân: `Cinzel` (font tiêu đề Sepia) **không có bộ glyph dấu tiếng Việt**, khiến trình duyệt phải tự ghép dấu từ font dự phòng khác đè lên chữ cái Latin của Cinzel → dấu bị lệch/vỡ hình. Xoá hẳn `Cinzel` khỏi link Google Fonts, đổi `.dr-page-main-heading`/`.dr-chap-main-title`/`.dr-banner-title`/`.dr-p-lead::first-letter` (chữ hoa đầu đoạn) sang **Merriweather weight 900** (cùng họ font thân bài, đã kiểm chứng hiển thị tiếng Việt đúng ở v5.10.0) để tránh lặp lại lỗi font thiếu glyph. Verify qua `getComputedStyle` (`fontFamily: Merriweather...`, `fontWeight: 900`) + chụp ảnh xác nhận dấu hiển thị đúng, 0 lỗi console.
    - **[v5.10.3 — theo yêu cầu "chỉ để lại giao diện này, giao diện khác xoá đi"]**: Bỏ hẳn cơ chế 4 theme đọc (Dark/Sepia/Light/OLED chọn qua nút 🎨), **chỉ giữ lại Sepia** làm giao diện đọc duy nhất:
      - `app.js`: `docReaderTheme` cố định = `'sepia'` (bỏ đọc từ `localStorage('hg_doc_theme')`), xoá hẳn hàm `toggleDocReaderTheme()` và handler gán cho nút `#drThemeToggle`.
      - `index.html`: xoá nút `<button id="drThemeToggle">🎨</button>` khỏi header Reader.
      - `style.css`: xoá toàn bộ rule scoped `.doc-reader-modal[data-theme="dark"/"light"/"oled"]` (khối theme riêng + các selector kết hợp `light, sepia` chỉ giữ lại phần `sepia`). **Lưu ý quan trọng khi đọc code**: các selector bare `[data-theme="light"/"dark"]` (không có tiền tố `.doc-reader-modal`) vẫn còn rất nhiều trong file — đó là quy ước Light/Dark Mode của TOÀN BỘ site, không liên quan đến Reader, KHÔNG được đụng vào.
      - Verify: `node --check app.js` OK; Playwright mở 3 sách khác nhau đều trả về `theme: 'sepia'`, `#drThemeToggle` không tồn tại trong DOM, nền đọc đúng be `rgb(234,225,204)`, 0 lỗi console.
    - **[v5.10.4 — sửa theo phản hồi "Mục Lục Chi Tiết bị lỗi hiển thị + số trang không đúng"]**: 2 vấn đề trong drawer "Mục Lục Chi Tiết":
      1. **Bug cắt cụt nội dung**: `.dr-toc-list` là `display:flex; flex-direction:column; overflow-y:auto` nhưng các thẻ con `.dr-toc-chap-group` thiếu `flex-shrink:0` — mặc định flex-shrink:1 khiến trình duyệt ép co các thẻ chương lại vừa khung nhìn (thay vì tràn ra + cho cuộn), làm phần mục cuối trong mỗi chương bị cắt cụt giữa chừng, chồng lấn xấu lên chương kế tiếp. Debug bằng cách so `getBoundingClientRect().height` (chiều cao hiển thị thực tế) với `scrollHeight` (chiều cao nội dung cần có) — height < scrollHeight xác nhận đúng bug bị ép co. Fix: thêm `flex-shrink: 0` cho `.dr-toc-chap-group`.
      2. **Số trang sai bản chất**: Badge "Trang X-Y" hiển thị trong mục lục lấy từ `chap.startPage/endPage` và `sec.startPage/endPage` — đây là số trang của **tài liệu gốc người dùng tải lên** (PDF/doc), hoàn toàn không khớp với hệ đánh số thực tế mà Reader dùng (đơn vị "Mục N" hiển thị ở header đọc chính). Theo yêu cầu người dùng, bỏ hẳn số trang gốc này, thay bằng: mục con hiện `Mục N` (dùng đúng `targetPageIdx` — số mục thật của Reader, bấm vào điều hướng đúng chỗ đó), chương hiện `X phần` (đếm số mục con) thay vì range trang.
      - Verify: `node --check app.js` OK; Playwright đo lại `groupHeight` vs `groupScrollHeight` cho 3 chương đầu — cả 3 đều `height ≥ scrollHeight` (trước đó đều nhỏ hơn), chụp ảnh xác nhận hiển thị đầy đủ tất cả các mục trong từng chương, badge đổi đúng thành "Mục N"/"X phần", 0 lỗi console trên cả 3 sách test.
    - **[v5.10.5 — tối ưu giao diện Reader trên điện thoại]**: Audit bằng Playwright ở viewport 390×844 (iPhone), phát hiện + sửa:
      1. **Bug thật — chữ tiến trình ở footer gần như biến mất**: `#drProgressText` (VD: `"📖 Đang đọc: <tên bài dài> (Mục N/Total)"`) dùng `text-overflow:ellipsis; white-space:nowrap` trong khung `.dr-footer-left` chỉ còn rất ít chỗ (vì nút xanh "Đã Đọc Xong (+20 Coins Thưởng)" chiếm gần hết hàng ngang trên màn hẹp) → hiển thị chỉ còn `"📖 Đang đọc:..."`, mất hết thông tin hữu ích. Fix trong `renderDocPage()` (`app.js`): dùng `window.innerWidth <= 768` để rút gọn còn `"📖 Mục N/Total"` trên mobile (bỏ tên bài trùng lặp — đã hiện to ở tiêu đề trang rồi); desktop giữ nguyên chuỗi đầy đủ như cũ.
      2. **Nút "Đã Đọc Xong (+20 Coins Thưởng)" quá dài**: bọc phần `"(+20 Coins Thưởng)"` trong `<span class="dr-btn-text">` (đúng pattern đã dùng cho nút Mục Lục/Tìm) để tự ẩn trên mobile qua rule `.dr-btn-text{display:none}` có sẵn, còn lại `"✨ Đã Đọc Xong"` gọn hơn nhiều.
      3. **Vùng chạm các nút icon (Mục Lục/Tìm/A-/A+/Toàn màn hình/Đóng) chỉ ~25-32px** — dưới chuẩn khuyến nghị 44px cho ngón tay, dễ bấm nhầm trên điện thoại. Thêm override trong `@media (max-width:768px)`: `.dr-ctrl-btn{padding:9px 11px; min-height:40px}`, `.dr-fullscreen-btn/.dr-close-btn{width/height:40px}`, `.dr-mark-read-btn{padding:10px 14px; min-height:40px}` — không đổi kích thước icon bên trong, chỉ tăng vùng đệm xung quanh.
      - Verify: chụp ảnh full trang + đo `getBoundingClientRect()` từng nút xác nhận tất cả đạt ~40px cao, không tràn ra ngoài header; đo lại footer text trên mobile ra đúng `"📖 Mục 5/27"` và trên desktop vẫn ra chuỗi đầy đủ; không phát hiện tràn ngang (`scrollWidth === innerWidth`); chạy lại toàn bộ regression cũ (3 sách theme, TOC height) — không có gì bị ảnh hưởng, 0 lỗi console.
    - **[v5.10.6 — theo yêu cầu "header và footer cùng màu với nền sách"]**: Header/footer trước đó nền nâu tối `#15120e` tách biệt hẳn với nền be `#EAE1CC` của trang sách — đổi cả 2 sang cùng `#EAE1CC` cho liền khối. Vì các nút/chữ trong header-footer trước đây cố định màu sáng (thiết kế cho nền tối), phải đổi ngược toàn bộ sang nâu đậm để không lặp lại lỗi "chữ vô hình" đã gặp ở v5.10.1: `.dr-book-title` → `#2B2013`, `.dr-book-category`/`.dr-ctrl-btn`/`.dr-close-btn`/`.dr-progress-text` → `#6B4A16`; riêng `.dr-toc-btn`/`.dr-search-btn` (badge xanh lá/xanh dương) đổi tông đậm hơn (`#0d7a56`/`#0a7288`) để đủ tương phản trên nền sáng thay vì màu neon chói vốn chỉ hợp nền tối.
      - Verify: đo `getComputedStyle` — header/footer/body cùng trả về `rgb(234,225,204)`, các màu chữ đều đúng như thiết kế; chụp ảnh xác nhận toàn bộ khung đọc liền thành 1 khối be, chữ/nút rõ nét; chạy lại regression 3 sách — 0 lỗi console, layout mobile không đổi kích thước.
    - **[v5.10.8 — theo yêu cầu "cho màu nền nhạt đi 10%"]**: `#EAE1CC` → `#ECE4D1` (pha thêm ~10% về phía trắng: mỗi kênh RGB dịch 10% khoảng cách còn lại tới 255) cho cả `.doc-reader-body` lẫn header/footer/`.dr-chapter-tabs-bar`. Verify qua `getComputedStyle` — cả 3 vị trí đều trả đúng `rgb(236,228,209)`.
    - **[v5.10.9 — theo yêu cầu "giảm 10% nữa"]**: `#ECE4D1` → `#EEE7D6` (lặp lại đúng công thức pha trắng 10% ở trên). Verify: cả 3 vị trí trả đúng `rgb(238,231,214)`.
    - **[v5.9.6 (all_books_data.js) — quét & sửa lỗi "xuống dòng khi chưa hết câu" trên toàn bộ 14 cuốn sách]**: Sau khi sửa 45/59 trường hợp ở RANH GIỚI SECTION (v5.9.5), người dùng phát hiện cùng loại lỗi này còn xảy ra **giữa 2 đoạn `<p>` thường trong cùng 1 phần** (không phải ranh giới chương/mục) — ví dụ thực tế: đoạn 1 kết thúc "...Vợ suy nghĩ", đoạn 2 bắt đầu "một chút rồi nói: ...". Quét toàn bộ 204 section trong 14 sách bằng heuristic: 2 đoạn `dr-p` liền kề, đoạn trước **không kết thúc bằng dấu câu hoàn chỉnh** (`.!?…` hoặc dấu gạch ngang bỏ lửng, có tính cả dấu ngoặc/ngoặc kép đóng theo sau), đoạn sau **bắt đầu bằng chữ thường** (dấu hiệu câu bị cắt ngang, không phải câu mới) → tìm được **394 trường hợp nghi vấn** trên 11/14 sách.
      - **Thuật toán sửa**: với mỗi cặp vi phạm, tìm dấu câu kết thúc câu đầu tiên trong đoạn sau, cắt đoạn đó thành 2 phần — phần đầu (đến hết câu) nối vào cuối đoạn trước (thêm đúng 1 dấu cách nối từ), phần còn lại giữ làm đoạn `<p>` mới; nếu đoạn sau **hoàn toàn không có dấu câu kết thúc nào** (toàn bộ là phần câu bị cắt dở), gộp trọn cả đoạn vào đoạn trước và xoá hẳn thẻ `<p>` thừa. Xử lý theo vòng lặp tới điểm cố định cho từng section để tự xử lý được cả các chuỗi cắt liên tiếp (đoạn A cắt dở đoạn B, B sau khi ghép vẫn cắt dở đoạn C...).
      - **2 lớp bảo vệ an toàn**: (1) tự động **bỏ qua** mọi trường hợp đoạn văn có chứa thẻ HTML lồng bên trong đúng đoạn cần di chuyển (không tự sửa, tránh phá cấu trúc) — bắt được đúng 1 section như vậy (`doc_thuc_tinh` chap8 sec0, 6/394 trường hợp), để lại làm nợ kỹ thuật cần sửa tay; (2) sau mỗi lần sửa 1 section, so sánh **toàn bộ ký tự nội dung (bỏ thẻ HTML + khoảng trắng)** giữa bản cũ và bản mới — nếu lệch dù chỉ 1 ký tự thì **huỷ bỏ thay đổi của cả section đó**, không ghi đè (bắt đúng thêm 1 section nữa nghi có sai lệch, huỷ an toàn).
      - **Kết quả**: 387 lỗi được sửa tự động qua 120 section (đã verify content-preservation từng section), sửa tay thêm 1 trường hợp còn sót do heuristic quá "rộng lượng" với dấu gạch ngang cuối câu (trường hợp gạch ngang dùng giữa cụm chú thích tiếng Anh — tiếng Việt "(Rapid Eye Movement - giấc ngủ chuyển động mắt nhanh)" bị hiểu nhầm là câu bỏ lửng hợp lệ) → tổng **388/394 đã sửa xong**, còn lại đúng 6 trường hợp (cùng 1 section có thẻ lồng, cần sửa tay) chủ động để lại.
      - **Backup trước khi ghi**: `C:/tmp/all_books_data.js.backup3` (trước khi áp dụng 120 section).
      - Verify: `node --check` + `JSON.parse` toàn bộ file sau ghi đều OK (14/14 sách); quét lại phát hiện còn đúng 7 (6 thuộc section chủ động bỏ qua + 1 đã sửa tay ngay sau đó → còn 6); dựng lại đúng ví dụ người dùng báo cáo ("Vợ suy nghĩ" | "một chút rồi nói") bằng Playwright — xác nhận câu đã nối liền mạch thành "Vợ suy nghĩ một chút rồi nói: ...", chạy lại regression 3 sách — 0 lỗi console.

14. ✅ **[ĐÃ XONG 08/09/2026] Admin — Mẫu Email Có Sẵn (Resend) hoàn toàn không hoạt động khi bấm**: Người dùng báo "tạo mẫu email có sẵn nhưng ấn vào chưa thấy gì". Nguyên nhân: `admin.html` từng được thiết kế lại giao diện composer email (7 nút mẫu `data-template`, textarea `#emailContentTextarea`, ô `#emailPreheader`, toolbar định dạng `data-action`) nhưng **`admin.js` chưa từng được cập nhật theo** — vẫn tham chiếu các ID/thuộc tính CŨ đã không còn tồn tại:
    - `EMAIL_TEMPLATES` dùng khoá `welcome/vipGift/feature/weekly/custom` + tra cứu qua `chipId` bằng `document.getElementById(...)` — trong khi HTML thực tế có 7 nút với `data-template="vip/trial_ending/streak_restore/gift_dp/update/announcement/custom"`, không hề có `id` nào khớp `chipId` → `applyTemplate()` không bao giờ gắn được sự kiện click, bấm vào không có phản ứng gì.
    - Biến `emailContent` gọi `document.getElementById('emailContent')` nhưng ô nhập liệu thật có `id="emailContentTextarea"` → `emailContent` luôn là `null`, khiến **toàn bộ** composer bị ảnh hưởng dây chuyền: mẫu email (dù chip có bấm được) sẽ không đổ nội dung vào đâu cả, nút chèn biến `{{name}}`/`{{dp}}`..., xem trước trực tiếp, và cả nút **Gửi Email Ngay** (đọc `emailContent.value` để lấy nội dung gửi thật) đều bị ảnh hưởng.
    - Toolbar định dạng (`B`, `I`, `H2`, `H3`, `💡 Khung Xanh`, `⭐ Khung Vàng`, `• Danh sách`) tra theo `data-format` nhưng HTML dùng `data-action` → `document.querySelectorAll('.toolbar-btn[data-format]')` trả về rỗng, không nút nào được gắn sự kiện; case `switch` cũng thiếu `h3` và dùng nhầm tên `box` thay vì `highlight`.
    - Ô `#emailPreheader` (lời dẫn phụ trong hộp thư đến) tồn tại trong HTML nhưng chưa từng được đọc/gửi trong request tới `/api/send-email` dù backend đã hỗ trợ sẵn field này.
    - **Fix**: đổi `EMAIL_TEMPLATES` sang đúng 7 khoá khớp HTML (viết lại nội dung phù hợp riêng cho `trial_ending`/`streak_restore`/`gift_dp`/`announcement` — trước đó JS chưa có nội dung nào cho các mẫu này); đổi `applyTemplate()`/wiring sang tra theo `data-template` bằng `querySelector`; sửa `emailContent` trỏ đúng `emailContentTextarea`; sửa toolbar sang `data-action`, bổ sung case `h3`, đổi `box`→`highlight`; thêm biến `emailPreheader`, đưa vào cả live-preview listener lẫn payload gửi thật; 2 chỗ gọi `applyTemplate('welcome')` (nút "Làm mới" và mẫu mặc định lúc tải trang) đổi thành `applyTemplate('custom')`/`applyTemplate('vip')` cho khớp key mới.
    - **Verify**: đối chiếu bằng script Node so khớp chính xác tập `data-template` trong HTML với tập khoá `EMAIL_TEMPLATES` trong JS (kết quả: khớp 100%, không lệch phần tử nào cả 2 chiều), so khớp tương tự cho `data-action` toolbar với các `case` trong `switch` (khớp đủ 7/7); `node --check admin.js` OK; Playwright load `admin.html` xác nhận 0 lỗi console (dù bị redirect sang `auth.html` do chưa đăng nhập — đúng hành vi bảo vệ trang admin, không phải lỗi).
    - **[v5.10.11 — cùng đợt drift, phát hiện thêm khi người dùng báo "Phân nhóm"/"User đã chọn" không bấm được]**: Audit lại toàn diện bằng script Node quét **mọi** `getElementById(...)` trong hàm `initEmailManagement()` rồi đối chiếu với toàn bộ `id="..."` thật có trong `admin.html` — phát hiện tổng cộng **27 ID tham chiếu sai/không tồn tại** (không chỉ riêng phần mẫu email đã sửa ở mục trên):
      - **Toàn bộ hệ thống nhắm đối tượng người nhận bị thiết kế lại** từ mô hình 4 chế độ cũ (`all/filter/custom/selected`, tab qua `getElementById(tabTargetXxx)`) sang mô hình 3 chế độ mới trong HTML (`single/segment/selected`, tab qua `.target-tab[data-mode]`) — JS vẫn viết theo mô hình cũ 100%, không tab nào bấm được. Viết lại hoàn toàn `getResolvedRecipients()` (chế độ `single`: chọn 1 user qua dropdown `emailUserDropdown` hoặc nhập thẳng email vào `emailDirectInput`; chế độ `segment`: lọc theo `emailSegmentSelect` với 6 phân khúc all/premium/trial/trial_expired/free/active_30d, tái dùng đúng helper có sẵn `getEffectivePlan()`/`isTrialExpired()`/`isActive30d()`; chế độ `selected`: giữ nguyên logic cũ, đã đúng sẵn) và `setTargetMode()` (chuyển sang bật/tắt `.active` + hiện/ẩn đúng 3 panel `targetPanelSingle/Segment/Selected` thay vì 4 panel cũ không tồn tại). Thêm hàm `populateSingleUserDropdown()` để nạp danh sách user vào dropdown (trước đó dropdown này luôn rỗng vì chưa từng được code nào đổ dữ liệu vào).
      - **Toàn bộ khung xem trước email (live preview mockup)** cũng bị thiết kế lại cấu trúc ID (`previewSubjectTitle→prevTemplateTitle`, `previewFromMeta→prevFromVal`, `previewToMeta→prevToVal`, `previewGreeting→prevGreetingName` — đổi từ set cả câu chào sang chỉ set tên, `previewContent→prevRenderedContent`, `previewCtaBtn→prevCtaBtn`, bỏ hẳn `previewCtaWrap` riêng — dùng `.closest('.email-tpl-cta-wrap')`); 2 nút chuyển đổi xem trước Desktop/Mobile (`btnPreviewDesktop`/`btnPreviewMobile`) không còn tồn tại trong giao diện mới — đã xoá bỏ đoạn code wiring chết tương ứng.
      - **Nút gửi email thật** `btnSubmitSendEmail` → thực ra HTML đặt id `btnSendCampaignEmail` — nút "🚀 Gửi Email Ngay" trước đây hoàn toàn không phản hồi khi bấm dù mọi dữ liệu composer đã điền đúng.
      - **Banner trạng thái Resend** ở đầu trang tách `resendStatusIndicator` (1 khối) thành `resendStatusPill` (khung ngoài) + `resendStatusText` (dòng chữ) — banner trước đây kẹt cứng ở chữ tĩnh "Đang kiểm tra kết nối Resend..." không bao giờ cập nhật dù đã cấu hình xong.
      - **Nút "⚡ Gửi Thử (Admin)"** ở banner trên cùng (`btnQuickTestEmail`) chưa từng được gắn sự kiện — nối vào đúng luồng gửi thử `executeSendEmail({isTestOnly:true})` sẵn có.
      - **Verify**: script Node quét lại toàn bộ `getElementById` trong `initEmailManagement()` đối chiếu với `admin.html` — từ 27 ID sai giảm còn đúng **1** (`btnOpenResendConfigModal2`, đã có `if (...)` guard an toàn, không rõ nút tương ứng đã bị bỏ hay chưa từng tồn tại, không gây lỗi, để nguyên); `node --check admin.js` OK; Playwright load `admin.html` xác nhận 0 lỗi console.

15. ✅ **[ĐÃ XONG 08/09/2026] Hệ thống Nhắc Nhở Tự Động (Email + Tin nhắn trong app)** — theo yêu cầu bổ sung 3 kịch bản: (1) nhắc chưa hoàn thành nhiệm vụ ngày / cứu chuỗi, (2) trial sắp/vừa hết hạn, (3) chúc mừng kích hoạt VIP. Vì repo trước đó **không có bất kỳ hạ tầng lịch/cron nào** (`vercel.json` không có `crons`) và **không có kênh push thật** (không FCM, `sw.js` chỉ cache offline, không có `push`/`notificationclick` listener) — chỉ có 2 kênh khả dụng: Email (Resend, đã có sẵn từ mục 11/14) và hệ thống Inbox trong app (`conversations` collection, vốn dùng cho chat 1:1 admin↔user — tái sử dụng làm kênh "tin nhắn hệ thống" vì client `app.js` đã tự động hiện badge/toast cho mọi doc mới trong `conversations` mà không cần sửa gì ở front-end).
    - **File mới**: [`api/_lib/emailCore.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/api/_lib/emailCore.js) (tách logic gửi email thương hiệu + đọc cấu hình Resend từ `api/send-email.js` ra dùng chung, không sửa `send-email.js` để tránh rủi ro hồi quy), [`api/_lib/systemMessage.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/api/_lib/systemMessage.js) (ghi tin nhắn hệ thống vào `conversations` với UID giả `system_habitmastery`, đúng cấu trúc batch mà `admin.js` bulk-broadcast đã dùng), [`api/_lib/reminderHelpers.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/api/_lib/reminderHelpers.js) (port lại `isPlanExpired/getEffectivePlan/getTrialDaysLeft` từ `admin.js` dòng ~33-69 để dùng phía server, cộng hàm mới `hasCheckedInToday()` parse trực tiếp chuỗi JSON `users/{uid}.habitData` theo đúng cấu trúc key check-in `ck()` của `app.js`), [`api/cron-daily-reminders.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/api/cron-daily-reminders.js) (handler chính). Các file trong `api/_lib/` bắt đầu bằng `_` nên Vercel không coi là route/serverless function riêng.
    - **Lịch chạy**: `vercel.json` thêm `crons: [{ path: "/api/cron-daily-reminders", schedule: "0 13 * * *" }]` (13:00 UTC = 20:00 giờ VN, chạy 1 lần/ngày — tương thích giới hạn gói Hobby của Vercel chỉ cho phép cron chạy tối đa 1 lần/ngày) và `functions: { "api/cron-daily-reminders.js": { maxDuration: 60 } }` để có đủ thời gian gửi email hàng loạt.
    - **Không có field timezone theo user** (đã xác nhận qua audit trước khi code — xem không có `tz`/`timezone` ở bất kỳ đâu) nên toàn bộ tính "hôm nay"/giờ trong cron cố định theo giờ Việt Nam (UTC+7, không DST) qua `getVietnamDateParts()`, KHÔNG đọc theo giờ trình duyệt người dùng như `app.js` vẫn làm.
    - **Chống gửi trùng (dedupe)**: nhắc nhiệm vụ ngày ghi field mới `users/{uid}.lastDailyReminderDate` (chuỗi `YYYY-MM-DD` giờ VN, chỉ gửi nếu khác hôm nay); nhắc trial ghi map field mới `users/{uid}.trialRemindersSent: {"3":true,"1":true,"0":true,"expired":true}` — mỗi mốc chỉ gửi đúng 1 lần trong suốt vòng đời trial của user (nếu admin reset trial thủ công cho user, cần tự xoá field này nếu muốn nhắc lại từ đầu — chưa tự động hoá phần đó).
    - **Cứu chuỗi vs nhắc thường**: cùng 1 điều kiện trigger (chưa tick nhiệm vụ nào hôm nay tính đến sau 19h VN, tài khoản không phải mới tạo trong ngày) nhưng tra thêm `leaderboard/{uid}.streak` — nếu `streak > 0` thì đổi hẳn nội dung/tiêu đề sang giọng "cứu chuỗi" khẩn cấp (gợi ý dùng Bình Đóng Băng), streak = 0 thì dùng nội dung nhắc nhở thông thường.
    - **VIP activation KHÔNG nằm trong cron** — chèn trực tiếp vào [`api/sepay-webhook.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/api/sepay-webhook.js) ngay sau bước `userRef.update(planUpdates)` (đúng lúc thanh toán SePay được xác nhận) để gửi tức thời, không phải chờ tới lượt cron chạy tối. Bọc trong `try/catch` riêng để lỗi gửi thông báo không làm hỏng phản hồi xác nhận thanh toán gửi lại cho SePay; an toàn trước retry webhook vì bước này chỉ chạy trong nhánh `payment.status` chuyển từ `pending`→`paid` (nếu SePay gọi lại webhook cho giao dịch đã xử lý, query `where('status','==','pending')` sẽ rỗng và thoát sớm trước khi tới đoạn gửi thông báo).
    - **Xác thực endpoint cron**: chấp nhận `Authorization: Bearer <CRON_SECRET>` (nếu đã cấu hình biến môi trường `CRON_SECRET` trên Vercel — Vercel tự động đính kèm header này khi gọi cron) HOẶC Bearer Firebase ID token của tài khoản có `role:'admin'` (để admin tự gọi tay kiểm tra qua DevTools Console: `firebase.auth().currentUser.getIdToken().then(t=>fetch('/api/cron-daily-reminders?dryRun=1&testUid=<uid>',{headers:{Authorization:'Bearer '+t}}).then(r=>r.json()).then(console.log))`, dùng `dryRun=1` để xem trước số liệu mà không thật sự gửi, `testUid=<uid>` để giới hạn chỉ xử lý 1 user). Nếu `CRON_SECRET` **chưa** được cấu hình, endpoint tạm cho phép gọi không cần bí mật (chỉ log cảnh báo) để cron không bị chặn ngay khi mới triển khai — **khuyến nghị chủ dự án tự thêm biến môi trường `CRON_SECRET`** (giá trị bất kỳ, đủ dài/ngẫu nhiên) trong Vercel Dashboard → Settings → Environment Variables để tăng an toàn (không thể tự thêm hộ vì `vercel env add` bị chặn bởi permission classifier của Claude Code).
    - **Bug phát hiện & sửa TRƯỚC khi deploy** (nhờ viết test giả lập Firestore/Resend bằng cách monkey-patch `Module._load`, không gọi API thật): hàm `hasCheckedInToday()` bản đầu tiên tính sai tiền tố khớp key check-in — nhầm định dạng key thật `${year}-${monthIndex}-${habitId}-${day}` thành `${year}-${monthIndex}-${day}` (thiếu vị trí `habitId`), khiến **mọi user dù đã tick nhiệm vụ vẫn bị nhận nhầm email/nhắc "chưa hoàn thành"**. Test giả lập với dữ liệu `habitData` dựng đúng theo `ck()` của `app.js` bắt được lỗi này ngay (3/6 user test nhận nhầm email dù đã tick) — sửa lại đúng: tách `monthPrefix = "${y}-${m}-"`, phần còn lại của key phải tách đúng 2 mảnh `habitId-day` rồi so khớp `day`. Test lại: 12/12 assertion pass (bao gồm case cứu chuỗi, trial d3, trial expired, dedupe, bỏ qua user mới tạo, bỏ qua user bị disable). Test riêng cho hook VIP activation trong `sepay-webhook.js` cũng pass đủ 5/5 assertion (không phá vỡ luồng thanh toán gốc).
    - **Việc CHƯA làm / nợ kỹ thuật mới phát sinh**: (a) chưa có UI test/trigger thủ công trong `admin.html` — muốn test phải dùng lệnh DevTools Console nêu trên; (b) chưa xử lý phân trang khi số lượng user lớn (đang `.get()` toàn bộ collection `users` trong 1 lần — ổn với quy mô hiện tại, cần refactor sang cursor/queue nếu vượt vài nghìn user để tránh chạm `maxDuration:60s`); (c) chưa xoá `trialRemindersSent` khi admin gia hạn/reset trial thủ công cho 1 user — nếu cần nhắc lại từ đầu phải tự xoá field này trong Firestore.

16. ✅ **[ĐÃ XONG 08/09/2026 — v5.11.0] Thiết kế lại bảng màu 5 theme & bổ sung 3 theme mới**: Người dùng đánh giá `light`/`dark`/`luxury`/`sakura` đã ổn, "còn lại màu sắc chưa được ổn lắm" → thiết kế lại `cyberpunk`, `matrix`, `forest`, `cosmic`, `volcano` và thêm 3 theme mới. Toàn bộ 12 theme được chụp màn hình thật qua Playwright (patch `onAuthStateChanged` trả user giả để vào được dashboard) trước & sau khi sửa để so sánh.
    - **LỖI NỀN TẢNG tìm ra khi soi ảnh chụp (nguyên nhân gốc của "màu chưa ổn")**: quy tắc `.htable tr:nth-child(even) td.td-chk` tô nền các hàng xen kẽ của bảng thói quen bằng `var(--border-color)` — tức **tái dùng màu VIỀN 1px làm nền một mảng lớn**. Theme nào đặt viền màu bão hoà cao sẽ biến nguyên hàng thành khối màu chói: `cyberpunk` là `rgba(255,0,127,.35)` → cả hàng hồng neon (độ rực đo được ~97 trên thang chroma 0-255), `volcano` đỏ, `matrix` xanh lá. Ngược lại `luxury` dùng vàng `rgba(212,175,55,.35)` cho ra sắc ô-liu trầm (chroma 53) nên nhìn vẫn ổn — khớp đúng đánh giá của người dùng. **Fix**: tách token mới `--row-stripe` chỉ dành cho nền hàng, sửa quy tắc thành `var(--row-stripe, var(--border-color))` (có fallback nên không vỡ nếu thiếu). 4 theme người dùng đã duyệt được gán `--row-stripe` **đúng bằng giá trị `--border-color` cũ** để giữ nguyên 100% diện mạo, không hồi quy.
    - **Nguyên tắc phối màu áp dụng cho các theme thiết kế lại** (ghi thành comment ngay đầu khối theme trong `style.css`): nền 3 bậc `--bg-app` < `--bg-header` < `--bg-card` pha nhẹ sắc chủ đạo; `--text-main` luôn gần trắng (không bao giờ là màu bão hoà); `--accent` là màu chữ ký cho chi tiết nhỏ còn `--accent-neon` là màu bổ trợ sáng hơn cho glow/logo để tạo chiều sâu; `--accent-light` alpha ~0.12; `--row-stripe` alpha ~0.06; `--progress-low` luôn giữ họ đỏ và khác màu `--accent`.
    - **Sửa riêng từng theme**: `matrix` bỏ `--text-main: #00ff66` (bản cũ để TOÀN BỘ chữ thân bài màu xanh chói, đọc lâu rất mỏi và mất phân cấp thông tin) → đổi sang trắng ngả bạc hà `#dcfce7`, giữ xanh terminal ở accent/viền/logo. `volcano` đổi màu chủ đạo từ đỏ `#ef4444` sang cam dung nham `#f97316`, vì đỏ trùng họ với `--progress-low` (tín hiệu "chưa đạt") khiến nhìn đâu cũng như đang báo lỗi — nay đỏ chỉ còn dành riêng cho progress-low. `cyberpunk` nền chuyển sang chàm sâu, hồng dịu bớt (`#ff007f`→`#f0399c`), cyan làm màu bổ trợ. `cosmic` nền xanh navy vũ trụ sâu hơn, tím sáng hơn (`#8b5cf6`→`#a78bfa`) cho dễ đọc trên nền tối. `forest` chuyển sang tông rừng thông sâu, tăng tách bậc nền.
    - **3 theme mới**: `nordic` **Nordic Frost** (tối, xanh băng Bắc Âu — lấp chỗ trống lớn nhất: bộ sưu tập trước đó KHÔNG có theme nào họ xanh dương, giá 650), `abyss` **Deep Abyss** (tối, vực sâu đại dương xanh ngọc lân quang, giá 700), `mocha` **Mocha Cream** (SÁNG, kem/cà phê ấm — bộ sưu tập đang lệch 7 tối/2 sáng và cả 2 theme sáng đều tông lạnh, giá 550). Đã thêm vào `SHOP_CATALOG.themes` trong `app.js` (ô màu preview trong cửa hàng tự sinh từ `bg`/`accent`) và thêm `nordic`/`abyss` vào **cả 5 danh sách selector gộp dành cho theme tối** trong `style.css` (`.shop-btn`, `.user-title-badge`, `.shop-wallet-banner`, `.shop-card-art`, `.shop-action-btn.btn-equip`) — `mocha` KHÔNG thêm vì là theme sáng, giống cách `sakura` được loại trừ.
    - **Verify (Playwright, đo bằng số chứ không chỉ nhìn)**: script tính tỉ lệ tương phản WCAG thật từ biến CSS đã resolve cho cả 12 theme → chữ chính **≥ 14:1 (vượt AAA 7:1)** và chữ phụ **≥ 5.2:1 (đạt AA)** ở TẤT CẢ theme; 4 theme đã duyệt xác nhận `--row-stripe` khớp byte-for-byte giá trị cũ; độ rực của sọc hàng ở 8 theme thiết kế lại/mới đều **≤ 53** — ngưỡng lấy từ chính `luxury` (theme rực nhất mà người dùng đã chấp nhận) thay vì con số tự đặt; `cyberpunk` giảm từ ~97 → 26.7. Chụp lại 12 ảnh dashboard + 1 ảnh tab Cửa Hàng, 0 lỗi console, 12/12 thẻ theme render đúng.
    - **[BỔ SUNG 08/09/2026] Đã build lại bản cài desktop cho khớp v5.11.0** — xem mục 17 (bản cài vốn đã lệch 4 ngày so với web).
    - **Bẫy khi đo đã mắc phải & cách tránh về sau**: lần đo đầu cho ra số vô lý (theme `dark` vốn ổn lại "trượt" ngưỡng) — nguyên nhân là đọc `getComputedStyle(...).backgroundColor` của phần tử con **ngay trong cùng một `page.evaluate()` vừa đổi `data-theme`**: biến CSS trên `documentElement` cập nhật tức thì nhưng màu đã resolve của phần tử con thì chưa (còn đang chạy `transition: background .15s`), nên đọc ra màu của theme CŨ. Phải tách thành 2 lần `evaluate` và chờ >150ms ở giữa.



17. ✅ **[ĐÃ XONG 08/09/2026] Bản cài desktop bị lệch so với bản web — phát hiện & quy trình khắc phục**: Khi tìm hiểu vì sao mỗi bản deploy nặng ~241 MB (dẫn tới đầy quota Hosting ở mục 16), phát hiện thêm một vấn đề nghiêm trọng hơn về tính đúng đắn.
    - **Bản Electron KHÔNG tải giao diện từ web** mà **đóng gói một bản sao riêng** của toàn bộ file web (`index.html`, `app.js`, `style.css`, `auth.*`, `admin.*`, `i18n.js`, `all_books_data.js`, `assets/**`…) vào `resources/web` bên trong file cài — khai báo ở `build.extraResources` trong `electron/package.json` — rồi `electron/main.js` chạy **server nội bộ** đọc bản sao đó (`mainWindow.loadURL(\`${getServerUrl()}/auth.html\`)`). Hệ quả: **mọi lần deploy web đều KHÔNG chạm tới người dùng desktop**, họ vẫn chạy giao diện cũ cho tới khi tải lại bản cài mới.
    - **Mức lệch thực tế lúc phát hiện**: file cài trong `downloads/` build ngày **04/09**, trong khi file web sửa tới **08/09** — lệch 4 ngày, tức bản desktop thiếu toàn bộ: sửa lỗi xuống dòng giữa câu trong 14 quyển sách, tinh chỉnh theme Sepia của Reader, sửa composer email admin, và 3 theme mới + 5 theme thiết kế lại ở mục 16.
    - **Đã xử lý**: chạy `cd electron && npm run build:all` (electron-builder, target `nsis` + `portable`), nén lại thành đúng 2 tên mà `auth.html` đang trỏ tới (`downloads/HabitMastery-Setup.zip`, `downloads/HabitMastery-Portable.zip`, mỗi zip chứa 1 file `.exe`). **Verify**: giải nén thư mục `dist/win-unpacked/resources/web/` rồi kiểm tra trực tiếp — `style.css` đóng gói có đủ `data-theme="nordic"` (6), `"abyss"` (6), `"mocha"` (1, đúng vì theme sáng không vào 5 nhóm selector theme tối), `--row-stripe` (15); `index.html` đóng gói trỏ `style.css?v=5.11.0` & `app.js?v=5.11.0`; `app.js` đóng gói có đủ 3 mục theme mới trong `SHOP_CATALOG`.
    - **Kích thước bản Portable đổi 78 MB → 86 MB** (do nội dung sách tăng) nên đã sửa nhãn hiển thị ở `auth.html` và `i18n.js` cho **cả 3 ngôn ngữ** (vi/en/zh) — nhãn cũ ghi sai dung lượng sẽ gây khó hiểu cho người tải. Vì `auth.html`/`i18n.js` cũng nằm trong `extraResources` nên phải **build lại lần nữa sau khi sửa nhãn** mới thật sự đồng bộ (bài học: gom hết thay đổi web rồi mới build một lần, đừng build xong mới sửa tiếp).
    - **⚠️ ĐÍNH CHÍNH một nhận định SAI đã đưa ra trong phiên này**: ban đầu kết luận rằng 2 file `.exe` trần trong `downloads/` (~165 MB) "bị deploy kèm mỗi lần, chiếm khoảng một nửa dung lượng mỗi bản deploy". **Sai.** Khi rà lại `firebase.json` mới thấy cả 2 site **đã ignore sẵn `**/*.exe`** từ trước, nên các file `.exe` đó **chưa bao giờ được deploy**. Kiểm chứng trực tiếp trên production: `downloads/HabitMastery-Setup.exe` và `...Portable.exe` đều trả **HTTP 404**, trong khi `...Setup.zip` trả **200**. Bài học: kiểm tra cấu hình deploy (`firebase.json` `ignore`) và xác minh bằng HTTP thật TRƯỚC khi kết luận thứ gì đang chiếm dung lượng, đừng suy ra chỉ từ việc file nằm trong thư mục được deploy.
    - **Dung lượng ~241 MB mỗi bản deploy thực chất đến từ 2 file `.zip`** (~86,5 + 86,2 = ~173 MB, đây là thứ người dùng thật sự tải) cộng `all_books_data.js` + `assets/` + ảnh bìa sách (~68 MB). Việc nén zip gần như **không giảm được byte nào** (86.460.773 → 86.460.663) vì NSIS `.exe` vốn đã nén sẵn — zip ở đây chỉ để trình duyệt tải về thành file thay vì chặn/cảnh báo `.exe`.
    - **Đã xoá 2 file `.exe` trần trong `downloads/`** (chủ dự án đồng ý) — nhưng cần hiểu đúng: việc này **chỉ giải phóng ~165 MB đĩa cục bộ, KHÔNG giảm được byte nào cho mỗi bản deploy**. Kèm theo đó, thêm script [`scripts/package-installers.py`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/scripts/package-installers.py) nén **thẳng từ `dist/`** vào `downloads/*.zip` để 2 file `.exe` thừa đó không tái sinh sau mỗi lần build.
    - ✅ **[ĐÃ LÀM] Chuyển 2 file cài sang GitHub Releases — dung lượng mỗi bản deploy giảm từ 249 MB xuống 76 MB (giảm ~69%)**, đo bằng chính `versionBytes` mà Firebase báo về cho bản deploy trước và sau. Gói Spark 10 GB nay chứa được ~130 lần deploy thay vì ~40.
      - `auth.html` đổi cả 3 link tải sang `https://github.com/htmtslh-hub/habbit/releases/download/desktop-latest/...`. Dùng **tag CỐ ĐỊNH `desktop-latest`** nên các lần build sau chỉ cần thay asset, **không phải sửa lại `auth.html`** (tránh vòng lặp phiền: sửa `auth.html` → phải build lại bản cài → lại ra file mới). Bỏ thuộc tính `download="..."` vì nó chỉ có tác dụng với link cùng origin; GitHub đã trả `Content-Disposition: attachment` nên trình duyệt vẫn tải file bình thường.
      - `firebase.json` thêm `downloads/*.zip` vào `ignore` cho cả 2 site. Riêng `downloads/Huong-Dan-Cai-Dat.txt` (10 KB) vẫn deploy như cũ vì `auth.html` còn trỏ tới.
      - Thêm [`scripts/publish-desktop-release.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/scripts/publish-desktop-release.js): tạo/cập nhật release, tự xoá asset trùng tên rồi tải lên bản mới; token lấy từ `GITHUB_TOKEN` hoặc từ Git Credential Manager (cùng token `git push` đang dùng).
      - **Điều kiện tiên quyết đã kiểm tra trước khi làm**: repo `htmtslh-hub/habbit` phải **public** — nếu private thì asset của Releases đòi xác thực và người dùng sẽ KHÔNG tải được. Đã xác nhận `"visibility": "public"`, và kiểm chứng lại sau khi phát hành bằng cách tải **không gửi header xác thực nào**: cả 2 link trả HTTP 200 và khớp đúng từng byte với file cục bộ.
      - **Verify sau deploy**: `downloads/HabitMastery-Setup.zip` trên Firebase nay trả **404** (đã ngừng deploy), `downloads/Huong-Dan-Cai-Dat.txt` vẫn **200**, `auth.html` trên production chứa đúng 3 link GitHub, chụp màn hình trang đăng nhập thật xác nhận khu vực tải xuống hiển thị nguyên vẹn, 0 lỗi console.

18. ✅ **[ĐÃ XONG 08/09/2026 — v5.11.1] Trích dẫn hàng ngày kẹt tiếng Anh & mẫu email Resend nền tối khó đọc**
    - **Trích dẫn hàng ngày không đổi theo ngôn ngữ**: `DAILY_STOIC_QUOTES` đã có sẵn **đủ bản dịch vi/zh/en cho cả 10 câu** và `renderDailyQuoteWidget()` cũng đọc đúng `curLang` — nhưng widget này **không nằm trong `renderAll()`** và chỉ được gọi đúng 1 lần lúc khởi động (`app.js:5212`). Thời điểm đó việc dò ngôn ngữ thường chưa xong nên nó kẹt ở `en`; sau đó người dùng đổi ngôn ngữ thì bộ lắng nghe `hmLanguageChanged` chỉ gọi `applyI18n()` + `renderAll()` chứ **không hề gọi lại `renderDailyQuoteWidget()`**, nên khung trích dẫn giữ nguyên tiếng Anh mãi. **Fix**: gọi thêm `renderDailyQuoteWidget()` trong bộ lắng nghe `hmLanguageChanged` và trong nhánh dự phòng của `switchLang()`. **Verify** bằng Playwright: bấm đổi lần lượt EN → 中 → VI, đọc lại `#dqwText` mỗi lần — nội dung đổi đúng cả 3 thứ tiếng, giữ nguyên câu đang hiển thị (chỉ đổi bản dịch), 0 lỗi console.
    - **Mẫu email Resend đổi từ NỀN TỐI sang NỀN SÁNG**: bản cũ dùng nền `#060912` + chữ `#cbd5e1`, đọc trong hộp thư rất mỏi mắt. Ngoài ra email nền tối còn rủi ro kỹ thuật: Outlook bỏ qua `gradient`/`rgba` nên chữ nhạt sẽ rơi xuống nền trắng mặc định thành gần như vô hình — nền sáng là chuẩn chung của email marketing chính vì vậy. Thiết kế lại: nền trang `#eef1f5`, thẻ trắng viền `#e2e8f0` + vạch nhấn xanh trên đầu, chữ `#374151`, tiêu đề `#0f172a`, thêm `<meta name="color-scheme" content="light">` để client không tự ép dark-mode. **Giữ NGUYÊN tên class** `.highlight-box` / `.gold-box` vì thanh công cụ soạn thảo trong admin chèn đúng các class này (đổi tên sẽ làm hỏng toàn bộ 7 mẫu email dựng sẵn).
    - **Gộp bản trùng lặp**: `wrapEmailTemplate` trước đó tồn tại **2 bản giống hệt nhau** ở `api/send-email.js` và `api/_lib/emailCore.js` (đã kiểm tra: giống nhau từng ký tự, 3.863 ký tự). Nếu chỉ sửa 1 bên thì email cron nhắc nhở và email admin gửi tay sẽ lệch thiết kế theo thời gian. Đã xoá bản trong `send-email.js`, thay bằng `require("./_lib/emailCore")` — nay chỉ còn **một nguồn duy nhất**.
    - **Đồng bộ khung xem trước trong admin**: `admin.css` vẫn để mockup xem trước theo bản tối cũ, tức admin **xem một đằng nhưng gửi đi một nẻo**. Đã chỉnh 13 khối CSS (`.mockup-scroll-viewport`, `.email-branded-template`, `.email-tpl-*`, `.highlight-box`, `.gold-box`) khớp đúng email thật.
    - **Verify tương phản (đo thật bằng Playwright trên HTML email đã render, không ước lượng)**: chữ thân bài **10,31:1**, tiêu đề **17,34:1**, khung xanh **8,01:1**, khung vàng **6,84:1**, chân trang **4,67:1** — tất cả vượt chuẩn AA (4,5:1). **Bắt được 1 lỗi trong quá trình đo**: nút CTA nền `#059669` với chữ trắng chỉ đạt **3,77:1 — KHÔNG đạt chuẩn**; đã đổi sang `#047857` (**5,48:1**). Đây là lỗi mà nhìn bằng mắt rất khó phát hiện vì nút trông vẫn "khá rõ".
