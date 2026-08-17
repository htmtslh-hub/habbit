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

---

## 🎯 4. KẾ HOẠCH PHÁT TRIỂN TIẾP THEO (TỪ FILE `ideas.txt`)

Khi bắt đầu phiên làm việc mới, người dùng có thể yêu cầu phát triển tiếp các tính năng sau:
1. **Trụ cột 1**: Bình đóng băng chuỗi (*Streak Freeze*) & Vá chuỗi trong 24h (*Streak Repair*).
2. **Trụ cột 2**: Cửa hàng Kỷ luật (*DP Shop*) — đổi điểm lấy Danh hiệu, Theme màu, Gói âm thanh/hiệu ứng check-in.
3. **Trụ cột 3**: Tổ đội rèn luyện (*Squads/Guilds*) & Thách đấu 1v1 7 ngày (*Streak Duel*).
4. **Trụ cột 4**: Bản tin tổng kết tuần (*Weekly Recap*) & Nút xuất ảnh thẻ Story 9:16 khoe mạng xã hội.
5. **Trụ cột 5**: Đồng hồ tập trung *Pomodoro Timer* tích hợp nhạc sóng não + Trích dẫn truyền cảm hứng mỗi ngày (*Stoic Quotes*).

---

## 💡 HƯỚNG DẪN DÀNH CHO AI KHI BẮT ĐẦU PHIÊN MỚI:
1. Đọc file này để nắm vững toàn bộ kiến trúc và hiện trạng dự án.
2. Kiểm tra `sw.js` nếu có chỉnh sửa mã nguồn để tăng `CACHE_VERSION`.
3. Kiểm tra cú pháp bằng lệnh `node -c app.js` trước khi commit & deploy.
4. Triển khai đồng thời lên cả **Firebase Hosting** (`npx firebase deploy --only hosting`) và **Vercel** (`npx vercel --prod --yes`).
