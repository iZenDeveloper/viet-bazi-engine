# Demo web offline

Demo trong `demo/` dùng trực tiếp ESM artifact ở `dist/`, không CDN, analytics, API server hoặc network request runtime.

```bash
npm install
npm run demo
```

Mở `http://127.0.0.1:8080/demo/`. Đổi cổng bằng biến `VIET_BAZI_DEMO_PORT`. Server chỉ dùng Node.js built-ins, phục vụ workspace trên loopback và chặn path vượt khỏi project root.

Trình duyệt thực hiện toàn bộ calculation, True Solar Time và SVG rendering tại chỗ. Demo dùng catalog thành phố của engine hoặc cặp latitude/longitude tùy chỉnh cho từng người, hỗ trợ hai quy ước đổi ngày và báo cáo Việt/Anh. Có thể tải kết quả dạng SVG/JSON hoặc methodology JSON đúng schema; input gần ranh Tiết khí sẽ hiện cảnh báo.

Sau mỗi lần tính, phần tóm tắt hiển thị Nhật Chủ, Lưu Niên, Đại Vận đang hoạt động và Cách cục; structured JSON vẫn là nguồn dữ liệu đầy đủ.
Phần giải thích hiển thị localized facts và 13 quy ước methodology. Đổi ngôn ngữ sẽ tính/render lại toàn bộ SVG và hai vùng giải thích mà không gửi dữ liệu ra ngoài.
Audit trace đóng mặc định để giữ giao diện gọn; khi mở, nó hiển thị engine/chart version, rule code/version/category, mô tả theo locale và các đường dẫn input/output. Báo cáo tải xuống tuân theo `localized-audit-report-1.0`.
Phần độ nhạy lấy 13 mẫu trong cửa sổ ±30 phút, nhóm các mẫu có cùng bốn trụ và chỉ rõ trụ nào thay đổi so với giờ nhập. Báo cáo có thể tải dưới dạng JSON theo schema `birth-time-sensitivity-1.0`.
Phần compatibility dùng lá số đang hiển thị làm người A và nhận ngày giờ, giới tính, UTC offset, thành phố và True Solar Time riêng cho người B. Hai người chỉ dùng chung `asOfYear` và quy ước đổi ngày. Demo hiển thị tổng điểm, grade, bốn factor cùng evidence và disclaimer theo locale đang chọn; kết quả tải xuống tuân theo `localized-compatibility-report-1.0`.
Ngay dưới biểu đồ là timeline 5 năm quanh `asOfYear`, gồm Can Chi, Thập Thần và Đại Vận theo locale đang chọn; năm đang xem được làm nổi bật.

Service worker dùng chiến lược cache-first cho các file cùng origin. Sau lần tải thành công đầu tiên, demo có thể reload khi offline. Khi sửa asset cache, tăng version `CACHE` trong `service-worker.js` để activation xóa cache cũ.

`manifest.webmanifest` và icon SVG nội bộ cho phép cài demo dạng standalone trên trình duyệt hỗ trợ. Việc cài đặt cần secure context; `localhost` được trình duyệt xem là secure cho mục đích phát triển.

CI chạy HTTP smoke test trên loopback để xác minh HTML, ESM, manifest, MIME types và phản hồi `404`; server con luôn được dừng sau test.

## GitHub Pages

`npm run pages:build` tạo artifact `dist-pages/` gồm demo, ESM build, WASM và service worker với relative paths đã kiểm thử. Workflow `Pages` chỉ chạy thủ công (`workflow_dispatch`) và deploy qua GitHub Pages OIDC; repository cần chọn GitHub Actions làm Pages source trước lần chạy đầu tiên.

Sau deploy, workflow chạy live smoke test trên HTTPS URL thực tế cho root, demo, manifest, ESM và service worker. Có thể chạy thủ công cùng kiểm tra bằng `node scripts/test-pages-live.mjs https://izendeveloper.github.io/viet-bazi-engine/`.

Không mở `index.html` trực tiếp bằng `file://` vì browser thường chặn ESM import giữa thư mục. Static server chỉ phục vụ file local và không gửi dữ liệu tới bên thứ ba.
