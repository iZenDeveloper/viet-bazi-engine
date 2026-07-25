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
git tag -a v1.0.0-rc.2 -m "Viet Bazi Engine v1.0.0-rc.2"
git push origin v1.0.0-rc.2
```

Nếu tag không khớp version package, workflow dừng trước khi tạo release. Workflow không tự publish lên npm/PyPI; hai registry đó cần token và phê duyệt riêng.

## Publish npm và PyPI bằng Trusted Publishing

Workflow `Publish registries` chỉ chạy qua manual dispatch với một tag đã tồn tại. Cả hai
job dùng GitHub Environment `registry-publish` và OIDC, không đọc token registry dài hạn.
RC được publish lên npm dist-tag `next`; stable release dùng `latest`.

Owner cần cấu hình trước:

- npm Trusted Publisher: owner `iZenDeveloper`, repository `viet-bazi-engine`, workflow
  `publish.yml`, environment `registry-publish`, cho phép `npm publish`;
- PyPI pending publisher: project `viet-bazi-engine`, owner `iZenDeveloper`, repository
  `viet-bazi-engine`, workflow `publish.yml`, environment `registry-publish`;
- GitHub Environment `registry-publish` với required reviewer.

Sau khi ba liên kết trên tồn tại, chạy workflow thủ công với tag `v1.0.0-rc.2`. Workflow
kiểm tra tag khớp package version và chạy lại release gates trước mỗi publish.

## Release candidate

Kiểm tra các gate mà không sửa version, tạo tag hoặc publish:

```bash
npm run release:readiness -- --candidate 1.0.0-rc.2
```

Output JSON phân biệt release preflight, public API snapshot, worktree, hosted browser CI
và registry credentials. `readyForRcTag` chỉ phụ thuộc các gate kỹ thuật cần cho GitHub
Release; `readyForRegistryPublish` yêu cầu thêm xác thực npm/PyPI. Owner vẫn phải phê
duyệt riêng việc tạo tag và publish.

Xem trước 10 file và 19 vị trí version cần đổi mà không sửa workspace:

```bash
npm run release:prepare -- --to 1.0.0-rc.2
```

Sau khi thêm mục `## 1.0.0-rc.2` vào changelog và owner phê duyệt, chạy lại với `--write`.
Công cụ từ chối ghi nếu worktree bẩn, changelog chưa có candidate hoặc số vị trí version
khác baseline. Sau đó bắt buộc chạy `npm run sync:python`, `npm run release:check` và
`npm run test:e2e` trước khi commit/tag.

Release tooling chấp nhận SemVer prerelease như `1.0.0-rc.2`. Python packaging chuẩn hóa
giá trị đó thành PEP 440 `1.0.0rc1`; source version trong npm, Python binding và engine
vẫn phải giống nhau trước khi build.

Tên `viet-bazi-engine` chưa tồn tại trên npm/PyPI tại lần kiểm tra ngày 2026-07-25, nhưng
tính khả dụng có thể thay đổi. Luôn kiểm tra lại ngay trước first publish.
