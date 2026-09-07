# 🚀 HABIT MASTERY - BÁO CÁO TIẾN ĐỘ & TỔNG KẾT DỰ ÁN (PROJECT STATE)

> **Mục đích**: File này lưu trữ toàn bộ trạng thái kỹ thuật, cấu trúc mã nguồn, tính năng đã hoàn thiện và kế hoạch tương lai để bất kỳ phiên làm việc mới nào cũng có thể nắm bắt ngay lập tức, tiết kiệm tối đa Token và thời gian khởi động.

---

## 📌 1. THÔNG TIN DỰ ÁN & TRIỂN KHAI
- **Tên ứng dụng**: **Habit Mastery** (Ứng dụng Rèn luyện Thói quen & Game hóa Kỷ luật)
- **Công nghệ cốt lõi**: HTML5, Vanilla CSS3 (Design System chuẩn Dark/Light Mode), Vanilla JavaScript (ES6+), Firebase (Authentication, Firestore, Hosting), PWA (Service Worker), Vercel Production, Electron (bản Desktop Windows/macOS), Vercel Serverless API (Node.js — SePay Webhook, OTP, Resend Email).
- **Phiên bản Cache / Scripts hiện tại**: `app.js?v=5.9.4`, `style.css?v=5.10.5`, `all_books_data.js?v=5.9.5`, `i18n.js?v=5.8.0` (trong `index.html`) & Service Worker `CACHE_VERSION = '5.10.5'` (trong `sw.js`) — *cập nhật số phiên bản này mỗi khi thay đổi để buộc client tải lại cache mới.*
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

---

## 🎯 5. KẾ HOẠCH BƯỚC TIẾP THEO

