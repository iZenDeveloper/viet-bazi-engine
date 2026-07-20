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
    get_capabilities,
)

birth = BirthInput(
    localDateTime="2000-01-07T12:00:00",
    timezoneOffsetMinutes=420,
    gender="male",
    asOfYear=2026,
)

chart = calculate_bazi(birth)
timeline = calculate_annual_timeline(birth, 2025, 2035)
batch = calculate_bazi_batch([birth])
sensitivity = analyze_birth_time_sensitivity(birth, 120, 5)
capabilities = get_capabilities()
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

const bytes = await (await fetch('/calendar.wasm')).arrayBuffer();
const kernel = await loadWasmCalendar(bytes);
console.log(kernel.solarLongitude(Date.now()));

const engine = await createWasmBaziEngine(bytes);
const chart = engine.calculateBazi(input);
```

Kernel cung cấp `solarLongitude`, `equationOfTime` và `sexagenaryDayIndex`. Full engine dùng WASM cho calendar primitives và dùng chung orchestration/rule tables TypeScript, tránh hai implementation nghiệp vụ khác nhau.

WASM loader không đọc filesystem hay network; caller tự cung cấp `BufferSource` hoặc `WebAssembly.Module`.
