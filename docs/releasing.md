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
git tag -a v1.0.0-rc.3 -m "Viet Bazi Engine v1.0.0-rc.3"
git push origin v1.0.0-rc.3
```

Nếu tag không khớp version package, workflow dừng trước khi tạo release. Workflow không tự publish lên npm/PyPI; hai registry đó cần token và phê duyệt riêng.

## Publish npm và PyPI bằng Trusted Publishing

Workflow `Publish registries` chỉ chạy qua manual dispatch với một tag đã tồn tại. Cả hai
job dùng GitHub Environment `registry-publish` và OIDC, không đọc token registry dài hạn.
RC được publish lên npm dist-tag `next`; stable release dùng `latest`. Nếu một version npm
đã tồn tại, job npm bỏ qua version đó để workflow có thể được chạy lại an toàn cho PyPI.
Sau mỗi lần publish, kiểm tra dist-tag:

```bash
npm dist-tag ls viet-bazi-engine
```

Với package mới chưa có stable version, npm có thể giữ `latest` trên version đầu tiên dù
lệnh publish dùng `--tag next`; registry không cho xóa `latest` khi đó. README và lệnh cài
đặt phải tiếp tục chỉ rõ `@next`. Khi publish `1.0.0`, workflow sẽ chuyển `latest` sang
stable version và giữ `next` làm kênh prerelease.

Owner cần cấu hình trước:

- npm Trusted Publisher: owner `iZenDeveloper`, repository `viet-bazi-engine`, workflow
  `publish.yml`, environment `registry-publish`, cho phép `npm publish`;
- PyPI Trusted Publisher: project `viet-bazi-engine`, owner `iZenDeveloper`, repository
  `viet-bazi-engine`, workflow `publish.yml`, environment `registry-publish`;
- GitHub Environment `registry-publish` với required reviewer.

Sau khi ba liên kết trên tồn tại, chạy workflow thủ công với tag `v1.0.0-rc.3`. Workflow
kiểm tra tag khớp package version và chạy lại release gates trước mỗi publish.

## Release candidate

Kiểm tra các gate mà không sửa version, tạo tag hoặc publish:

```bash
npm run release:readiness -- --candidate 1.0.0-rc.3
```

Output JSON phân biệt release preflight, public API snapshot, worktree, hosted browser CI
và registry credentials. `readyForRcTag` chỉ phụ thuộc các gate kỹ thuật cần cho GitHub
Release; `readyForRegistryPublish` yêu cầu thêm xác thực npm/PyPI. Owner vẫn phải phê
duyệt riêng việc tạo tag và publish.

Xem trước 10 file và 19 vị trí version cần đổi mà không sửa workspace:

```bash
npm run release:prepare -- --to 1.0.0-rc.3
```

Sau khi thêm mục `## 1.0.0-rc.3` vào changelog và owner phê duyệt, chạy lại với `--write`.
Công cụ từ chối ghi nếu worktree bẩn, changelog chưa có candidate hoặc số vị trí version
khác baseline. Sau đó bắt buộc chạy `npm run sync:python`, `npm run release:check` và
`npm run test:e2e` trước khi commit/tag.

Release tooling chấp nhận SemVer prerelease như `1.0.0-rc.3`. Python packaging chuẩn hóa
giá trị đó thành PEP 440 `1.0.0rc2`; source version trong npm, Python binding và engine
vẫn phải giống nhau trước khi build.

Release candidate đầu tiên của `viet-bazi-engine` đã được publish lên npm và PyPI ngày
2026-07-26. PyPI pending publisher đã tự chuyển thành trusted publisher sau lần upload
OIDC thành công.

## Promote lên 1.0.0

Chỉ chuẩn bị `1.0.0` khi:

1. RC đã có thời gian soak và không còn regression calculation, schema hoặc binding đã biết;
2. public API snapshot được review lần cuối, không còn breaking change chưa ghi tài liệu;
3. CI, `npm run release:check` và Playwright E2E đều xanh trên commit định tag;
4. npm/PyPI install smoke test chạy từ package đã publish, không dựa vào workspace;
5. changelog có mục `## 1.0.0` và owner phê duyệt artifact, tag và registry publish.

Sau khi publish stable, xác nhận npm `latest` trỏ đúng `1.0.0`, `next` không làm thay đổi
cài đặt mặc định, PyPI trả về `1.0.0`, và GitHub Release không được đánh dấu prerelease.
