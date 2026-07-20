# Hướng dẫn bắt đầu

## Yêu cầu

- Node.js 20+
- npm
- Python 3.10+ nếu dùng Python binding

Project không có runtime dependency JavaScript. AssemblyScript, Vitest, TypeScript và Ajv chỉ dùng khi build/test.

## Cài từ source

```bash
git clone https://github.com/iZenDeveloper/viet-bazi-engine.git
cd viet-bazi-engine
npm ci
npm run build
```

## Input tối thiểu

```ts
import type { BirthInput } from 'viet-bazi-engine';

const input: BirthInput = {
  localDateTime: '2000-01-07T12:00:00',
  timezoneOffsetMinutes: 420,
  asOfYear: 2026,
  gender: 'male'
};
```

`localDateTime` là giờ dân sự tại nơi sinh, không chứa `Z` hoặc offset. Offset tại thời điểm sinh được truyền riêng bằng phút. `asOfYear` bắt buộc để Lưu Niên có thể tái lập mà không đọc đồng hồ hệ thống.

## Tính lá số

```ts
import { calculateBazi } from 'viet-bazi-engine';

const chart = calculateBazi(input);
console.log(chart.pillars.day.stem.code);   // JIA
console.log(chart.pillars.day.branch.code); // ZI
```

## True solar time

```ts
const chart = calculateBazi({
  ...input,
  trueSolarTime: true,
  location: { city: 'Hà Nội' }
});
```

Có thể dùng một trong 10 thành phố offline, alias không dấu, hoặc tọa độ thủ công:

```ts
location: { latitude: 21.0285, longitude: 105.8542, city: 'Địa điểm riêng' }
```

## Quy ước đổi ngày

```ts
dayBoundary: 'early-zi' // mặc định, đổi lúc 23:00
dayBoundary: 'midnight' // đổi lúc 00:00
```

Convention đã chọn xuất hiện trong `input`, `normalized.dayBoundary` và `metadata.methodology`.

## Bước tiếp theo

- Xem toàn bộ hàm tại [API Reference](api-reference.md).
- Tích hợp tiến trình khác qua [CLI](cli.md).
- Đọc [phương pháp và giới hạn](methodology.md) trước khi luận giải kết quả.
