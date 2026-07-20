# Kiến trúc

```text
BirthInput
  ├─ strict JSON validation
  ├─ civil time → UTC → optional true solar time
  ├─ calendar primitives (TypeScript hoặc WASM)
  ├─ four pillars + hidden stems + Ten Gods
  ├─ relations + elements + luck + annual analysis
  └─ Shen Sha + pattern + methodology metadata
         ↓
      BaziResult 1.7
         ├─ SVG / compatibility / sensitivity / timeline
         ├─ JSON CLI / batch
         └─ Python wrapper
```

## Module boundaries

- `calendar.ts`: parse thời gian, Julian day, solar longitude, Tiết và Can–Chi ngày.
- `engine.ts`: orchestration thuần và dựng `BaziResult`.
- `constants.ts`: Can, Chi, Ngũ Hành và rule tables nền.
- `shen-sha.ts`, `pattern.ts`, `compatibility.ts`: các lớp phân tích tách biệt.
- `json.ts`, `schema.ts`, `cli.ts`: trust boundary và interoperability.
- `wasm.ts`, `bindings/wasm`: ABI calendar v1.
- `sensitivity.ts`: sampling hữu hạn quanh giờ sinh.
- `capabilities.ts`: discovery contract.

## Nguyên tắc

- Không đọc thời gian hệ thống trong calculation; `asOfYear` là input.
- Không network/filesystem trong core engine.
- Không runtime dependency.
- Pure functions và stable codes ưu tiên hơn chuỗi diễn giải.
- TypeScript orchestration là nguồn chân lý; Python wheel bundle artifact đã build kèm SHA-256 manifest thay vì reimplement rule.
- Mỗi thay đổi contract có schema/version và regression test.

## Build artifacts

`npm run build` tạo ESM + declarations trong `dist`, cùng `dist/wasm/calendar.wasm`. npm tarball chỉ chứa `dist`, `fixtures`, `README.md` và package metadata.
