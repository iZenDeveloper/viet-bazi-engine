# viet-bazi-engine

Engine Bát Tự/Tứ Trụ viết bằng TypeScript, chạy hoàn toàn offline, deterministic và không có runtime dependency. Kết quả là JSON có type, stable machine codes, metadata giải thích và JSON Schema để dùng trực tiếp trong ứng dụng hoặc LLM tools.

> Trạng thái: `0.27.0` — API đang ở giai đoạn pre-1.0. Không dùng kết quả làm cơ sở duy nhất cho quyết định y tế, pháp lý hoặc tài chính.

## Tính năng

- Tứ Trụ Năm–Tháng–Ngày–Giờ theo Lập Xuân và 12 Tiết.
- Hai quy ước đổi ngày: đầu giờ Tý 23:00 và nửa đêm 00:00.
- Tàng Can, Thập Thần, Ngũ Hành, hình–xung–hợp–hại, Đại Vận và Lưu Niên.
- 23 Thần Sát phổ biến và cách cục heuristic có evidence.
- True solar time, catalog thành phố Việt Nam và phân tích độ nhạy giờ sinh.
- Compatibility, SVG accessible với biểu đồ Ngũ Hành/tương phản cao, localization Việt/Anh.
- Batch API, JSON CLI, self-contained Python wheel (cần Node.js 20+) và WASM calendar/full-engine adapter.
- JSON Schema Draft 2020-12, capability discovery và fixtures đối chiếu NAOJ.
- Audit report machine-readable ánh xạ rule/version với các trường input và output.

## Bắt đầu nhanh

Yêu cầu Node.js 20 trở lên.

```bash
git clone https://github.com/iZenDeveloper/viet-bazi-engine.git
cd viet-bazi-engine
npm install
npm test
```

```ts
import { calculateBazi } from 'viet-bazi-engine';

const chart = calculateBazi({
  localDateTime: '1990-05-17T14:30:00',
  timezoneOffsetMinutes: 420,
  asOfYear: 2026,
  gender: 'female',
  trueSolarTime: true,
  location: { city: 'Hà Nội' },
  dayBoundary: 'early-zi'
});

console.log(chart.pillars, chart.elements, chart.metadata.methodology);
```

```bash
npm run build
node dist/cli.js --capabilities --compact
node dist/cli.js --compact '{"localDateTime":"1990-05-17T14:30:00","timezoneOffsetMinutes":420,"asOfYear":2026,"gender":"female"}'
```

## Tài liệu

- [Hướng dẫn bắt đầu](docs/getting-started.md)
- [API TypeScript](docs/api-reference.md)
- [CLI](docs/cli.md)
- [Python và WASM](docs/bindings.md)
- [Phương pháp tính và độ chính xác](docs/methodology.md)
- [JSON Schema và conformance fixtures](docs/schemas-and-conformance.md)
- [Kiến trúc](docs/architecture.md)
- [Lộ trình phát triển](docs/roadmap.md)
- [Đóng góp](CONTRIBUTING.md)
- [Lịch sử thay đổi](CHANGELOG.md)

## Kiểm thử và giới hạn đã công bố

Suite hiện có 71 test TypeScript, 12 test Python, kiểm thử CLI end-to-end, parity WASM full-output và conformance runner. Bộ fixtures gồm 12 ranh Tiết năm 2026 và 6 ngày Can–Chi 1900–2099 từ NAOJ; sai số ranh Tiết quan sát lớn nhất là 11 phút với ngưỡng regression 15 phút.

Các trường phái Bát Tự có thể khác nhau về đổi ngày, khởi vận, cách cục và Thần Sát. Engine ghi rõ mọi convention trong `metadata.methodology`. Công thức hoàng kinh Mặt Trời và equation of time là xấp xỉ; ca sát ranh cần dùng `analyzeBirthTimeSensitivity()` và đối chiếu ephemeris chuyên dụng.

## Giấy phép

[MIT](LICENSE) © iZenDeveloper.
