# 🚀 HABIT MASTERY - BÁO CÁO TIẾN ĐỘ & TỔNG KẾT DỰ ÁN (PROJECT STATE)

> **Mục đích**: File này lưu trữ toàn bộ trạng thái kỹ thuật, cấu trúc mã nguồn, tính năng đã hoàn thiện và kế hoạch tương lai để bất kỳ phiên làm việc mới nào cũng có thể nắm bắt ngay lập tức, tiết kiệm tối đa Token và thời gian khởi động.

---

## 📌 1. THÔNG TIN DỰ ÁN & TRIỂN KHAI
- **Tên ứng dụng**: **Habit Mastery** (Ứng dụng Rèn luyện Thói quen & Game hóa Kỷ luật)
- **Công nghệ cốt lõi**: HTML5, Vanilla CSS3 (Design System chuẩn Dark/Light Mode), Vanilla JavaScript (ES6+), Firebase (Authentication, Firestore, Hosting), PWA (Service Worker), Vercel Production, Electron (bản Desktop Windows/macOS), Vercel Serverless API (Node.js — SePay Webhook, OTP, Resend Email).
- **Phiên bản Cache / Scripts hiện tại**: `app.js?v=5.8.2`, `style.css?v=5.8.1`, `i18n.js?v=5.8.0` (trong `index.html`) & Service Worker `CACHE_VERSION = '5.8.6'` (trong `sw.js`) — *cập nhật số phiên bản này mỗi khi thay đổi để buộc client tải lại cache mới.*
- **Loại Bỏ 100% Mục Lục Rác & Dấu Chấm OCR Trong Nội Dung (v5.3.3)**: Đã bóc tách và xóa sạch toàn bộ các đoạn text mục lục thô bị sao chép nhầm từ bản scan PDF (các dòng chấm dài `........ 93 146. Thu hút...`) trong toàn bộ 14 cuốn sách, giữ lại giao diện trang đọc tinh khiết, sang trọng và chuẩn mực.
- **Đa Ngôn Ngữ Toàn Hệ Thống (v5.8.0)**: Hỗ trợ đầy đủ **Tiếng Việt / English / 简体中文**, tự động phát hiện ngôn ngữ theo quốc gia (VN→vi, CN→zh, còn lại→en mặc định), bao gồm cả tên 21 Cảnh Giới, toàn bộ UI, `auth.html`, `auth.js`. Logic đặt tại [`i18n.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/i18n.js) (~1.600 dòng).
- **Bảo Mật (Security Patch)**: Đã vá các lỗ hổng nghiêm trọng — XSS, siết chặt `firestore.rules`, thêm HTTP Security Headers trong `firebase.json`, chuyển sinh mã OTP sang CSPRNG (`crypto.randomInt`), loại các script mock ra khỏi build production.
- **Bản Desktop đóng gói (Electron)**: Windows `.exe` (NSIS installer + Portable) và macOS `.dmg`/`.zip` (arm64 + x64) build tự động qua GitHub Actions ([`.github/workflows/build-mac.yml`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/.github/workflows/build-mac.yml)), có khu vực tải app riêng trên trang đăng nhập (`auth.html`) theo từng hệ điều hành.
- **Admin — Gửi Email Hàng Loạt (Resend)**: Tích hợp [`api/send-email.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/api/send-email.js) qua Resend API, có sẵn 3+ mẫu email dựng sẵn (Chào mừng, Tặng VIP, Thông báo tính năng mới) để admin gửi trực tiếp từ `admin.html`.
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
- **Kho Tài Liệu & Sách Tinh Hoa (Documents Hub)**:
  1. 📜 **Tuyệt Mật Nhân Tính** *(Bản Đủ 218 Trang - 7 Chương, 28 Phần Mục)*: Tâm lý học hành vi, đối nhân xử thế, nghệ thuật quyền mưu và thấu hiểu bản chất con người 100% nguyên văn từ tài liệu PDF.
  2. 👁️ **Thức Tỉnh Nhận Thức** *(8.000 Coins)*: Phá vỡ bẫy tư duy vô thức, làm chủ tâm trí.
  3. 🦁 **Tư Duy Cường Giả** *(8.500 Coins)*: Ý chí sắt đá & nguyên tắc kẻ mạnh.
  4. ⚔️ **Thương Chiến** *(9.000 Coins)*: Mưu lược kinh doanh, đòn bẩy dòng tiền.
  5. 🔮 **Ẩn Chứa Huyền Cơ** *(9.500 Coins)*: Đọc vị thế cục ngầm & quy luật âm dương.
  6. 🌌 **Tư Duy Sâu Sắc** *(10.000 Coins)*: First Principles & giải mã bài toán phức tạp.
