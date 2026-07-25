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
- [x] Hiển thị độ nhạy giờ sinh ±30 phút và tải sensitivity JSON đúng schema.
- [x] So sánh compatibility hai lá số, hiển thị factor/evidence và export JSON.
- [x] Compatibility hỗ trợ múi giờ, thành phố và True Solar Time độc lập cho người B.
- [x] Demo hỗ trợ tọa độ latitude/longitude tùy chỉnh cho cả hai người.
- [x] Hiển thị audit trace rule/version/path và export audit JSON đúng schema.
- [x] Localized compatibility report `vi`/`en` với stable grade/factor codes và parity bindings.
- [x] Localized audit và annual timeline `vi`/`en` với stable rule/pillar/ten-god codes.
- [x] Localized birth-time sensitivity `vi`/`en` với stable changed-pillar codes.
- [x] Localized chart summary `vi`/`en` cho các building block chính và AI consumers.
- [x] Bản địa hóa toàn bộ UI chrome, table headers, actions và accessibility labels của demo.

## Phase 4 — Reliability & Adoption

### P4.1 Distribution và benchmark

- [x] Benchmark batch deterministic, machine-readable và không áp ngưỡng CI dễ flaky.
- [x] Badge CI/release/license và kiểm tra metadata README chống lỗi thời.
- [ ] Publish package chính thức lên npm và PyPI sau khi có token/phê duyệt owner.
- [x] Thêm benchmark history có provenance, nhiều mẫu và min/median/max cùng baseline macOS/x64.
- [x] Bổ sung baseline Node.js 20 trên Linux từ manual GitHub-hosted benchmark artifact.

### P4.2 Accuracy và error contract

- [x] Stable error codes và message `vi`/`en` cho birth input, batch, CLI và Python bridge.
- [x] Mở rộng fixtures Lập Xuân theo từng thế kỷ từ 1600 đến 2400.
- [x] Mở rộng ranh Tiết khí chính thức NAOJ lên 36 điểm trong các năm 2013, 2020 và 2026.
- [x] Thêm fixtures chéo múi giờ, cùng UTC instant và ranh đổi ngày 23:00/00:00.
- [x] Đối chiếu NASA/JPL Horizons độc lập và công bố sai số theo từng thế kỷ.
- [x] Mở rộng error taxonomy chuyên biệt cho timeline, sensitivity, SVG và WASM.
- [x] Thêm model hoàng kinh biểu kiến opt-in với regression NAOJ/JPL trên miền 1600–2400.
- [x] Đưa lựa chọn model biểu kiến vào `calculateBazi`, JSON Schema, WASM và Python parity.

### P4.3 AI integration

- [x] Prompt templates `vi`/`en` có grounding theo stable codes/evidence và JSON Schema.
- [x] MCP `2025-06-18` server offline gọi engine bằng structured tools qua stdio.
- [x] Ví dụ interpretation pipeline tách calculation khỏi generated text bằng provider callback, SHA-256 và audit envelope.

### P4.4 Pre-1.0 stabilization

- [x] Công bố compatibility, deprecation và breaking-change policy dạng tài liệu + machine-readable CI contract.
- [x] Browser E2E cho demo trên Chromium, Firefox và WebKit bằng Playwright.
- [x] Audit public API bằng snapshot máy đọc cho TypeScript, package, schema, MCP và Python.
- [ ] Tạo/tag release candidate sau khi registry credentials sẵn sàng và các release gates xanh.

## Nguyên tắc phát hành

- Mỗi thay đổi public API phải có test TypeScript, JSON boundary và Python parity khi phù hợp.
- Không đọc đồng hồ hệ thống trong calculation; mọi ngữ cảnh Lưu Niên truyền qua `asOfYear`.
- Stable machine codes và schema version là hợp đồng; nhãn hiển thị có thể bản địa hóa.
- Chỉ phát hành sau khi `npm test`, Python tests và isolated wheel đều xanh trên CI.
- Tag `v*` phải khớp package version; release workflow tạo npm tarball, Python wheel và SHA-256 checksums.
