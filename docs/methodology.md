# Phương pháp tính và độ chính xác

## Ranh giới lịch pháp

- Trụ Năm đổi tại Lập Xuân, không đổi vào Tết âm lịch.
- Trụ Tháng dùng 12 Tiết (`Jie`), mỗi 30° hoàng kinh từ 315°.
- Trụ Ngày mặc định đổi lúc 23:00 (`early-zi`), có thể chọn 00:00 (`midnight`).
- Trụ Giờ chia 12 thời thần hai giờ, giờ Tý centered quanh nửa đêm.

Mọi quy ước được ghi bằng machine codes trong `metadata.methodology`. `profileCode` hiện là `VIET_BAZI_STANDARD_V1`.

## True solar time

Hiệu chỉnh dùng:

1. Chênh lệch kinh độ so với kinh tuyến chuẩn của UTC offset.
2. Equation of time theo xấp xỉ NOAA.

Kết quả hiệu chỉnh nằm ở `normalized.correctionMinutes` và `normalized.solarTime`. Offset phải là offset lịch sử thực tế tại nơi sinh; engine không tự tải timezone database.

## Đại Vận

Chiều thuận/nghịch dựa trên giới tính và âm/dương Can Năm. Tuổi khởi vận dùng ranh Tiết theo chiều vận và quy ước 3 ngày = 1 năm. Engine sinh 8 vận, mỗi vận 10 năm.

## Ngũ Hành và cách cục

Element balance dùng trọng số cho Can lộ, Chi, Tàng Can và khí mùa. Cách cục, thân vượng/nhược, hỷ/kỵ hành là heuristic có evidence, không phải kết luận tuyệt đối. Version rule xuất hiện trong methodology manifest.

## Thần Sát và compatibility

Catalog hiện có 23 Thần Sát phổ biến. Output chỉ chứa sao kích hoạt, vị trí và căn cứ. Compatibility là heuristic minh bạch 0–100 với factor scores; không phải mô hình dự báo quan hệ.

## Độ chính xác thiên văn

Solar longitude là công thức xấp xỉ. Đối chiếu 36 ranh Tiết các năm 2013, 2020 và 2026 với NAOJ cho sai số lớn nhất 11 phút, threshold test 15 phút.

Đối chiếu độc lập thứ hai dùng NASA/JPL Horizons quantity `31` (`ObsEcLon`) của Mặt Trời nhìn từ địa tâm. Chín checkpoint Lập Xuân theo từng thế kỷ từ 1600 đến 2400 cho sai số tuyệt đối lần lượt là 36,84; 22,98; 12,21; 17,41; 7,40; 5,16; 6,80; 19,43 và 0,08 phút. Ngưỡng regression 40 phút bao phủ toàn miền hỗ trợ, không phải cam kết mọi ngày đều đạt sai số đó. Query profile và hai mẫu 5 phút kẹp 315° được lưu trong fixture để audit.

API calendar có model `apparent` opt-in, dùng Julian centuries từ J2000, geometric mean
longitude/anomaly, equation of center ba harmonic và apparent-longitude correction. Trên
cùng fixtures, sai số lớn nhất quan sát là 13 phút với 24 mốc NAOJ 2013/2020 và 5,92
phút với 9 checkpoint JPL 1600–2400. Model mặc định vẫn là `legacy` trong giai đoạn
pre-1.0 để không âm thầm đổi lá số; hiện opt-in áp dụng cho `solarLongitude()` và
`solarTermBoundary()`, chưa đổi orchestration `calculateBazi()`.

Nếu sinh gần ranh:

```ts
const sensitivity = analyzeBirthTimeSensitivity(input, 120, 5);
```

Hãy coi kết quả là không ổn định nếu `stable === false`, kiểm tra `changedPillars`, xác minh lại giờ/múi giờ và dùng ephemeris chuyên dụng khi cần độ chính xác cao hơn.

## Nguồn đối chiếu

- [NAOJ Reki Yoko 2026](https://eco.mtk.nao.ac.jp/koyomi/yoko/2026/rekiyou262.html.en)
- [NAOJ Reki Yoko 2013](https://eco.mtk.nao.ac.jp/koyomi/yoko/pdf/yoko2013.pdf)
- [NAOJ Reki Yoko 2020](https://eco.mtk.nao.ac.jp/koyomi/yoko/2020/rekiyou202.html.en)
- [NAOJ Japanese Calendar Database](https://eco.mtk.nao.ac.jp/cgi-bin/koyomi/caldb_en.cgi)
- [NASA/JPL Horizons API](https://ssd-api.jpl.nasa.gov/doc/horizons.html)
- [NASA/JPL Horizons observer quantity 31](https://ssd.jpl.nasa.gov/horizons/manual.html#observer-table)
- [NOAA calculation details — equations based on Jean Meeus](https://gml.noaa.gov/grad/solcalc/calcdetails.html)
- [USNO approximate solar coordinates](https://aa.usno.navy.mil/faq/sun_approx)
