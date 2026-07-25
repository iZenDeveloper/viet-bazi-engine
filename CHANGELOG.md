# Changelog

Project dùng Semantic Versioning trong giai đoạn pre-1.0.

## 0.53.0

- Khóa public API bằng snapshot máy đọc cho JavaScript runtime, TypeScript declarations, package entrypoints/binaries, schema IDs, MCP tools và Python exports.
- Chạy audit trong `npm test`, đóng gói baseline vào npm tarball và xác minh bằng release preflight.
- Công bố kết quả audit cùng checklist và các blocker còn lại trước release candidate.
- Thêm reference benchmark runner, history có provenance và baseline năm mẫu; CI khóa correctness/schema nhưng không áp performance threshold.
- Chạy Playwright trên hosted Chromium/Firefox/WebKit CI và cung cấp manual Node 20/Linux reference benchmark artifact.
- Hỗ trợ SemVer prerelease trong release preflight và thêm machine-readable RC readiness check không tự tag/publish.
- Thêm release version preparer dry-run mặc định, khóa worktree/changelog/occurrence trước khi cho phép ghi đồng bộ RC version.
- Tái cấu trúc README theo adoption funnel với live demo CTA, lý do tồn tại, use cases, contract khác biệt và trạng thái registry minh bạch.

## 0.52.0

- Thêm Playwright Browser E2E projects cho Chromium, Firefox và WebKit.
- Khóa calculation, localization, compatibility, structured download, service-worker cache và calculation không network.
- Cung cấp lệnh cài browser/system dependencies cho CI; Playwright chỉ là dev dependency, runtime engine vẫn zero dependency.

## 0.51.0

- Công bố public contract, additive/breaking classification và chính sách accuracy fixes trong giai đoạn pre-1.0.
- Yêu cầu deprecation giữ tối thiểu hai minor releases, có replacement, changelog và migration guide.
- Thêm machine-readable compatibility policy cùng CI check khóa Node floor, stable-code/schema rules và documentation links.

## 0.50.0

- Thêm interpretation pipeline provider-neutral, chạy offline bằng mock provider và không thêm runtime dependency.
- Tách calculation khỏi generated prose bằng callback boundary; lưu chart SHA-256, engine/template và provider/model metadata.
- Thêm JSON Schema cho audit envelope cùng test khóa tính deterministic và chống generated text làm drift calculation.

## 0.49.0

- Thêm binary `viet-bazi-mcp`, stdio JSON-RPC theo MCP revision `2025-06-18` và không có runtime dependency.
- Expose 5 structured tools cho capabilities, calculation, sensitivity, compatibility và grounded prompt.
- Trả đồng thời `structuredContent`/JSON text, stable tool errors; thêm protocol unit test, process smoke test và tài liệu cấu hình.

## 0.48.0

- Thêm prompt template `GROUNDED_BAZI_INTERPRETATION` song ngữ với năm focus và messages trung lập nhà cung cấp.
- Bundle summary, facts, methodology và audit làm grounding; bắt buộc dẫn stable codes/evidence và giữ guardrails.
- Thêm JSON bridge, type-safe API, capability `PROMPT_GROUNDING`, JSON Schema và tài liệu integration.

## 0.47.0

- Nâng conformance fixtures lên `1.3.0` với 9 checkpoint Lập Xuân NASA/JPL Horizons từ năm 1600 đến 2400.
- Lưu query profile, mẫu kinh độ kẹp 315°, phép nội suy và provenance để fixture có thể audit độc lập.
- Công bố sai số theo từng thế kỷ; sai số lớn nhất quan sát là 36,84 phút với ngưỡng regression 40 phút trên toàn miền.

## 0.46.0

- Nâng conformance fixtures lên `1.2.0` với 24 ranh Tiết NAOJ năm 2013 và 2020, tổng cộng 36 điểm qua ba năm.
- Giữ regression threshold 15 phút; sai số lớn nhất quan sát được vẫn là 11 phút.
- Export dataset TypeScript/JSON, ghi rõ JCST→UTC và đưa file vào package preflight.

## 0.45.0

- Nâng conformance fixtures lên `1.1.0` với 10 ca chéo UTC+7/UTC/UTC-5 và ranh đổi ngày 23:00/00:00.
- Khóa normalized UTC cùng expected four-pillar codes; cùng UTC instant giữ trụ Năm/Tháng nhưng Ngày/Giờ theo local civil time.
- Export fixture TypeScript/JSON và đưa dataset portable vào npm package.

## 0.44.0

- Mở rộng stable error taxonomy cho timeline, sensitivity, SVG và WASM.
- SVG từ chối width/locale không hợp lệ thay vì âm thầm chuẩn hóa; WASM phân biệt lỗi instantiate và ABI.
- Thêm parity tests cho TypeScript, CLI structured errors và Python `VietBaziError.code`.

## 0.43.0

- Thêm `BaziError` với stable code, message `vi`/`en` và serializer machine-readable.
- Batch failure có `error.code`; JSON Schema, CLI `--error-json` và Python `VietBaziError.code` dùng cùng contract.
- Chuẩn hóa lỗi birth input, JSON parsing, batch limit và compatibility arity.

## 0.42.0

- Khởi động Phase 4 với benchmark batch deterministic, output JSON machine-readable và correctness contract trong CI.
- Thêm tài liệu benchmark, badge CI/release/license và kiểm tra README không chứa thống kê test viết tay dễ lỗi thời.
- Mở roadmap Reliability, Accuracy, AI integration và Pre-1.0 stabilization.

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
