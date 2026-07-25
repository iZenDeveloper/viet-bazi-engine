# Public API audit và RC readiness

Audit này khóa tên và entrypoint public trước `1.0.0`. Baseline máy đọc nằm tại
[`api/public-api.snapshot.json`](../api/public-api.snapshot.json) và được kiểm tra bằng:

```bash
npm run build
npm run test:api
```

## Phạm vi đã audit

- 78 JavaScript runtime exports và 73 TypeScript type declarations từ package root.
- Package exports, hai binaries `viet-bazi`/`viet-bazi-mcp` và các fixture subpaths.
- 17 JSON Schema IDs cùng schema manifest.
- MCP protocol revision và 5 tool names.
- 19 Python exports trong `viet_bazi.__all__`.

Audit chạy trong `npm test`, có mặt trong npm tarball và release preflight. Khi thay đổi
public surface, test sẽ in cả baseline/current và thất bại. Người review phải phân loại
thay đổi theo [compatibility policy](compatibility-policy.md), thêm migration/deprecation
khi cần, rồi mới cập nhật snapshot có chủ đích.

Snapshot kiểm soát **tên và đường dẫn public**, không thay thế kiểm tra cấu trúc. TypeScript
typecheck, JSON Schema tests, conformance fixtures và Python parity tiếp tục khóa shape,
calculation behavior và cross-binding contract.

## Kết quả audit

Không phát hiện tên public bị trùng, entrypoint ngoài ý muốn hoặc drift giữa artifact hiện
tại với baseline. Runtime engine vẫn không có dependency; Playwright và TypeScript chỉ là
dev dependencies.

## Trạng thái release candidate

Các cổng kỹ thuật trong workspace đã có:

- unit/integration, conformance, WASM, CLI, MCP, demo và public API audit;
- Chromium, Firefox và WebKit E2E chạy bằng `npm run test:e2e`;
- isolated Python wheel, npm tarball preflight và version consistency check.

`v1.0.0-rc.2` đã được tạo GitHub prerelease và publish lên npm/PyPI ngày
2026-07-26. CI, release gates và Trusted Publishing bằng OIDC đều hoàn tất trên
candidate này.

Không cập nhật snapshot chỉ để làm test xanh: mọi drift phải được review như một thay đổi
hợp đồng.
