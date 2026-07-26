# viet-bazi-engine

[![CI](https://github.com/iZenDeveloper/viet-bazi-engine/actions/workflows/ci.yml/badge.svg)](https://github.com/iZenDeveloper/viet-bazi-engine/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/demo-try%20offline-267143)](https://izendeveloper.github.io/viet-bazi-engine/)
[![Release](https://img.shields.io/github/v/release/iZenDeveloper/viet-bazi-engine)](https://github.com/iZenDeveloper/viet-bazi-engine/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Engine Bát Tự/Tứ Trụ dành cho ứng dụng, automation và AI tools. Calculation chạy hoàn
toàn offline, deterministic, không có runtime dependency và trả về JSON có type, stable
machine codes, evidence, metadata phương pháp cùng JSON Schema.

> Trạng thái: `1.0.0-rc.2` — API đang ở giai đoạn pre-1.0. Không dùng kết quả làm cơ sở duy nhất cho quyết định y tế, pháp lý hoặc tài chính.

**[Thử live demo](https://izendeveloper.github.io/viet-bazi-engine/)** ·
**[Bắt đầu trong 5 phút](docs/getting-started.md)** ·
**[Xem API](docs/api-reference.md)** ·
**[Dùng với AI/MCP](docs/ai-integration.md)**

## Vì sao dự án này tồn tại?

Phần lớn ứng dụng Bát Tự cần nhiều hơn một chuỗi “Can Chi”: chúng cần kết quả ổn định để
lưu trữ, schema để validate, quy ước có thể audit và cùng một calculation chạy được trên
web, CLI, Python hoặc agent. `viet-bazi-engine` tách calculation khỏi phần luận giải để:

- cùng input và version luôn tạo cùng output;
- dữ liệu ngày sinh không phải gửi tới server;
- app/LLM có thể dẫn lại stable codes, evidence và methodology thay vì đoán;
- sai số, trường phái và các ca gần ranh được công bố thay vì ẩn đi.

## Phù hợp cho

- Web/mobile app cần tính lá số ngay trên thiết bị.
- Backend hoặc batch pipeline cần structured JSON và stable error codes.
- AI agent cần MCP tools, grounded prompts và audit envelope.
- Nghiên cứu cần fixtures, provenance và lựa chọn quy ước đổi ngày rõ ràng.
- Báo cáo cần SVG accessible, localized facts và methodology Việt/Anh.

## Điểm khác biệt

| Thuộc tính | Hợp đồng của engine |
|---|---|
| Runtime | Offline-first, zero runtime dependency |
| Determinism | Không đọc đồng hồ hệ thống; `asOfYear` luôn là input |
| Transparency | Rule/version trace, warnings, methodology và conformance fixtures |
| Integration | TypeScript, JSON CLI, Python wheel, WASM và MCP stdio |
| AI safety | Stable codes/evidence; generated prose không thể thay đổi calculation |
| Portability | Browser/PWA, Node.js và self-contained Python binding |

## Tính năng chính

- Tứ Trụ Năm–Tháng–Ngày–Giờ theo Lập Xuân và 12 Tiết.
- Hai quy ước đổi ngày: đầu giờ Tý 23:00 và nửa đêm 00:00.
- Tàng Can, Thập Thần, Ngũ Hành, hình–xung–hợp–hại, Đại Vận và Lưu Niên.
- 23 Thần Sát phổ biến và cách cục heuristic có evidence.
- True solar time, catalog thành phố Việt Nam và phân tích độ nhạy giờ sinh.
- Compatibility, SVG accessible với biểu đồ Ngũ Hành/tương phản cao, localization Việt/Anh.
- Batch API, JSON CLI, self-contained Python wheel (cần Node.js 20+) và WASM calendar/full-engine adapter.
- JSON Schema Draft 2020-12, capability discovery và fixtures đối chiếu NAOJ/NASA JPL.
- Audit report machine-readable ánh xạ rule/version với các trường input và output.
- Prompt bundle `vi`/`en` cho LLM, grounding bằng stable codes, evidence và audit rules.
- MCP server offline với 5 structured tools, stdio và không telemetry.
- Interpretation pipeline mẫu tách calculation, grounded prompt và generated prose bằng audit envelope.
- Public API snapshot khóa TypeScript, package, schema, MCP và Python surface trước release candidate.

## Thử trong 30 giây

Live demo chạy calculation ngay trong trình duyệt, không analytics và không gửi ngày sinh
ra ngoài thiết bị. Sau lần mở đầu tiên, service worker cho phép dùng lại khi offline.

**[Mở Viet Bazi Engine Live Demo →](https://izendeveloper.github.io/viet-bazi-engine/)**

Demo có sẵn dữ liệu mẫu; nhấn **Lập lá số** để xem Tứ Trụ, Ngũ Hành, Đại Vận, Lưu Niên,
độ nhạy giờ sinh và audit trace, hoặc tải SVG/JSON chỉ với một lần bấm.

## Bắt đầu từ source

Yêu cầu Node.js 20 trở lên.

```bash
git clone https://github.com/iZenDeveloper/viet-bazi-engine.git
cd viet-bazi-engine
npm install
npm test
```

Release candidate đã có trên npm và PyPI:

```bash
npm install viet-bazi-engine@next
pip install viet-bazi-engine==1.0.0rc2
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
  dayBoundary: 'early-zi',
  solarTermModel: 'ephemeris'
});

console.log(chart.pillars, chart.elements, chart.metadata.methodology);
```

```bash
npm run build
node dist/cli.js --capabilities --compact
node dist/cli.js --compact '{"localDateTime":"1990-05-17T14:30:00","timezoneOffsetMinutes":420,"asOfYear":2026,"gender":"female"}'
```

Chạy demo web/PWA offline sau khi build:

```bash
npm run demo
# Mở http://127.0.0.1:8080/demo/
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
- [Demo web offline](docs/demo.md)
- [Quy trình phát hành](docs/releasing.md)
- [Benchmark batch](docs/benchmarks.md)
- [AI integration](docs/ai-integration.md)
- [MCP server offline](docs/mcp.md)
- [Compatibility và deprecation policy](docs/compatibility-policy.md)
- [Đóng góp](CONTRIBUTING.md)
- [Lịch sử thay đổi](CHANGELOG.md)

## Kiểm thử và giới hạn đã công bố

Suite bao phủ TypeScript, Python wheel cô lập, CLI end-to-end, demo/PWA, parity WASM full-output, JSON Schema và conformance runner. README không ghi tổng test thủ công; CI là nguồn trạng thái chính xác. Bộ fixtures gồm 36 ranh Tiết chính thức NAOJ trong các năm 2013/2020/2026, 9 checkpoint Lập Xuân NASA/JPL từ 1600–2400, 6 ngày Can–Chi và 10 ca chéo múi giờ/ranh đổi ngày. Sai số NAOJ lớn nhất quan sát là 11 phút với ngưỡng 15 phút; đối chiếu JPL nhiều thế kỷ lớn nhất là 36,84 phút với ngưỡng 40 phút.

Demo có Browser E2E trên Chromium, Firefox và WebKit; xem [tài liệu demo](docs/demo.md).

Đo batch calculation bằng workload deterministic:

```bash
npm run build
npm run benchmark
```

Các trường phái Bát Tự có thể khác nhau về đổi ngày, khởi vận, cách cục và Thần Sát. Engine ghi rõ mọi convention trong `metadata.methodology`. Công thức hoàng kinh Mặt Trời và equation of time là xấp xỉ; ca sát ranh cần dùng `analyzeBirthTimeSensitivity()` và đối chiếu ephemeris chuyên dụng.

## Giấy phép

[MIT](LICENSE) © iZenDeveloper.
