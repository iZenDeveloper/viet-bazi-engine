# Changelog

Project dùng Semantic Versioning trong giai đoạn pre-1.0.

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
