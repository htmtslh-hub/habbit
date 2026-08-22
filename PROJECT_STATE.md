# 🚀 HABIT MASTERY - BÁO CÁO TIẾN ĐỘ & TỔNG KẾT DỰ ÁN (PROJECT STATE)

> **Mục đích**: File này lưu trữ toàn bộ trạng thái kỹ thuật, cấu trúc mã nguồn, tính năng đã hoàn thiện và kế hoạch tương lai để bất kỳ phiên làm việc mới nào cũng có thể nắm bắt ngay lập tức, tiết kiệm tối đa Token và thời gian khởi động.

---

## 📌 1. THÔNG TIN DỰ ÁN & TRIỂN KHAI
- **Tên ứng dụng**: **Habit Mastery** (Ứng dụng Rèn luyện Thói quen & Game hóa Kỷ luật)
- **Công nghệ cốt lõi**: HTML5, Vanilla CSS3 (Design System chuẩn Dark/Light Mode), Vanilla JavaScript (ES6+), Firebase (Authentication, Firestore, Hosting), PWA (Service Worker), Vercel Production.
- **Phiên bản Cache / Scripts**: `v=4.9.0` (trong `index.html`) & Service Worker `3.6.4` (trong `sw.js`)
- **Kho mã nguồn (GitHub)**: `https://github.com/htmtslh-hub/habbit.git` (Nhánh `main`)
- **Địa chỉ Production đang hoạt động**:
  - 🌐 **Firebase Hosting**: [https://habitmastery.web.app](https://habitmastery.web.app)
  - 🌐 **Vercel Production**: [https://habbit-opal.vercel.app](https://habbit-opal.vercel.app)

---

## 🏗️ 2. CẤU TRÚC TỆP TIN CHÍNH (FILE ARCHITECTURE)

| Tệp tin | Vai trò chính |
| :--- | :--- |
| [`index.html`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/index.html) | Giao diện ứng dụng chính, thanh điều hướng, các Modal độc lập (Cộng đồng, BXH, Nhiệm vụ, Hồ sơ, Cửa hàng, Tổ đội, Lightbox ảnh, Nâng cấp). |
| [`app.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/app.js) | Toàn bộ logic ứng dụng: Bảng thói quen, tính điểm DP/Streak, hệ thống 7 Bước Lớn & 21 Cảnh Giới Nhỏ, đồng bộ Firestore, bảng xếp hạng Top 50, hệ thống nhiệm vụ & nhận thưởng, bảng tin cộng đồng & bình luận, quản lý hồ sơ, Pomodoro, Spotify-style Recap. |
| [`style.css`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/style.css) | Hệ thống biến CSS variables, hiệu ứng Glow/Spotlight, giao diện Dark/Light mode, thẻ nhân vật 10 cấp bậc đồ họa, giao diện bảng tin cộng đồng, khung bình luận, responsive mobile. |
| [`nameplate_templates.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/nameplate_templates.js) | Thẻ tên Dynamic Nameplate Card cho thanh Navbar (`getNameplateCardHTML`) và Thẻ nhân vật chi tiết (`getFullRankCardHTML`). |
| [`avatar_frames.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/avatar_frames.js) | Khung viền Avatar động 10 mốc đồ họa (Khung 1 đến Khung 10). |
| [`auth.html`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/auth.html) / [`auth.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/auth.js) | Trang đăng nhập/đăng ký tài khoản, xác thực Email/Mật khẩu, OTP. |
| [`admin.html`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/admin.html) / [`admin.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/admin.js) | Bảng điều khiển quản trị viên: Quản lý người dùng, cộng điểm DP bonus, duyệt nhiệm vụ đột xuất. |
| [`ideas.txt`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/ideas.txt) | Tài liệu lưu trữ 5 Trụ cột chiến lược giữ chân người dùng (Retention Roadmap). |
| [`sw.js`](file:///d:/3.%20D%E1%BB%B1%20%C3%A1n/3.%20%E1%BB%A9ng%20d%E1%BB%A5ng/ghi%20ch%C3%BA/habit-tracker/sw.js) | Service Worker phục vụ PWA và bộ nhớ đệm Offline. |

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
- Theo dõi Tâm trạng (Mood) & Thời gian ngủ (Sleep hours).
- Ghi chú nhật ký hàng ngày (Daily Notes) và Bản đồ nhiệt hoạt động cả năm (Year Heatmap).
- Xuất / Nhập dữ liệu sao lưu dạng file JSON.

### 2. Hệ Thống Nhiệm Vụ Rèn Luyện (Quests)
- 4 Nhóm nhiệm vụ: **Hàng ngày** (tự reset 00:00), **Hàng tuần** (tự reset thứ 2), **Thành tích vĩnh viễn**, **Nhiệm vụ đột xuất từ Admin**.
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

### 5. Hồ Sơ Nhân Vật & Đăng Xuất
- Đổi tên hiển thị (2-30 ký tự), đổi avatar.
- Hiển thị nổi bật: `Bước thứ [X] - [Tên tiểu cảnh giới]` kèm trích dẫn định nghĩa tâm thức.
- Bộ chọn 10 Mẫu Khung viền avatar (`Khung 1` đến `Khung 10`).
- Nút Đăng xuất tài khoản nằm gọn trong Modal Hồ sơ.

### 6. Trụ Cột 1: Cơ Chế Bảo Vệ & Cứu Chuỗi (Streak Protection & Recovery)
- Bình Đóng Băng Chuỗi (*Streak Freeze* - tối đa 2 bình).
- Vá Chuỗi Trong 24h (*Streak Repair* - 150 DP).
- Trung Tâm Bảo Vệ Chuỗi (*Streak Protection Modal*).

### 7. Trụ Cột 2: Cửa Hàng Kỷ Luật & Nền Kinh Tế DP (Shop)
- 8 Danh Hiệu Độc Quyền (*Character Titles*).
- 7 Bộ Theme Skins Độc Đáo (*Dark, Light, Cyberpunk, Gold Luxury, Sakura, Matrix, Forest Zen*).
- Gói Hiệu Ứng Âm Thanh & Thị Giác khi tick ô.
- Thẻ x2 DP Boost 24h.

### 8. Trụ Cột 3: Tổ Đội Rèn Luyện & Đấu Trường Thách Đấu 1v1 (Social Hub)
- Tổ Đội Rèn Luyện (Squads 3-5 người, Mã mời 6 ký tự, Nudge sấm sét đồng đội).
- Đấu Trường Thách Đấu 1v1 7 Ngày (Staking DP 50/100/200/500 DP).
- *(Lưu ý: Cấp bậc tổ đội sẽ được thảo luận và nâng cấp ở các phiên sau theo yêu cầu)*.

### 9. Trụ Cột 4: Báo Cáo Tổng Kết & Khoe Thành Tích (Recap & Story Cards)
- Báo Cáo Tổng Kết Tuần (*Weekly Recap* 5 slide kiểu Spotify Wrapped).
- Bộ Xuất Ảnh Khoe Kỷ Luật Canvas High-DPI (Story 9:16 & Square 1:1).

### 10. Trụ Cột 5: Pomodoro Focus Station & Daily Stoic Quotes
- Đồng Hồ Pomodoro (25/5/15 phút) gắn liền với thói quen, thưởng +15 DP Deep Work Bonus.
- 4 Trạm Nhạc Sóng Não & Âm Thanh Trắng (Mưa rơi, Sóng biển, Tiếng ồn trắng, Lo-fi chords).
- Widget Trích Dẫn Khắc Kỷ & Động Lực Mỗi Ngày trên Dashboard.

---

## 🎯 5. KẾ HOẠCH CHO PHIÊN LÀM VIỆC TIẾP THEO (BUỔI CHIỀU)
1. **Kiểm tra phản hồi & trải nghiệm người dùng** trên phiên bản Live `v=4.9.0`.
2. **Cấp bậc Tổ Đội (Squad Ranks)**: Bàn thảo và triển khai hệ thống cấp bậc tổ đội mới nếu anh có thiết kế riêng cho tổ đội.
3. **Tối ưu hóa & Nâng cấp tính năng tiếp theo** theo chỉ đạo trực tiếp của anh.
