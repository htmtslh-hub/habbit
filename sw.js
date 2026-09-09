// ===== HABIT MASTERY - SERVICE WORKER =====
// Đổi CACHE_VERSION mỗi khi deploy để buộc trình duyệt lấy bản mới.
const CACHE_VERSION = '5.12.3';
const CACHE_NAME = `habit-game-v${CACHE_VERSION}`;

// ===== PRECACHE: CHỈ phần vỏ ứng dụng =====
//
// [v5.12.3] Danh sách này trước đây liệt kê cả app.js, style.css,
// all_books_data.js... — tức là mỗi lần cài Service Worker, trình duyệt
// tải lại TOÀN BỘ các file đó MỘT LẦN NỮA ở dạng URL không có ?v=.
// Đo thực tế: trang tải 1,66 MB, SW tải thêm 1,73 MB => lần đầu vào app
// mất ~3,39 MB cho cùng một bộ file.
//
// Nay chỉ precache phần vỏ (nhẹ, cần cho offline). Các file js/css thật
// đều được yêu cầu kèm ?v= và sẽ tự vào cache ở lần dùng đầu tiên theo
// chiến lược cache-first bên dưới — không tốn thêm lần tải nào.
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/auth.html',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json'
];

// ===== INSTALL =====
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Dùng addAll thì chỉ cần 1 file lỗi là hỏng cả lần cài. Thêm từng
      // file riêng để một file thiếu không chặn Service Worker khởi động.
      return Promise.all(
        ASSETS_TO_CACHE.map(url =>
          cache.add(url).catch(err => console.warn('[SW] Bỏ qua', url, err.message))
        )
      );
    })
  );
});

// ===== ACTIVATE: dọn cache cũ =====
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();

  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({ type: 'SW_UPDATED', version: CACHE_VERSION });
    });
  });
});

// ===== MESSAGE =====
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ===== FETCH =====
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Bỏ qua request không phải GET và các API bên ngoài
  if (event.request.method !== 'GET') return;
  if (url.pathname.startsWith('/downloads/') || url.pathname.endsWith('.exe')) return;
  if (url.hostname.includes('googleapis.com') && !url.hostname.includes('fonts')) return;
  if (url.hostname.includes('firebaseio.com') ||
      url.hostname.includes('gstatic.com') ||
      url.hostname.includes('google.com') ||
      url.hostname.includes('firebaseapp.com')) {
    return;
  }

  // Google Fonts: cache-first
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // ----- js/css CÓ ĐÁNH SỐ PHIÊN BẢN: cache-first -----
  //
  // [v5.12.3] Trước đây MỌI thứ đều network-first, nghĩa là lần mở app
  // nào cũng phải chờ mạng trả lời rồi mới hiện được — cache chỉ có tác
  // dụng khi mất mạng, không hề làm app nhanh hơn.
  //
  // Với file mang ?v= thì cache-first là an toàn tuyệt đối: sửa file là
  // phải nâng ?v=, mà đổi ?v= thì URL khác đi nên thành một mục cache
  // khác hẳn — không có đường nào phục vụ nhầm bản cũ.
  const isVersionedAsset =
    /\.(js|css)$/i.test(url.pathname) &&
    /(^|[?&])v=/.test(url.search) &&
    url.origin === self.location.origin;

  if (isVersionedAsset) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // ----- Còn lại (HTML, ảnh, sw.js...): network-first -----
  // HTML phải ưu tiên mạng để bản deploy mới tới được người dùng ngay.
  event.respondWith(
    fetch(event.request)
      .then(resp => {
        if (resp && resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return resp;
      })
      .catch(() => caches.match(event.request))
  );
});

// Trả ngay từ cache nếu có; chưa có thì lấy mạng rồi lưu lại.
function cacheFirst(request) {
  return caches.match(request).then(cached => {
    if (cached) return cached;
    return fetch(request).then(resp => {
      if (resp && resp.ok) {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(c => c.put(request, clone));
      }
      return resp;
    });
  });
}
