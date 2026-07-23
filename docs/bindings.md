# Python và WASM bindings

## Python

Python package ở `bindings/python` không có Python dependency. Wheel bundle snapshot engine JavaScript đã build để chạy mà không cần cài npm package riêng; máy chạy vẫn cần Node.js 20+. TypeScript tiếp tục là nguồn chân lý duy nhất và bundle được tạo bằng `npm run sync:python`.

```bash
npm run build
python3 -m pip install ./bindings/python
```

```python
from viet_bazi import (
    BirthInput,
    analyze_birth_time_sensitivity,
    calculate_annual_timeline,
    calculate_bazi,
    calculate_bazi_batch,
    compare_birth_inputs,
    create_bazi_audit_report,
    localize_annual_timeline,
    localize_bazi_audit_report,
    localize_facts,
    localize_compatibility,
    localize_methodology,
    get_capabilities,
    render_bazi_svg,
)

birth = BirthInput(
    localDateTime="2000-01-07T12:00:00",
    timezoneOffsetMinutes=420,
    gender="male",
    asOfYear=2026,
)

chart = calculate_bazi(birth)
timeline = calculate_annual_timeline(birth, 2025, 2035)
timeline_en = localize_annual_timeline(birth, 2025, 2035, locale="en")
batch = calculate_bazi_batch([birth])
compatibility = compare_birth_inputs(birth, another_birth)
compatibility_en = localize_compatibility(birth, another_birth, locale="en")
audit = create_bazi_audit_report(birth)
audit_en = localize_bazi_audit_report(birth, locale="en")
facts_en = localize_facts(birth, locale="en")
methodology_en = localize_methodology(birth, locale="en")
sensitivity = analyze_birth_time_sensitivity(birth, 120, 5)
capabilities = get_capabilities()
svg = render_bazi_svg(birth, locale="en", title="My chart", width=900, show_hidden_stems=True, show_element_balance=True, high_contrast=True)
```

Wrapper ưu tiên engine đi kèm wheel để version luôn khớp Python package, xác minh size và SHA-256 của toàn bộ bundle trước lần chạy đầu tiên, sau đó mới fallback về binary `viet-bazi` trong PATH hoặc `dist/cli.js` của workspace. Lỗi integrity/CLI được chuyển thành `VietBaziError`.

```python
from viet_bazi import verify_bundled_engine
print(verify_bundled_engine())
```

Kiểm tra wheel trong virtualenv tách biệt:

```bash
npm run test:python-wheel
```

## WASM calendar kernel

Build tạo `dist/wasm/calendar.wasm` với ABI v1:

```ts
import { createWasmBaziEngine, loadWasmCalendar } from 'viet-bazi-engine';

const response = await fetch('/calendar.wasm');
const kernel = await loadWasmCalendar(response);
console.log(kernel.solarLongitude(Date.now()));

const engine = await createWasmBaziEngine(await fetch('/calendar.wasm'));
const chart = engine.calculateBazi(input);
```

Kernel cung cấp `solarLongitude`, `equationOfTime` và `sexagenaryDayIndex`. `createWasmBaziEngine()` dùng các primitives đó cho full calculation và dùng chung orchestration/rule tables TypeScript, tránh hai implementation nghiệp vụ khác nhau. CI kiểm tra full-output parity trên các fixture chuẩn.

WASM loader không tự đọc filesystem hay network; caller cung cấp `Response`, `BufferSource` hoặc `WebAssembly.Module`. Với `Response`, loader ưu tiên streaming compilation và tự fallback sang buffer nếu host/CDN chưa trả MIME `application/wasm`.
