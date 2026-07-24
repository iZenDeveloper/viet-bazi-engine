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

Solar longitude là công thức xấp xỉ. Đối chiếu 36 ranh Tiết các năm 2013, 2020 và 2026 với NAOJ cho sai số lớn nhất 11 phút, threshold test 15 phút. Nếu sinh gần ranh:

```ts
const sensitivity = analyzeBirthTimeSensitivity(input, 120, 5);
```

Hãy coi kết quả là không ổn định nếu `stable === false`, kiểm tra `changedPillars`, xác minh lại giờ/múi giờ và dùng ephemeris chuyên dụng khi cần độ chính xác cao hơn.

## Nguồn đối chiếu

- [NAOJ Reki Yoko 2026](https://eco.mtk.nao.ac.jp/koyomi/yoko/2026/rekiyou262.html.en)
- [NAOJ Reki Yoko 2013](https://eco.mtk.nao.ac.jp/koyomi/yoko/pdf/yoko2013.pdf)
- [NAOJ Reki Yoko 2020](https://eco.mtk.nao.ac.jp/koyomi/yoko/2020/rekiyou202.html.en)
- [NAOJ Japanese Calendar Database](https://eco.mtk.nao.ac.jp/cgi-bin/koyomi/caldb_en.cgi)
