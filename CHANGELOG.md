# Changelog

Project dùng Semantic Versioning trong giai đoạn pre-1.0.

## 0.41.0

- Bản địa hóa toàn bộ giao diện demo `vi`/`en`: form, options, headings, tables, actions, aria labels, trạng thái và disclaimer.
- Giữ một DOM semantic duy nhất và đổi ngôn ngữ hoàn toàn client-side/offline.

## 0.40.0

- Thêm localized chart summary `vi`/`en` cho bốn trụ, Nhật Chủ, Ngũ Hành, Đại Vận, Lưu Niên và cách cục.
- Đồng bộ TypeScript, JSON bridge, CLI `--summary`, Python, demo và JSON Schema với stable codes.

## 0.39.0

- Thêm localized birth-time sensitivity report `vi`/`en` với stable pillar codes và summary thân thiện LLM.
- Đồng bộ TypeScript, JSON bridge, CLI `--sensitivity --locale`, Python, demo và JSON Schema.

## 0.38.0

- Thêm localized annual timeline `vi`/`en` với stable Can, Chi, Thập Thần và thứ tự Đại Vận.
- Đồng bộ TypeScript, JSON bridge, CLI `--timeline --locale`, Python, demo và JSON Schema.

## 0.37.0

- Thêm localized audit report `vi`/`en` nhưng giữ stable rule code/version/category/path.
- Đồng bộ TypeScript, JSON bridge, CLI `--audit --locale`, Python, demo và JSON Schema.

## 0.36.0

- Thêm localized compatibility report `vi`/`en` với stable grade/factor codes.
- TypeScript, JSON bridge, CLI, Python, demo và JSON Schema có parity.

## 0.35.0

- Demo hiển thị audit trace gồm rule code/version/category và input/output paths.
- Cho tải audit JSON đúng schema `bazi-audit-report-1.0`.

## 0.34.0

- Demo nhận latitude/longitude tùy chỉnh cho cả người A và B.
- City catalog vẫn là mặc định; tọa độ thủ công dùng cùng validation public của engine.

## 0.33.0

- Compatibility demo nhận UTC offset, thành phố và True Solar Time riêng cho người B.
- Giữ `asOfYear` và quy ước đổi ngày chung để hai kết quả có cùng context phân tích.

## 0.32.0

- Demo offline so sánh compatibility giữa lá số đang xem và người B.
- Hiển thị score, grade, bốn factor/evidence và export JSON đúng schema.

## 0.31.0

- Demo phân tích độ nhạy giờ sinh với 13 mẫu trong cửa sổ ±30 phút.
- Hiển thị trạng thái trụ, các trụ thay đổi và export sensitivity JSON đúng schema.

## 0.30.0

- Demo offline hiển thị localized facts và 13 quy ước methodology bằng Việt/Anh.
- Cho tải methodology JSON đúng schema và làm mới service-worker cache.

## 0.29.0

- Thêm localized methodology report `vi`/`en` với 13 stable code/value.
- Public API, JSON bridge, CLI `--methodology`, Python parity và JSON Schema `1.0`.
- WASM loader nhận trực tiếp Web `Response`, hỗ trợ streaming compilation và MIME fallback.

## 0.28.0

- Thêm JSON Schema `annual-timeline-1.0` và capability discovery tương ứng.
- Demo/PWA offline có Node.js static server zero-dependency.

## 0.27.0

- Thêm localized facts/warnings qua TypeScript, JSON bridge, CLI và Python.

## 0.26.0

- SVG hiển thị thanh tỷ lệ Ngũ Hành deterministic và accessible.
- Thêm `highContrast`, `showElementBalance`, CLI flags và Python parity.

## 0.25.0

- Thêm `calculateAnnualTimelineFromJson()` cho JSON bridge.

## 0.24.0

- Thêm audit report deterministic ánh xạ rule/version với đường dẫn input và output.
- Public API, JSON bridge, CLI `--audit` và Python `create_bazi_audit_report()`.
- JSON Schema audit `1.0` và capability `AUDIT_TRACE`.

## 0.23.0

- SVG export qua JSON bridge và CLI raw-output mode.
- CLI hỗ trợ locale, title, width và ẩn Tàng Can.
- Python `render_bazi_svg()` dùng verified bundled engine.

## 0.22.0

- Compatibility nhận trực tiếp hai birth inputs qua TypeScript và JSON bridge.
- CLI `--compatibility` và Python `compare_birth_inputs()` dùng cùng heuristic engine.
- JSON Schema version 1.0 cho compatibility input/result.

## 0.21.0

- Python wrapper xác minh file set, byte length và SHA-256 của bundled engine.
- Integrity verification fail closed và được cache theo process.
- Thêm public `verify_bundled_engine()` cùng tamper regression test.

## 0.20.0

- Python wheel bundle engine JavaScript cùng SHA-256 manifest.
- Python binding ưu tiên bundled engine để tránh lệch version với npm CLI toàn cục.
- Thêm isolated-wheel test chạy ngoài workspace.

## 0.19.0

- Hoàn thiện core Tứ Trụ, Ngũ Hành, Thập Thần, Đại Vận, Lưu Niên, Thần Sát và cách cục heuristic.
- True solar time, compatibility, SVG, Việt/Anh và city catalog offline.
- JSON CLI, strict validation, batch, stdin và Python wrapper.
- WASM calendar ABI v1 và full-engine adapter.
- JSON Schema cho input, result, batch và sensitivity.
- Conformance fixtures NAOJ và capability discovery.
- Configurable day boundary và birth-time sensitivity analysis.

Chi tiết lịch sử trước 0.19.0 chưa được tách theo release vì repository được công bố lần đầu tại mốc này.
