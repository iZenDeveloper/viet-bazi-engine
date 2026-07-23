# JSON Schema và conformance

## Schema IDs

| Contract | Version | ID |
|---|---:|---|
| Birth input | 1.0 | `https://viet-bazi.dev/schema/birth-input-1.0.json` |
| Bazi result | 1.7 | `https://viet-bazi.dev/schema/bazi-result-1.7.json` |
| Bazi audit report | 1.0 | `https://viet-bazi.dev/schema/bazi-audit-report-1.0.json` |
| Localized audit report | 1.0 | `https://viet-bazi.dev/schema/localized-audit-report-1.0.json` |
| Localized facts report | 1.0 | `https://viet-bazi.dev/schema/localized-facts-report-1.0.json` |
| Localized methodology report | 1.0 | `https://viet-bazi.dev/schema/localized-methodology-report-1.0.json` |
| Annual timeline | 1.0 | `https://viet-bazi.dev/schema/annual-timeline-1.0.json` |
| Batch input | 1.0 | `https://viet-bazi.dev/schema/bazi-batch-input-1.0.json` |
| Batch result | 1.0 | `https://viet-bazi.dev/schema/bazi-batch-result-1.0.json` |
| Birth-time sensitivity | 1.0 | `https://viet-bazi.dev/schema/birth-time-sensitivity-1.0.json` |
| Compatibility input | 1.0 | `https://viet-bazi.dev/schema/compatibility-input-1.0.json` |
| Compatibility result | 1.0 | `https://viet-bazi.dev/schema/compatibility-result-1.0.json` |
| Localized compatibility report | 1.0 | `https://viet-bazi.dev/schema/localized-compatibility-report-1.0.json` |

Schema vừa là object export trong package, vừa có file JSON vật lý trong thư mục `schemas/` của npm tarball. `$id` là định danh contract; consumer offline không cần tải URL:

```ts
import Ajv2020 from 'ajv/dist/2020.js';
import { BIRTH_INPUT_JSON_SCHEMA } from 'viet-bazi-engine';

const validate = new Ajv2020().compile(BIRTH_INPUT_JSON_SCHEMA);
```

Artifact cũng có thể được resolve qua package export, ví dụ `viet-bazi-engine/schemas/birth-input-1.0.json`.

Batch schemas dùng `$ref` tới input/result schema. Hãy đăng ký dependencies với Ajv trước khi compile batch output.

`npm run build` tái tạo `schemas/manifest.json` và mọi artifact theo thứ tự deterministic. Test suite so sánh semantic JSON với exports để phát hiện drift.

Audit report là contract riêng: mỗi rule có mã/version ổn định, category, mô tả và các JSON path input/output. Localized audit thay `descriptionVi` bằng `text` Việt/Anh nhưng giữ toàn bộ trường định danh ổn định. Cách tách này bổ sung traceability mà không làm thay đổi schema lá số `1.7`.

## Stable codes

Can, Chi, Ngũ Hành, Âm Dương, Thập Thần, quan hệ, Thần Sát và methodology dùng code tiếng Anh ổn định. Nhãn hiển thị có thể thay đổi theo locale; logic downstream nên dựa vào code.

## Conformance fixtures

`fixtures/v1/manifest.json` mô tả fixture set `1.0.0` và nguồn. Hai dataset portable:

- `jie-2026.json`: 12 ranh Tiết.
- `sexagenary-days.json`: 6 ngày Can–Chi trải 1900–2099.

Chạy độc lập trên artifact đã build:

```bash
npm run build
npm run test:conformance
```

Runner đồng thời kiểm tra JSON fixtures trùng exports TypeScript, tránh drift giữa bindings.

## Capability discovery

`getEngineCapabilities()` là cách chuẩn để đọc versions, schema IDs, feature codes và public limits tại runtime. Không parse README hoặc package version để suy luận khả năng.
