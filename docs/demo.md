# Demo web offline

Demo trong `demo/` dùng trực tiếp ESM artifact ở `dist/`, không CDN, analytics, API server hoặc network request runtime.

```bash
npm install
npm run build
python3 -m http.server 8080
```

Mở `http://localhost:8080/demo/`. Trình duyệt thực hiện toàn bộ calculation, True Solar Time và SVG rendering tại chỗ. Demo dùng catalog thành phố của engine, hỗ trợ hai quy ước đổi ngày và SVG Việt/Anh. Có thể tải kết quả dạng SVG/JSON; input gần ranh Tiết khí sẽ hiện cảnh báo.

Không mở `index.html` trực tiếp bằng `file://` vì browser thường chặn ESM import giữa thư mục. Static server chỉ phục vụ file local và không gửi dữ liệu tới bên thứ ba.
