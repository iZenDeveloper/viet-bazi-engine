# Phát hành

Workflow `Release` chỉ chạy khi push tag dạng `v*`. Nó chạy lại toàn bộ TypeScript/Python/WASM/demo/conformance tests, xác minh tag khớp `package.json`, sau đó tạo:

- npm tarball;
- Python wheel;
- `SHA256SUMS`;
- GitHub Release với release notes tự sinh.

Quy trình phát hành:

```bash
npm test
npm run test:python-wheel
npm run release:check
git status --short
git tag -a v0.53.0 -m "Viet Bazi Engine v0.53.0"
git push origin v0.53.0
```

Nếu tag không khớp version package, workflow dừng trước khi tạo release. Workflow không tự publish lên npm/PyPI; hai registry đó cần token và phê duyệt riêng.

## Release candidate

Kiểm tra các gate mà không sửa version, tạo tag hoặc publish:

```bash
npm run release:readiness -- --candidate 1.0.0-rc.1
```

Output JSON phân biệt release preflight, public API snapshot, worktree, hosted browser CI
và registry credentials. `readyForRcTag` chỉ là gate kỹ thuật; owner vẫn phải phê duyệt
việc tạo tag và publish.

Release tooling chấp nhận SemVer prerelease như `1.0.0-rc.1`. Python packaging chuẩn hóa
giá trị đó thành PEP 440 `1.0.0rc1`; source version trong npm, Python binding và engine
vẫn phải giống nhau trước khi build.

Tên `viet-bazi-engine` chưa tồn tại trên npm/PyPI tại lần kiểm tra ngày 2026-07-25, nhưng
tính khả dụng có thể thay đổi. Luôn kiểm tra lại ngay trước first publish.
