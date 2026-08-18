# 🚀 HABIT MASTERY - BÁO CÁO TIẾN ĐỘ & TỔNG KẾT DỰ ÁN (PROJECT STATE)

> **Mục đích**: File này lưu trữ toàn bộ trạng thái kỹ thuật, cấu trúc mã nguồn, tính năng đã hoàn thiện và kế hoạch tương lai để bất kỳ phiên làm việc mới nào cũng có thể nắm bắt ngay lập tức, tiết kiệm tối đa Token và thời gian khởi động.

---

## 📌 1. THÔNG TIN DỰ ÁN & TRIỂN KHAI
- **Tên ứng dụng**: **Habit Mastery** (Ứng dụng Rèn luyện Thói quen & Game hóa Kỷ luật)
- **Công nghệ cốt lõi**: HTML5, Vanilla CSS3 (Design System chuẩn Dark/Light Mode), Vanilla JavaScript (ES6+), Firebase (Authentication, Firestore, Hosting), PWA (Service Worker), Vercel Production.
- **Phiên bản Service Worker Cache**: `3.6.4` (trong `sw.js`)
- **Kho mã nguồn (GitHub)**: `https://github.com/htmtslh-hub/habbit.git` (Nhánh `main`)
- **Địa chỉ Production đang hoạt động**:
  - 🌐 **Firebase Hosting**: [https://habitmastery.web.app](https://habitmastery.web.app)
  - 🌐 **Vercel Production**: [https://habbit-opal.vercel.app](https://habbit-opal.vercel.app)

---

## 🏗️ 2. CẤU TRÚC TỆP TIN CHÍNH (FILE ARCHITECTURE)

| Tệp tin | Vai trò chính |
| :--- | :--- |
| [`index.html`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/index.html) | Giao diện ứng dụng chính, thanh điều hướng, các Modal độc lập (Cộng đồng, BXH, Nhiệm vụ, Hồ sơ, Lightbox ảnh, Nâng cấp). |
| [`app.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/app.js) | Toàn bộ logic ứng dụng: Bảng thói quen, tính điểm DP/Streak, đồng bộ Firestore, bảng xếp hạng Top 50, cấp bậc nhân vật, hệ thống nhiệm vụ & nhận thưởng, bảng tin cộng đồng & bình luận, quản lý hồ sơ. |
| [`style.css`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/style.css) | Hệ thống biến CSS variables, hiệu ứng Glow/Spotlight, giao diện Dark/Light mode, thẻ nhân vật 10 cấp bậc, giao diện bảng tin cộng đồng, khung bình luận, responsive mobile. |
| [`nameplate_templates.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/nameplate_templates.js) | Thẻ tên Dynamic Nameplate Card cho thanh Navbar (`getNameplateCardHTML`) và Thẻ nhân vật chi tiết (`getFullRankCardHTML`). |
| [`avatar_frames.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/avatar_frames.js) | Khung viền Avatar động theo 10 Cấp bậc nhân vật. |
| [`auth.html`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/auth.html) / [`auth.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/auth.js) | Trang đăng nhập/đăng ký tài khoản, xác thực Email/Mật khẩu, OTP. |
| [`admin.html`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/admin.html) / [`admin.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/admin.js) | Bảng điều khiển quản trị viên: Quản lý người dùng, cộng điểm DP bonus, duyệt nhiệm vụ đột xuất. |
| [`ideas.txt`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/ideas.txt) | Tài liệu lưu trữ 5 Trụ cột chiến lược giữ chân người dùng (Retention Roadmap). |
| [`sw.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/sw.js) | Service Worker phục vụ PWA và bộ nhớ đệm Offline. |

---

## ⚡ 3. CÁC TÍNH NĂNG ĐÃ HOÀN THIỆN ĐẦY ĐỦ

### 1. Bảng Theo Dõi Thói Quen (Habit Tracker Core)
- Bảng lưới tháng theo ngày với tính năng đóng băng cột (Freeze) và thu gọn cột (Collapse).
- Check-in thói quen kèm hiệu ứng âm thanh Web Audio API.
- Theo dõi Tâm trạng (Mood) & Thời gian ngủ (Sleep hours).
- Ghi chú nhật ký hàng ngày (Daily Notes) và Bản đồ nhiệt hoạt động cả năm (Year Heatmap).
- Xuất / Nhập dữ liệu sao lưu dạng file JSON.

### 2. Hệ Thống Điểm Kỷ Luật (DP) & Cấp Bậc (10 Rank Tiers)
- **Công thức DP**: 10 DP / lần check thói quen; +30 DP khi hoàn thành 100% ngày; thưởng Streak (7 ngày +50 DP, 30 ngày +500 DP, 100 ngày +2000 DP).
- **10 Cấp Bậc (Levels)**:
  1. *Tân Binh (0 DP)* ➔ 2. *Chiến Binh (1.501 DP)* ➔ 3. *Dũng Sĩ (4.501 DP)* ➔ 4. *Kiếm Sĩ (9.001 DP)* ➔ 5. *Cao Thủ (15.001 DP)* ➔ 6. *Đại Sư (24.001 DP)* ➔ 7. *Chiến Thần (36.001 DP)* ➔ 8. *Bất Tử (54.001 DP)* ➔ 9. *Huyền Thoại (75.001 DP)* ➔ 10. *Thần Thoại (105.001 DP)*.
- Thẻ tên nhân vật (Dynamic Nameplate) thu nhỏ hiển thị trực tiếp trên thanh điều hướng.

### 3. Hệ Thống Nhiệm Vụ Rèn Luyện (Quests)
- 4 Nhóm nhiệm vụ: **Hàng ngày** (tự reset 00:00), **Hàng tuần** (tự reset thứ 2), **Thành tích vĩnh viễn**, **Nhiệm vụ đột xuất từ Admin**.
- Nút **Nhận thưởng** hoạt động mượt mà, kích hoạt hiệu ứng pháo giấy Confetti và thông báo Toast, cập nhật cấp bậc và Bảng xếp hạng tức thì.

### 4. Tab Cộng Đồng Tách Rời (Dedicated Community Feed)
- Modal Cộng đồng độc lập (`#communityModalBg`).
- Đăng bài viết kèm **Ảnh** (tự động nén Canvas chuẩn nét nhẹ) hoặc **Video** (<15MB kèm trình phát).
- Xem ảnh phóng to toàn màn hình (Lightbox Modal).
- Hiển thị ngày giờ đăng bài chi tiết (*Vừa xong, 15 phút trước, Hôm qua lúc..., 14/08/2026 lúc...*).
- **Hệ thống Bình luận (Comments)**: Thảo luận trực tiếp dưới bài viết, hiển thị avatar + cấp bậc + thời gian, quyền xóa bình luận chính chủ/admin.
- Nút thả tim (Like) thời gian thực.

### 5. Bảng Xếp Hạng Top 50 & Vinh Danh
- Top 50 người dùng có tổng DP và chuỗi Streak cao nhất.
- Tặng Kudos (khen ngợi) đồng đội.
- Danh mục xem chi tiết hình ảnh 10 Khung Cấp Bậc (Rank Tiers).

### 6. Hồ Sơ Nhân Vật & Đăng Xuất Tích Hợp
- Đổi tên hiển thị nhân vật trực tiếp trong hồ sơ (có kiểm tra độ dài 2-30 ký tự, chống lỗi).
- Đổi Avatar từ máy hoặc link ảnh.
- Nút **Đăng xuất tài khoản** được chuyển gọn gàng vào dưới cùng của Modal Hồ sơ (đã dọn sạch nút ngoài Navbar).

### 7. Trụ Cột 1: Cơ Chế Bảo Vệ & Cứu Chuỗi (Streak Protection & Recovery)
- **Bình Đóng Băng Chuỗi (*Streak Freeze*)**:
  - Sở hữu tối đa 2 bình đóng băng, tặng 1 bình khởi đầu cho người dùng.
  - Tự động kích hoạt khi người dùng bỏ lỡ 1 ngày check-in để bảo vệ chuỗi Streak không bị reset về 0.
  - Hiệu ứng thị giác Băng Tuyết phát sáng (`.cb-frozen`, `.hm-frozen`, icon `🧊` và header `th.frozen-day`).
- **Vá Chuỗi Trong 24h (*Streak Repair / Hồi Sinh Chuỗi*)**:
  - Tự động phát hiện chuỗi bị đứt trong 24h - 48h trước đó.
  - Banner Cứu Chuỗi Khẩn Cấp (`#streakEmergencyBanner`) hiển thị đầu trang kèm hiệu ứng rung cảnh báo.
  - Sử dụng 150 DP để hồi sinh lại toàn bộ chuỗi ngày bị lỡ kèm âm thanh Web Audio API và pháo hoa Confetti.
- **Trung Tâm Bảo Vệ Chuỗi (*Streak Protection Center & Shop*)**:
  - Nút truy cập nhanh trên Navbar (`#streakShieldBtn`) hiển thị số lượng bình Freeze thời gian thực (`🧊 1/2`).
  - Modal độc lập (`#streakModalBg`) hiển thị: Chuỗi hiện tại, Chuỗi kỷ lục, Tình trạng bảo vệ an toàn/nguy hiểm, Túi 2 bình băng tuyết pha lê phát sáng, Cửa hàng mua bình Freeze (200 DP) và Hồi sinh chuỗi (150 DP), Lịch sử ngày đóng băng/vá chuỗi.
- **Bộ tổng hợp âm thanh Web Audio API**:
  - Âm thanh tick thói quen (`playCheckSound`), âm thanh đóng băng pha lê (`playFreezeSound`), âm thanh khải hoàn hồi sinh chuỗi (`playResurrectSound`).

### 8. Trụ Cột 2: Cửa Hàng Kỷ Luật & Nền Kinh Tế DP (Discipline Point Shop)
- **Danh Hiệu Độc Quyền (*Character Titles*)**:
  - 8 Danh hiệu: *🌅 Chim Sớm (300 DP), 🦉 Kẻ Thức Khuya (300 DP), ⚔️ Chiến Binh Kỷ Luật (500 DP), 🐺 Sói Đầu Đàn (800 DP), 🛡️ Bất Khả Xâm Phạm (1,200 DP), 👑 Kẻ Chinh Phục Thói Quen (2,000 DP), ⚡ Thần Tốc Kỷ Luật (600 DP), 🧘 Tâm Bất Biến (500 DP)*.
  - Hiển thị huy hiệu Gradient phát sáng (`.user-title-badge`) cạnh tên nhân vật ở Navbar, Hồ Sơ, Bảng Xếp Hạng Top 50, và Bảng Tin Cộng Đồng.
- **5 Bộ Theme Skins Độc Đáo**:
  - Hỗ trợ 7 themes: *🌙 Dark Mode, ☀️ Light Mode, 🔮 Cyberpunk Neon (600 DP), 👑 Gold Luxury (800 DP), 🌸 Minimalist Sakura (500 DP), 💻 Midnight Matrix (600 DP), 🍃 Forest Zen (500 DP)*.
  - Chuyển đổi và lưu trữ tức thì, hỗ trợ trọn bộ biến CSS variables theo từng phong cách.
- **Gói Hiệu Ứng Check-in (*Sound & Visual FX*)**:
  - **Âm thanh**: *🔔 Chime Mặc Định (Free), 🗡️ Katana Slash (350 DP), 🎮 RPG Level-Up (400 DP), ⌨️ Phím Cơ Thocky (350 DP), 💧 Bong Bóng Nước (250 DP), ⚡ Laser Zap (300 DP)*.
  - **Thị giác**: *🟢 Pop Mặc Định (Free), 🎆 Pháo Hoa Mini (400 DP), ⚡ Tia Laser Neon (400 DP), 🌟 Hào Quang Vàng Kim (450 DP), 🌸 Cánh Hoa Bay (350 DP)*.
- **Vật Phẩm & Thẻ Bổ Sung (Boosters)**:
  - 🧊 *Bình Đóng Băng Chuỗi (200 DP)*.
  - ⚡ *Vé Nhân Đôi Điểm (2X DP Boost 24h - 300 DP)*: Tăng gấp đôi điểm thưởng (+20 DP/lần check) trong 24 giờ kèm huy hiệu đếm ngược phát sáng trên Navbar (`#navBoostBadge`).
- **Giao Diện Modal Cửa Hàng Kỷ Luật (`#shopModalBg`)**:
  - 4 Tab danh mục: 🏷️ Danh hiệu, 🎨 Giao diện, 🔊 Hiệu ứng, ⚡ Vật phẩm.
  - Hiển thị số dư ví DP thời gian thực, nút Mua/Trang bị/Đang dùng, pháo hoa ăn mừng và âm thanh khi mua thành công.

### 9. Trụ Cột 3: Tổ Đội Rèn Luyện & Đấu Trường Thách Đấu 1v1 (Social Accountability Hub)
- **Tổ Đội Rèn Luyện (*Squads / Guilds 3-5 Thành Viên*)**:
  - Tạo Tổ đội với Tên, Icon đại diện (⚔️, 🐺, 🦁, 🔥, 🏆, ⚡, 🛡️), và Mô tả mục tiêu.
  - Tự động sinh **Mã mời 6 ký tự** (ví dụ: `SQ8921`) kèm nút sao chép nhanh 1 chạm để mời bạn bè.
  - Tham gia tổ đội nhanh chóng bằng cách nhập mã mời.
  - **Tiến độ & Cấp bậc Đội (Level 1 -> 5)**: Tích lũy điểm EXP chung mỗi khi thành viên check-in thói quen.
  - Thanh tiến độ ngày: Đo lường trực quan tỷ lệ hoàn thành hôm nay của cả đội (`3/5 thành viên đã check-in`).
  - **Cơ chế Thúc Giục (*⚡ Nudge / Poke*)**:
    - Nhìn thấy trạng thái check-in hôm nay của từng đồng đội (✅ *Đã check* / ⏳ *Chưa hoàn thành*).
    - Nút "Thúc giục" gửi thông báo sấm sét kèm âm thanh Web Audio API (`playNudgeSound`) và ghi nhận vào Nhật ký hoạt động thời gian thực của đội.
- **Đấu Trường Thách Đấu 1v1 7 Ngày (*7-Day Streak Duel*)**:
  - **Đặt cược DP (Staking)**: 4 mức cược (50 DP, 100 DP, 200 DP, 500 DP) tạo hũ thưởng chung gấp đôi (2x DP).
  - **Giao diện VS Battle**: Hiển thị bảng so tài 7 ngày song song giữa 2 đấu thủ với 7 vòng tròn tiến độ và bộ đếm ngược thời gian.
  - Check-in thói quen hàng ngày tự động cập nhật tiến độ đấu trường.
  - Phân định thắng/thua, ăn trọn Hũ thưởng DP, hoàn cược nếu hòa (7/7 ngày), hiệu ứng pháo hoa Confetti và chuông đấu trường (`playDuelGongSound`).
- **Giao Diện Modal Độc Lập (`#squadModalBg`)**:
  - Truy cập nhanh bằng nút `🛡️ Tổ đội` trên Navbar và thanh điều hướng di động.
  - 2 Tab chính: 🛡️ **Tổ Đội Rèn Luyện** và ⚔️ **Đấu Trường 1v1**.

### 10. Trụ Cột 4: Báo Cáo Tổng Kết & Khoe Thành Tích (Shareable Recap & Story Cards)
- **Bản Tin Tổng Kết Tuần (*Weekly Recap - Kiểu Spotify Wrapped*)**:
  - Giao diện Infographic trượt dọc đa slide ấn tượng với thanh thời gian Story tiến độ.
  - Tự động gợi ý mở vào sáng Thứ Hai đầu tuần hoặc truy cập bất kỳ lúc nào qua nút `📊 Tổng kết` trên Navbar / Mobile nav.
  - 5 Slide sinh động:
    * **Slide 1: Tỷ lệ kỷ luật trong tuần** (% hoàn thành 7 ngày, danh hiệu tuần: *Huyền Thoại Kỷ Luật / Chiến Binh Bất Bại / Kỷ Luật Vàng*).
    * **Slide 2: Năng lượng điểm rèn luyện** (+DP kiếm được, số lần tick thói quen, số ngày hoàn hảo 100%).
    * **Slide 3: Chuỗi ngày Streak bùng cháy** (Số ngày giữ vững chuỗi, túi bình Freeze dự phòng).
    * **Slide 4: Vinh danh thói quen** (Thói quen quán quân được tick nhiều nhất tuần vs thói quen cần lưu ý).
    * **Slide 5: Tổng kết & Nút mở nhanh Bộ tạo ảnh Story 9:16**.
- **Bộ Công Cụ Xuất Ảnh Khoe Kỷ Luật (*Shareable Story Cards Generator*)**:
  - Vẽ trực tiếp bằng **HTML5 Canvas High-DPI** sắc nét chuẩn ảnh đăng mạng xã hội.
  - **2 Kích thước**: 📱 **Story 9:16 (1080 x 1920 px)** cho Instagram/Facebook/TikTok Story & ⏹️ **Square 1:1 (1080 x 1080 px)** cho bài đăng Feed.
  - **3 Phong cách hình nền**: 🔮 *Cyberpunk Neon*, 👑 *Gold Luxury*, 🌸 *Minimalist Sakura*.
  - Nội dung thẻ chứa: Logo Habit Mastery, Khung Avatar cấp bậc, Tên nhân vật, Huy hiệu Danh hiệu độc quyền, 3 Thẻ chỉ số nổi bật (Streak, Tổng DP, % Kỷ luật), Danh sách thói quen tuần, Lời trích dẫn triết học Khắc Kỷ (Stoic Quotes), và Mã URL website.
  - Hỗ trợ: **📥 Tải ảnh PNG chất lượng cao**, **📲 Chia sẻ trực tiếp qua Web Share API**, **📋 Sao chép ảnh vào Clipboard**.

### 11. Trụ Cột 5: Công Cụ Hỗ Trợ Trực Tiếp (Action Enablers - Pomodoro Focus Station & Daily Quotes)
- **Đồng Hồ Tập Trung Tích Hợp (*Pomodoro / Deep Work Timer*)**:
  - **Gắn liền trực tiếp với thói quen**: Cho phép người dùng chọn thói quen cụ thể (*"Đọc sách"*, *"Làm việc sâu"*, *"Học kỹ năng"*, *"Thiền định"*...) hoặc tập trung tự do.
  - **3 Chế độ phiên thời gian**: ⏱️ *Pomodoro (25 phút)*, ☕ *Nghỉ ngắn (5 phút)*, 🌴 *Nghỉ dài (15 phút)*.
  - **Vòng tròn SVG Timer đếm ngược phát sáng** kèm thời gian hiển thị to rõ.
  - **Trạm phát nhạc sóng não & tiếng ồn trắng (*Web Audio API Synthesizer*)**:
    * 🌧️ *Mưa Rơi (Rain Ambient)*: Pink noise buffer mô phỏng tiếng mưa rơi lộp độp êm ái.
    * 🌊 *Sóng Biển (Ocean Waves)*: Điều chế LFO tần số thấp tạo nhịp điệu sóng dạt dào.
    * 📻 *Tiếng Ồn Trắng (White Noise Focus)*: Triệt tiêu mọi tạp âm phiền nhiễu từ môi trường.
    * ☕ *Lo-fi Chill Chords*: Chuỗi hợp âm Rhodes ấm áp, thư giãn như trong quán cafe.
    * Thanh trượt điều chỉnh âm lượng mượt mà và nút tắt tiếng tức thì.
  - **Tự động hoàn thành thói quen & Thưởng điểm DP**:
    * Hoàn thành 1 phiên 25 phút: Tự động tick check-in thói quen trong ngày hôm nay.
    * Thưởng thêm **+15 DP Deep Work Bonus** vào ví.
    * Phát chuông khải hoàn (`playPomodoroEndChime`) và hiệu ứng pháo hoa Confetti.
- **Widget Trích Dẫn Khắc Kỷ & Động Lực Mỗi Ngày (*Daily Stoic & Mindset Quotes*)**:
  - Khung Widget sang trọng ngay trên Dashboard hiển thị danh ngôn rèn luyện của *Marcus Aurelius, Seneca, Epictetus, David Goggins, James Clear, Aristotle, Sun Tzu, v.v.*
  - Tự động hiển thị theo ngôn ngữ hiện hành (VI / EN / ZH).
  - Nút `🎲 Đổi câu khác`, `📋 Sao chép`, và `📸 Khoe câu nói lên Story`.

---

## 🎯 4. TỔNG KẾT TOÀN DIỆN 5 TRỤ CỘT DỰ ÁN (TỪ FILE `ideas.txt`)

Tất cả **5 Trụ Cột Đột Phá** trong file `ideas.txt` đã được triển khai hoàn tất 100%:
1. ✅ **Trụ Cột 1**: Cơ chế bảo vệ & Cứu chuỗi (*Streak Freeze & 24h Streak Repair*).
2. ✅ **Trụ Cột 2**: Cửa hàng Kỷ luật & Nền kinh tế DP (*Discipline Point Shop, Titles, Themes, FX, 2X Boost*).
3. ✅ **Trụ Cột 3**: Tổ đội rèn luyện (*Squads / Guilds 3-5 người, Nudge* & *1v1 7-Day Streak Duel*).
4. ✅ **Trụ Cột 4**: Báo cáo tổng kết tuần (*Weekly Recap Spotify Wrapped* & *Xuất ảnh Story 9:16 / 1:1*).
5. ✅ **Trụ Cột 5**: Công cụ hỗ trợ trực tiếp (*Pomodoro Focus Station 4 Ambient Sounds* & *Widget Danh ngôn Khắc Kỷ*).

---

## 💡 HƯỚNG DẪN DÀNH CHO AI KHI BẮT ĐẦU PHIÊN MỚI:
1. Đọc file này để nắm vững toàn bộ kiến trúc và hiện trạng dự án.
2. Kiểm tra `sw.js` nếu có chỉnh sửa mã nguồn để tăng `CACHE_VERSION`.
3. Kiểm tra cú pháp bằng lệnh `node -c app.js` trước khi commit & deploy.
4. Triển khai đồng thời lên cả **Firebase Hosting** (`npx firebase deploy --only hosting`) và **Vercel** (`npx vercel --prod --yes`).
