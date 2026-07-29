# Quick-start: CRM cho chuyên gia

Dành cho CRM của chuyên gia tư vấn cần một hồ sơ có dữ kiện ổn định, bản tóm tắt tiếng
Việt và audit trace, thay vì lưu văn bản luận giải không thể đối chiếu.

## 1. Cài package

```bash
npm install viet-bazi-engine
```

## 2. Chuyển input thành record CRM

```js
import {
  calculateBazi,
  createBaziAuditReport,
  localizeChartSummary
} from 'viet-bazi-engine';

export function buildBaziCrmRecord(clientId, birth) {
  const chart = calculateBazi(birth);

  return {
    clientId,
    schemaVersion: chart.schemaVersion,
    engineVersion: chart.metadata.methodology.engineVersion,
    summary: localizeChartSummary(chart, 'vi'),
    audit: createBaziAuditReport(chart),
    warnings: chart.metadata.warnings
  };
}

const record = buildBaziCrmRecord('client_01', {
  localDateTime: '1990-05-17T14:30:00',
  timezoneOffsetMinutes: 420,
  asOfYear: 2026,
  gender: 'female',
  trueSolarTime: true,
  location: { city: 'Hà Nội' }
});

console.log(record.summary.dayMaster, record.warnings);
```

`summary` dùng stable codes bên cạnh nhãn tiếng Việt. `audit` ánh xạ rule/version với
input và output paths, giúp đối chiếu lại hồ sơ khi engine hoặc phương pháp thay đổi.

## 3. Thiết kế dữ liệu có trách nhiệm

- Chỉ lưu ngày giờ sinh khi workflow thực sự cần và người dùng đã đồng ý.
- Tách chart deterministic khỏi ghi chú tư vấn hoặc nội dung do AI sinh.
- Lưu `engineVersion`, `schemaVersion` và warnings cùng record.
- Chạy `analyzeBirthTimeSensitivity()` trước khi kết luận với giờ sinh không chắc chắn.
- Không dùng compatibility hoặc heuristic làm cơ sở duy nhất cho quyết định quan trọng.

Nếu CRM cần xử lý import, dùng `calculateBaziBatch(inputs)`. Mỗi record trả `ok` cùng
`result` hoặc stable error `code`, nên một input lỗi không làm mất cả batch.

## Tiếp theo

- [API reference](https://github.com/iZenDeveloper/viet-bazi-engine/blob/main/docs/api-reference.md)
- [Compatibility policy](https://github.com/iZenDeveloper/viet-bazi-engine/blob/main/docs/compatibility-policy.md)
- [Schemas](https://github.com/iZenDeveloper/viet-bazi-engine/tree/main/schemas)
