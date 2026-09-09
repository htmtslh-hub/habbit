// ============================================================
// DANH MỤC BÀI VIẾT BLOG
//
// THÊM BÀI MỚI CHỈ CẦN 2 BƯỚC:
//   1. Tạo file  blog/<slug>.html  — chỉ viết phần NỘI DUNG (h2, p, ul…),
//      không cần <html>/<head>/<body>, trang blog-post.html sẽ tự bọc.
//   2. Thêm một mục vào đầu mảng bên dưới.
//
// Bài mới nhất để lên ĐẦU mảng.
// ============================================================

window.BLOG_POSTS = [
    {
        slug: 'toi-uu-toc-do-tai',
        title: 'Tôi tìm ra một file chiếm 82% dung lượng ứng dụng',
        excerpt: 'Người dùng báo app tải chậm. Tôi đo thử và phát hiện một file duy nhất chiếm 82% toàn bộ lượng tải — trong khi phần lớn người dùng không bao giờ cần tới nó.',
        date: '2026-09-09',
        tag: 'Làm sản phẩm',
        readMin: 5,
    },
    {
        slug: 'vi-sao-bo-cuoc-ngay-thu-4',
        title: 'Vì sao bạn bỏ cuộc vào ngày thứ 4?',
        excerpt: 'Không phải vì bạn lười. Có ba cơ chế tâm lý cụ thể khiến chuỗi ngày thường đứt đúng vào khoảng ngày thứ 3 đến thứ 5 — và cách hoá giải từng cái.',
        date: '2026-09-09',
        tag: 'Tâm lý hành vi',
        readMin: 6,
    },
];
