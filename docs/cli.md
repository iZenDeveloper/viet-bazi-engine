# JSON CLI

CLI nhận JSON, ghi duy nhất JSON ra stdout và ghi lỗi ra stderr. Exit code `0` là thành công, `1` là lỗi xử lý, `2` là thiếu input/usage.

Sau khi build:

```bash
node dist/cli.js [options] JSON
```

Khi package được cài như dependency, binary là `viet-bazi`.

## Một lá số

```bash
viet-bazi --compact '{"localDateTime":"2000-01-07T12:00:00","timezoneOffsetMinutes":420,"asOfYear":2026,"gender":"male"}'
```

`--compact` bỏ indentation. `--year YYYY` chỉ dành cho overload legacy khi JSON chưa có `asOfYear`.

## Timeline

```bash
viet-bazi --timeline 2025:2035 --compact '{...}'
```

## Batch

```bash
viet-bazi --batch --compact '[{...},{...}]'
```

Batch không dùng cùng `--year` hoặc `--timeline`, giới hạn 1.000 records.

## Stdin

Nên dùng stdin cho payload lớn để tránh giới hạn argv:

```bash
printf '%s' '[{...}]' | viet-bazi --stdin --batch --compact
```

Stdin giới hạn 10 MiB. Không được truyền thêm JSON argument khi dùng `--stdin`.

## Sensitivity

```bash
printf '%s' '{...}' | viet-bazi --stdin --sensitivity 120:5 --compact
```

Định dạng là `WINDOW_MINUTES[:STEP_MINUTES]`; step mặc định 5. Không dùng cùng batch hoặc timeline.

## Compatibility

```bash
printf '%s' '[{...},{...}]' | viet-bazi --stdin --compatibility --compact
```

Input phải là array đúng hai `BirthInput`. Mode này không dùng cùng batch, sensitivity, timeline hoặc legacy year.

## SVG export

```bash
printf '%s' '{...}' | viet-bazi --stdin --svg --locale en --title 'My chart' --width 900 --no-hidden-stems --high-contrast > chart.svg
```

SVG mode ghi raw SVG thay vì JSON. Locale là `vi` hoặc `en`; width được core renderer clamp trong `480..1600`. Dùng `--no-element-balance` để ẩn thanh tỷ lệ hoặc `--high-contrast` cho palette tương phản cao. Mode này nhận một birth input và không dùng cùng các calculation mode khác.

## Audit trace

```bash
printf '%s' '{...}' | viet-bazi --stdin --audit --compact
```

Trả JSON audit report chứa rule code/version và đường dẫn input/output đã tham gia tính toán. Có thể dùng `--year` cho input legacy; không dùng cùng batch, compatibility, SVG, sensitivity hoặc timeline.

## Localized facts

```bash
printf '%s' '{...}' | viet-bazi --stdin --facts --locale en --compact
```

Trả facts/warnings đã bản địa hóa nhưng giữ nguyên `code` và `evidence` để downstream không phụ thuộc ngôn ngữ.

## Capability discovery

```bash
viet-bazi --capabilities --compact
```

Lệnh này không cần input và chỉ có thể dùng thêm `--compact`.