- **Bộ Đọc Sách Trực Tuyến Thế Hệ Mới (Document Reader Modal v2)**:
  - 📑 **Ngăn kéo Mục Lục Chi Tiết (TOC Drawer)**: Hiển thị trọn bộ 7 chương & 28 phần kèm số trang tài liệu gốc, lọc mục lục tức thì.
  - 🏷️ **Thanh Điều Hướng Chương (Chapter Tabs)**: Chuyển đổi nhanh 7 chương lớn ở đầu trang với hiệu ứng phát sáng Neon.
  - 🔍 **Tìm Kiếm Toàn Sách Thời Gian Thực**: Tra cứu từ khóa trong 218 trang với trích đoạn highlight và nhảy trực tiếp đến vị trí.
  - ⏭️ **Nút Chuyển Phần & Chương**: Điều hướng mượt mà ở cuối mỗi phần bài đọc.
  - 💾 **Tự Động Lưu Vị Trí & Bookmark (Auto-resume)**: Tự động ghi nhớ chương, phần và tiến độ cuộn trang để tiếp tục đọc bất cứ lúc nào.
  - 🎨 **4 Chế độ đọc**: Dark Slate, Warm Sepia (Giấy cổ điển), Paper Light (Sáng), OLED Midnight (Tiết kiệm pin).
  - Tùy chỉnh kích thước chữ linh hoạt (A- / A+ từ 80% đến 150%), chế độ toàn màn hình.
  - Nút nhận thưởng +20 Coins khi hoàn thành bài đọc.
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

---

## 🎯 5. KẾ HOẠCH BƯỚC TIẾP THEO

### Tính năng
1. **Tiếp nhận các file thiết kế HTML chi tiết** cho 6 quyển sách để nạp trực tiếp vào Reader.
2. **Cấp bậc Tổ Đội (Squad Ranks)**: Thiết kế và triển khai hệ thống phân cấp tổ đội theo tổng điểm đóng góp của các thành viên.
3. **Nâng cấp Hệ thống Thông báo Đẩy (Push Notifications)** & Lời nhắc nhở hàng ngày cho PWA/Mobile.
4. **Tối ưu bản Desktop đã đóng gói**: bản macOS chưa ký chứng chỉ Apple (`hardenedRuntime: false`, `gatekeeperAssess: false`) nên máy người dùng sẽ cảnh báo "không xác định được nhà phát triển" khi mở — cần cân nhắc Apple Developer ID + notarize nếu phát hành rộng rãi. Bản Mobile (`habit-tracker-mobile`, Capacitor) hiện chưa được cập nhật song song với bản web.

### Nợ kỹ thuật (phát hiện qua rà soát 07/09/2026)
5. ✅ **[ĐÃ XONG 07/09/2026] Vá lỗ hổng dependency**: Nâng `firebase-admin` 12.7.0 → **14.3.0** và `nodemailer` 6.10.1 → **10.x**, thêm `overrides.uuid: ^11.1.1` trong `package.json` để chặn nốt lỗ hổng transitive của `@google-cloud/storage`. `npm audit` từ **10 lỗ hổng (8 moderate, 2 high) → 0 lỗ hổng**.
   - ⚠️ **Breaking change đã xử lý**: `firebase-admin@13+` loại bỏ hoàn toàn API namespace cũ (`admin.apps`, `admin.credential.cert()`, `admin.firestore()`, `admin.firestore.Timestamp/FieldValue`, `admin.auth()`) khỏi entry point mặc định. Đã migrate toàn bộ 4 file `api/send-email.js`, `api/send-otp.js`, `api/verify-otp.js`, `api/sepay-webhook.js` sang API modular tương ứng (`admin.getApps()`, `admin.cert()`, `require("firebase-admin/firestore").getFirestore()/Timestamp/FieldValue`, `require("firebase-admin/auth").getAuth()`), đã test require() thành công với service account giả lập hợp lệ.
   - **Chưa đụng tới**: `functions/package.json` (Firebase Cloud Functions) vẫn đang ở `firebase-admin@^12.0.0` — cây dependency **độc lập** với `api/` (Vercel), không bị ảnh hưởng bởi lần nâng cấp này nhưng cũng cần migrate tương tự khi nâng cấp riêng (xem mục 8 bên dưới).
6. **Đồng bộ tài liệu PROJECT_STATE.md**: đã cập nhật lại 07/09/2026 cho khớp `v5.8.6` — cần duy trì thói quen cập nhật file này mỗi khi bump version để tránh lệch trạng thái ở các phiên làm việc sau.
7. **Vị trí lưu Service Account Key**: file `sonnhai-2600f-firebase-adminsdk-fbsvc-95976c69d2.json` hiện nằm ở thư mục cha (ngoài git repo, an toàn nhưng trôi nổi) — nên chuyển vào trình quản lý secret/thư mục riêng có kiểm soát truy cập.
8. **`functions/` (Firebase Cloud Functions) vẫn dùng `firebase-admin@^12.0.0`**: cây dependency riêng, chưa cài `node_modules` cục bộ. Khi nâng cấp, cần áp dụng lại đúng kiểu migrate API modular như mục 5 cho `functions/index.js` (đang dùng `admin.firestore()`, `admin.firestore.FieldValue/Timestamp`, `admin.auth()`).


