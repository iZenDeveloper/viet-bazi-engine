# Roadmap

## Đã hoàn thành — Core v0.25

- [x] Bốn trụ theo Lập Xuân, 12 Tiết khí và hai quy ước đổi ngày.
- [x] True Solar Time với city catalog và tọa độ tùy biến.
- [x] Ngũ Hành, Tàng Can, Thập Thần, quan hệ Chi, Cách cục heuristic.
- [x] Đại Vận, Lưu Niên đơn và timeline tối đa 201 năm.
- [x] Thần Sát catalog, metadata facts và audit trace theo rule/version.
- [x] Compatibility, birth-time sensitivity và SVG accessible.
- [x] TypeScript API, JSON bridge, CLI, Python wheel và WASM calendar kernel.
- [x] JSON Schema, conformance fixtures, integrity manifest và CI offline-first.

## Phase 3 — Productization

### P3.1 Localization hoàn chỉnh

- [x] Cho phép chọn `vi`/`en` cho facts và warnings mà không đổi stable codes.
- [x] API TypeScript, JSON bridge, CLI `--facts` và Python parity.
- [x] Bản địa hóa mô tả methodology và schema riêng cho localized report.

### P3.2 SVG chart nâng cao

- [x] Legend Ngũ Hành, thanh tỷ lệ và tùy chọn màu tương phản cao.
- [x] SVG standalone vẫn accessible, title được escape và output deterministic.

### P3.3 WASM full-engine adapter

- [x] Cung cấp orchestration dùng WASM calendar primitives khi host muốn giảm phụ thuộc JavaScript.
- [x] Parity full output với TypeScript fixtures, ABI version `1` và kiểm tra giới hạn loader.
- [x] Loader nhận trực tiếp Web `Response`, ưu tiên streaming và fallback khi MIME chưa đúng.

### P3.4 Demo offline

- [x] Trang web tĩnh nhập ngày giờ sinh, chọn thành phố và tải SVG/JSON ngay trên máy.
- [x] Không analytics/network runtime, có cảnh báo near-boundary và disclaimer.
- [x] Hiển thị facts/methodology `vi`/`en` và tải methodology JSON đúng schema.

## Nguyên tắc phát hành

- Mỗi thay đổi public API phải có test TypeScript, JSON boundary và Python parity khi phù hợp.
- Không đọc đồng hồ hệ thống trong calculation; mọi ngữ cảnh Lưu Niên truyền qua `asOfYear`.
- Stable machine codes và schema version là hợp đồng; nhãn hiển thị có thể bản địa hóa.
- Chỉ phát hành sau khi `npm test`, Python tests và isolated wheel đều xanh trên CI.
- Tag `v*` phải khớp package version; release workflow tạo npm tarball, Python wheel và SHA-256 checksums.
