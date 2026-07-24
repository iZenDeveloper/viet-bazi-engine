# API Reference

Mọi API dưới đây được export từ package root `viet-bazi-engine`.

## Calculation

### `calculateBazi(input)`

```ts
function calculateBazi(input: BirthInput): BaziResult
```

Pure, deterministic entry point. Trả Tứ Trụ, Nhật Chủ, Ngũ Hành, quan hệ Chi, Đại Vận, Lưu Niên, Thần Sát, cách cục và metadata. Overload `calculateBazi(input, asOfYear)` còn tồn tại để tương thích nhưng đã deprecated.

### `calculateAnnualTimeline(chart, fromYear, toYear)`

Sinh tối đa 201 Lưu Niên từ một lá số có sẵn. Năm phải là số nguyên trong `1600..2400`, tăng dần.

`calculateAnnualTimelineFromJson(json, fromYear, toYear, asOfYear?)` là JSON bridge strict tương ứng.

`localizeAnnualTimeline(timeline, locale)` / `localizeAnnualTimelineFromJson(json, fromYear, toYear, locale?)` tạo view `vi` hoặc `en`, giữ stable stem/branch/ten-god codes và thứ tự Đại Vận. Output tuân theo `localized-annual-timeline-1.0`.

`localizeFacts(chart, locale)` / `localizeFactsFromJson(json, locale?)` trả facts và warnings bằng `vi` hoặc `en`, giữ nguyên stable `code` và `evidence`.

`localizeMethodology(manifest, locale)` / `localizeMethodologyFromJson(json, locale?)` trả 13 mô tả quy ước bằng `vi` hoặc `en`. `code` và `value` luôn ổn định giữa các locale để ứng dụng và LLM có thể vừa hiển thị tự nhiên vừa audit chính xác.

`localizeChartSummary(chart, locale)` / `localizeChartSummaryFromJson(json, locale?)` trả view AI-friendly gồm bốn trụ, Nhật Chủ, Ngũ Hành, Đại Vận hiện hành, Lưu Niên và cách cục. Mọi thành phần giữ stable codes song song với nhãn `vi/en`; output tuân theo `localized-chart-summary-1.0`.

### `analyzeBirthTimeSensitivity(input, windowMinutes?, stepMinutes?)`

Lấy mẫu quanh giờ sinh, deduplicate theo bốn trụ và trả `changedPillars`. Mặc định ±120 phút, bước 5 phút; tối đa ±720 phút và 289 mẫu.

`localizeBirthTimeSensitivity(report, locale)` / `localizeBirthTimeSensitivityFromJson(...)` thêm summary và tên trụ `vi/en`, đồng thời giữ `changedPillarCodes` và pillar snapshots ổn định. Output tuân theo `localized-birth-time-sensitivity-1.0`.

### `compareBaziCharts(a, b)`

Trả score heuristic `0..100`, grade, từng factor và evidence. Đây là chỉ báo tham khảo văn hóa, không dự đoán chất lượng quan hệ.

### `compareBirthInputs(a, b)` / `compareBirthInputsFromJson(json)`

Tính hai lá số từ birth inputs rồi chạy cùng compatibility heuristic. JSON form nhận array đúng hai phần tử và phù hợp với CLI/Python bridge.

`localizeCompatibility(result, locale)` / `localizeCompatibilityFromJson(json, locale?)` trả grade/factor/warning bằng `vi` hoặc `en`, đồng thời giữ nguyên `gradeCode`, factor code, score và evidence.

### `createBaziAuditReport(chart)` / `createBaziAuditReportFromJson(json)`

Trả báo cáo kiểm toán deterministic, độc lập với JSON lá số. Mỗi entry có stable `ruleCode`, `ruleVersion`, nhóm quy tắc, mô tả tiếng Việt và các JSON path input/output liên quan. Report dùng schema `1.0`, ghi engine/chart version và cảnh báo nếu giờ sinh sát ranh Tiết khí.

`localizeBaziAuditReport(report, locale)` / `localizeBaziAuditReportFromJson(json, locale?)` trả trường `text` và warnings bằng `vi` hoặc `en`, đồng thời giữ nguyên rule code/version/category/path. Output tuân theo `localized-audit-report-1.0`.

