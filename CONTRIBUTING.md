# Đóng góp

## Thiết lập

```bash
npm ci
npm run typecheck
npm test
PYTHONPATH=bindings/python python3 -m unittest discover -s bindings/python/tests -v
```

## Quy tắc thay đổi

1. Core calculation phải deterministic và không thêm runtime dependency nếu chưa có thảo luận kiến trúc.
2. Rule mới cần source, stable code, evidence trong output và fixture/test.
3. Thay đổi JSON contract phải cập nhật TypeScript type, JSON Schema, README/docs và version.
4. Không dùng nhãn Việt/Anh làm identifier nghiệp vụ; dùng machine code.
5. Ca sát ranh thời gian phải có test ở hai phía của boundary.

## Pull request

PR nên mô tả convention, nguồn tham chiếu, tác động tương thích và lệnh test đã chạy. Không đưa dữ liệu sinh cá nhân thật vào fixture hoặc issue.

## Báo lỗi

Kèm input tối giản đã ẩn danh, engine version, methodology manifest, expected/actual output và nguồn lịch pháp. Với lỗi ranh Tiết, kèm timestamp UTC và ephemeris tham chiếu.
