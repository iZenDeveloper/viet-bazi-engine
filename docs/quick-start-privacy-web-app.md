# Quick-start: Web app privacy-first

Dành cho web app cần tính lá số và export dữ liệu ngay trong browser. Engine không có
network call hoặc telemetry; ngày sinh chỉ rời thiết bị nếu chính application gửi đi.

## 1. Cài package

```bash
npm install viet-bazi-engine
```

Package là ESM, có TypeScript declarations và không có runtime dependency.

## 2. Tính và hiển thị tại thiết bị

```js
import {
  calculateBazi,
  localizeChartSummary,
  renderBaziSvg
} from 'viet-bazi-engine';

const input = {
  localDateTime: '1990-05-17T14:30:00',
  timezoneOffsetMinutes: 420,
  asOfYear: 2026,
  gender: 'female',
  trueSolarTime: true,
  location: { city: 'Hà Nội' }
};

const chart = calculateBazi(input);
const summary = localizeChartSummary(chart, 'vi');
const svg = renderBaziSvg(chart, {
  locale: 'vi',
  title: 'Lá số Bát Tự',
  width: 900
});

document.querySelector('#chart').innerHTML = svg;
document.querySelector('#day-master').textContent = summary.dayMaster.text;
```

`localDateTime` là giờ dân sự tại nơi sinh, không có `Z` hoặc UTC offset.
`timezoneOffsetMinutes` là offset tại thời điểm sinh. `asOfYear` là input bắt buộc để
kết quả Lưu Niên có thể tái lập.

## 3. Export mà không cần backend

```js
const file = new Blob([JSON.stringify(chart, null, 2)], {
  type: 'application/json'
});
const link = document.createElement('a');
link.href = URL.createObjectURL(file);
link.download = 'bazi-chart.json';
link.click();
URL.revokeObjectURL(link.href);
```

Không thêm analytics chứa form values, không log birth input vào error service và không
lưu localStorage mặc định. Nếu sản phẩm cần lưu hồ sơ, xin consent rõ ràng và mã hóa dữ
liệu nhạy cảm theo threat model của ứng dụng.

## Tiếp theo

- [Demo offline](https://izendeveloper.github.io/viet-bazi-engine/)
- [Phương pháp và giới hạn](https://github.com/iZenDeveloper/viet-bazi-engine/blob/main/docs/methodology.md)
- [JSON Schema và conformance](https://github.com/iZenDeveloper/viet-bazi-engine/blob/main/docs/schemas-and-conformance.md)
