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

## Capability discovery

```bash
viet-bazi --capabilities --compact
```

Lệnh này không cần input và chỉ có thể dùng thêm `--compact`.
