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

- Mục tiêu: cho phép chọn `vi`/`en` cho facts, warnings và mô tả methodology mà không đổi stable codes.
- Tiêu chí nghiệm thu: output machine codes giữ nguyên; snapshot Việt/Anh được kiểm thử; JSON Schema mô tả locale.

### P3.2 SVG chart nâng cao

- [x] Legend Ngũ Hành, thanh tỷ lệ và tùy chọn màu tương phản cao.
- [x] SVG standalone vẫn accessible, title được escape và output deterministic.

### P3.3 WASM full-engine adapter

- Mục tiêu: cung cấp cùng orchestration qua adapter WASM khi host muốn giảm phụ thuộc JavaScript.
- Tiêu chí nghiệm thu: kết quả fixtures TypeScript/WASM giống nhau theo stable codes; ABI có version và giới hạn rõ ràng.

### P3.4 Demo offline

- Mục tiêu: một trang web tĩnh nhập ngày giờ sinh, chọn thành phố và tải SVG/JSON ngay trên máy.
- Tiêu chí nghiệm thu: không analytics/network runtime, build reproducible, có cảnh báo near-boundary và disclaimer.

## Nguyên tắc phát hành

- Mỗi thay đổi public API phải có test TypeScript, JSON boundary và Python parity khi phù hợp.
- Không đọc đồng hồ hệ thống trong calculation; mọi ngữ cảnh Lưu Niên truyền qua `asOfYear`.
- Stable machine codes và schema version là hợp đồng; nhãn hiển thị có thể bản địa hóa.
- Chỉ phát hành sau khi `npm test`, Python tests và isolated wheel đều xanh trên CI.
