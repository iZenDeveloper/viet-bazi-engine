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

Model `legacy` là công thức xấp xỉ đơn giản. Đối chiếu 36 ranh Tiết các năm 2013,
2020 và 2026 với NAOJ cho sai số lớn nhất 11 phút, threshold test 15 phút.

Đối chiếu độc lập thứ hai dùng NASA/JPL Horizons quantity `31` (`ObsEcLon`) của Mặt Trời nhìn từ địa tâm. Chín checkpoint Lập Xuân theo từng thế kỷ từ 1600 đến 2400 cho sai số tuyệt đối lần lượt là 36,84; 22,98; 12,21; 17,41; 7,40; 5,16; 6,80; 19,43 và 0,08 phút. Ngưỡng regression 40 phút bao phủ toàn miền hỗ trợ, không phải cam kết mọi ngày đều đạt sai số đó. Query profile và hai mẫu 5 phút kẹp 315° được lưu trong fixture để audit.

API calendar và `calculateBazi()` mặc định dùng model `ephemeris`. Bảng chứa 6.036 ranh
`Jie` theo phút cho các năm dữ liệu 1599–2101, được sinh ở dev time bằng Astronomy Engine
2.1.19 (`SearchSunLongitude`, apparent geocentric ecliptic longitude, VSOP87-based).
Miền được xác minh và công bố là 1600–2100; hai năm padding chỉ phục vụ tìm ranh lân cận.
Trong miền này, sai số lớn nhất quan sát là 0,99 phút trên 36 mốc NAOJ và 2,31 phút trên
6 checkpoint JPL. Artifact được khóa drift trong test và runtime không thêm dependency.

Ngoài 1600–2100, hoặc khi tìm longitude không thuộc 12 ranh `Jie`, `ephemeris` tự fallback
sang model `apparent`. Model này dựa trên Julian centuries từ J2000, geometric mean
longitude/anomaly, equation of center ba harmonic và apparent-longitude correction; sai
số lớn nhất quan sát là 13 phút với NAOJ và 5,92 phút với JPL 1600–2400. `legacy` chỉ
còn để tái tạo output của release candidate cũ.

Output `normalized.solarTerms` công bố `modelUncertaintyMinutes` (3 phút cho ephemeris
trong miền xác minh, 15 phút cho `apparent`/fallback, 40 phút cho `legacy`) và
`boundaryRisk`. `model-sensitive` nghĩa là thời điểm nằm ngay
trong cửa sổ sai số model; `input-sensitive` nghĩa là ngoài sai số model nhưng vẫn cách
ranh không quá 120 phút; `none` nghĩa là không có rủi ro ranh gần.

Ngoài fixture thiên văn, test differential dùng implementation MIT độc lập
`lunar-typescript` làm oracle thứ hai. Corpus deterministic phủ 14.732 trường hợp từ
1900 đến 2100, gồm mẫu ngày cách đều và đủ 12 thời thần. Hai bên được cấu hình cùng
UTC+8, ranh đổi ngày 00:00 và model `apparent`; CI yêu cầu bốn trụ Năm/Tháng/Ngày/Giờ
khớp hoàn toàn ngoài cửa sổ 40 phút quanh Tiết khí. Trong cửa sổ đó differential test vẫn
khóa trụ Ngày/Giờ, còn trụ Năm/Tháng dùng fixture NAOJ/JPL vì hai model có thể đặt thời
điểm ranh lệch vài phút. Corpus này giúp bắt regression lịch pháp trên diện rộng nhưng
không thay thế NAOJ/JPL, vì hai implementation vẫn có thể chia sẻ cùng quy ước hoặc cùng
sai sót.

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
