# JSON Schema và conformance

## Schema IDs

| Contract | Version | ID |
|---|---:|---|
| Birth input | 1.0 | `https://viet-bazi.dev/schema/birth-input-1.0.json` |
| Bazi result | 1.7 | `https://viet-bazi.dev/schema/bazi-result-1.7.json` |
| Bazi audit report | 1.0 | `https://viet-bazi.dev/schema/bazi-audit-report-1.0.json` |
| Batch input | 1.0 | `https://viet-bazi.dev/schema/bazi-batch-input-1.0.json` |
| Batch result | 1.0 | `https://viet-bazi.dev/schema/bazi-batch-result-1.0.json` |
| Birth-time sensitivity | 1.0 | `https://viet-bazi.dev/schema/birth-time-sensitivity-1.0.json` |
| Compatibility input | 1.0 | `https://viet-bazi.dev/schema/compatibility-input-1.0.json` |
| Compatibility result | 1.0 | `https://viet-bazi.dev/schema/compatibility-result-1.0.json` |

Schema là object export trong package, không yêu cầu tải từ URL:

```ts
import Ajv2020 from 'ajv/dist/2020.js';
import { BIRTH_INPUT_JSON_SCHEMA } from 'viet-bazi-engine';

const validate = new Ajv2020().compile(BIRTH_INPUT_JSON_SCHEMA);
```

Batch schemas dùng `$ref` tới input/result schema. Hãy đăng ký dependencies với Ajv trước khi compile batch output.

Audit report là contract riêng: mỗi rule có mã/version ổn định, category, mô tả và các JSON path input/output. Cách tách này bổ sung traceability mà không làm thay đổi schema lá số `1.7`.

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