## Rendering và localization

### `renderBaziSvg(chart, options?)`

```ts
renderBaziSvg(chart, {
  width: 900,
  title: 'Lá số',
  showHiddenStems: true,
  showElementBalance: true,
  highContrast: false,
  locale: 'vi'
});
```

Trả chuỗi SVG standalone, có `role`, accessible description, legend và thanh tỷ lệ Ngũ Hành. `highContrast` dùng palette đậm cùng viền rõ hơn; `showElementBalance: false` giữ layout gọn tương tự phiên bản cũ.

`renderBaziSvgFromJson(json, options?)` thực hiện strict JSON validation rồi render cùng output.

### `getCoreLabels(locale)`

Trả từ điển `vi` hoặc `en` cho Can, Chi, Ngũ Hành, Thập Thần, quan hệ và Thần Sát theo stable codes.

## JSON boundary và batch

- `validateBirthInput(value)` — strict runtime validation.
- `calculateBaziFromJson(json)` — parse, validate và tính một lá số.
- `calculateBaziBatch(values)` — tối đa 1.000 records, giữ thứ tự và cô lập lỗi.
- `calculateBaziBatchFromJson(json)` — JSON bridge cho batch.
- `analyzeBirthTimeSensitivityFromJson(json, window?, step?)` — JSON bridge cho sensitivity.

Batch envelope:

```json
{
  "schemaVersion": "1.1",
  "summary": { "total": 2, "succeeded": 1, "failed": 1 },
  "items": [
    { "index": 0, "ok": true, "result": {} },
    { "index": 1, "ok": false, "error": { "name": "TypeError", "code": "GENDER", "message": "..." } }
  ]
}
```

`BaziError` cung cấp stable `code`, `name` tương thích và message mặc định tiếng Việt. `toBaziErrorPayload(error, locale)` tạo payload `vi`/`en` mà không đổi code. CLI hỗ trợ `--error-json`; Python `VietBaziError` expose cùng code qua thuộc tính `.code`.

Error taxonomy bao phủ birth input, JSON parsing, batch, compatibility, timeline, sensitivity, SVG và WASM. `BAZI_ERROR_CODES` là catalog public để consumer validate hoặc map UI mà không phụ thuộc nội dung message.

## Calendar primitives

- `solarLongitude(date)` — hoàng kinh biểu kiến xấp xỉ, độ.
- `equationOfTime(date)` — equation of time xấp xỉ, phút.
- `solarCorrectionMinutes(date, longitude, offsetMinutes)`.
- `solarTermBoundary(year, targetLongitude)` — crossing với độ phân giải phút.

## Location

- `VIETNAM_CITIES` — catalog offline 10 thành phố.
- `findCity(query)` — tìm theo tên, alias, có/không dấu.
- `resolveLocation(location)` — chuẩn hóa city hoặc tọa độ.

## Discovery và constants

- `ENGINE_VERSION`
- `getEngineCapabilities()`
- `getMethodologyManifest(dayBoundary, trueSolarTime)`
- `STEMS`, `BRANCHES`, `ELEMENTS`
- `SHEN_SHA_CATALOG`, `SHEN_SHA_CODES`
- `CONFORMANCE_VERSION`, `JIE_2026_FIXTURES`, `SEXAGENARY_DAY_FIXTURES`, `TIMEZONE_BOUNDARY_FIXTURES`

## JSON Schema exports

- `BIRTH_INPUT_JSON_SCHEMA`
- `BAZI_RESULT_JSON_SCHEMA`
- `BAZI_AUDIT_REPORT_JSON_SCHEMA`
- `ANNUAL_TIMELINE_JSON_SCHEMA`
- `BAZI_BATCH_INPUT_JSON_SCHEMA`
- `BAZI_BATCH_RESULT_JSON_SCHEMA`
- `BIRTH_TIME_SENSITIVITY_JSON_SCHEMA`

Các interface TypeScript như `BirthInput`, `BaziResult`, `Pillar`, `MethodologyManifest`, `CompatibilityResult` và `EngineCapabilities` được export bằng `export type *`.