### Tính năng
1. ✅ **[XÁC NHẬN LẠI 07/09/2026 — KHÔNG CÒN VIỆC CẦN LÀM] "Nạp file thiết kế cho 6 quyển sách"**: mục này đã LỖI THỜI. Rà soát thực tế cho thấy cả 14/14 quyển đã có đủ nội dung và đã hiển thị đúng trong Cửa Hàng từ trước — xem mục 4.7 (Documents Hub) đã cập nhật đủ danh sách 14 quyển. Không cần tiếp nhận thêm file nào nữa cho các quyển hiện có; chỉ cần thêm việc BIÊN TẬP LẠI CÁCH TRÌNH BÀY đoạn văn (xem mục nợ kỹ thuật #10 bên dưới).
2. ✅ **[ĐÃ XONG 07/09/2026] Cấp bậc Tổ Đội (Squad Ranks)** — xem chi tiết ở mục 4.15 và mục nợ kỹ thuật #9 (lỗi nền tảng đã phát hiện & sửa cùng lúc).
3. **Nâng cấp Hệ thống Thông báo Đẩy (Push Notifications)** & Lời nhắc nhở hàng ngày cho PWA/Mobile.
4. **Tối ưu bản Desktop đã đóng gói**: bản macOS chưa ký chứng chỉ Apple (`hardenedRuntime: false`, `gatekeeperAssess: false`) nên máy người dùng sẽ cảnh báo "không xác định được nhà phát triển" khi mở — cần cân nhắc Apple Developer ID + notarize nếu phát hành rộng rãi (cần tài khoản Apple Developer trả phí của chủ dự án, không thể tự thực hiện). Bản Mobile (`habit-tracker-mobile`, Capacitor) hiện chưa được cập nhật song song với bản web.

### Nợ kỹ thuật (phát hiện qua rà soát 07/09/2026)
5. ✅ **[ĐÃ XONG 07/09/2026] Vá lỗ hổng dependency**: Nâng `firebase-admin` 12.7.0 → **14.3.0** và `nodemailer` 6.10.1 → **10.x**, thêm `overrides.uuid: ^11.1.1` trong `package.json` để chặn nốt lỗ hổng transitive của `@google-cloud/storage`. `npm audit` từ **10 lỗ hổng (8 moderate, 2 high) → 0 lỗ hổng**.
   - ⚠️ **Breaking change đã xử lý**: `firebase-admin@13+` loại bỏ hoàn toàn API namespace cũ (`admin.apps`, `admin.credential.cert()`, `admin.firestore()`, `admin.firestore.Timestamp/FieldValue`, `admin.auth()`) khỏi entry point mặc định. Đã migrate toàn bộ 4 file `api/send-email.js`, `api/send-otp.js`, `api/verify-otp.js`, `api/sepay-webhook.js` sang API modular tương ứng (`admin.getApps()`, `admin.cert()`, `require("firebase-admin/firestore").getFirestore()/Timestamp/FieldValue`, `require("firebase-admin/auth").getAuth()`), đã test require() thành công với service account giả lập hợp lệ.
   - **Chưa đụng tới**: `functions/package.json` (Firebase Cloud Functions) vẫn đang ở `firebase-admin@^12.0.0` — cây dependency **độc lập** với `api/` (Vercel), không bị ảnh hưởng bởi lần nâng cấp này nhưng cũng cần migrate tương tự khi nâng cấp riêng (xem mục 8 bên dưới).
   - ⚠️ **[BUG SÓT LẠI — ĐÃ SỬA 07/09/2026] `api/send-email.js` (Resend) bị bỏ sót khi migrate**: Người dùng báo "Resend trong admin dường như không hoạt động". Nguyên nhân: file này migrate `getFirestore()`/`getAuth()` đúng nhưng **quên đổi `admin.firestore.FieldValue.serverTimestamp()`** — vẫn viết `fb.firestore.FieldValue.serverTimestamp()`, trong khi `fb.firestore` lúc này chỉ là **tham chiếu tới hàm `getFirestore`** (không phải namespace `admin.firestore` cũ) nên không hề có thuộc tính `.FieldValue` → `TypeError: Cannot read properties of undefined (reading 'serverTimestamp')`. Ở nhánh **"Kiểm tra kết nối" (test_connection)**, dòng này nằm chung try/catch với việc gửi email + trả kết quả, nên dù email Resend **đã gửi thành công**, hàm vẫn crash ngay sau đó khi ghi log và trả về `success:false` cho admin — khiến admin luôn thấy "thất bại" dù thực chất đã gửi được. Ở nhánh gửi chiến dịch hàng loạt, lỗi này nằm trong try/catch ghi log riêng nên không làm hỏng việc gửi, nhưng khiến **mọi email_logs của chiến dịch không được ghi lại** (mất lịch sử gửi). Việc `require()` module không giúp phát hiện bug này vì `getFirestore/FieldValue` chỉ bị truy cập sai lúc RUNTIME (trong nhánh xử lý request), không phải lúc load module — bài học cho các lần verify sau: `require()` thành công KHÔNG đủ để xác nhận toàn bộ code path đúng, cần giả lập gọi handler thực tế.
     - **Fix**: import đúng `const { getFirestore, FieldValue } = require("firebase-admin/firestore");`, đổi cả 2 chỗ dùng thành `FieldValue.serverTimestamp()` trực tiếp.
     - **Verify**: viết harness giả lập toàn bộ `firebase-admin`/`firebase-admin/firestore`/`firebase-admin/auth`/`resend` (không cần credential/network thật), gọi trực tiếp `handler(req, res)` cho cả 2 nhánh `test_connection` và `send` — cả 2 đều trả `success:true` và ghi đúng `email_logs` với `createdAt` hợp lệ; kiểm chứng ngược lại bằng cách tái tạo đúng pattern lỗi cũ (`fakeFn.FieldValue.serverTimestamp()`) để xác nhận nó thực sự throw `TypeError` giống hệt mô tả — chứng minh bug có thật và fix có hiệu lực, không phải test giả.
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


