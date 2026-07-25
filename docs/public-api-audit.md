# Public API audit và RC readiness

Audit này khóa tên và entrypoint public trước `1.0.0`. Baseline máy đọc nằm tại
[`api/public-api.snapshot.json`](../api/public-api.snapshot.json) và được kiểm tra bằng:

```bash
npm run build
npm run test:api
```

## Phạm vi đã audit

- 77 JavaScript runtime exports và 71 TypeScript type declarations từ package root.
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

## Release candidate readiness

Các cổng kỹ thuật trong workspace đã có:

- unit/integration, conformance, WASM, CLI, MCP, demo và public API audit;
- Chromium, Firefox và WebKit E2E chạy bằng `npm run test:e2e`;
- isolated Python wheel, npm tarball preflight và version consistency check.

Chưa tạo tag release candidate. Trước `1.0.0-rc.1` còn cần:

1. token/quyền owner để xác minh publish npm và PyPI;
2. quyền GitHub token có scope `workflow` để đưa browser E2E vào hosted CI;
3. chạy `npm run release:check` và browser E2E trên commit định tag.

Không cập nhật snapshot chỉ để làm test xanh: mọi drift phải được review như một thay đổi
hợp đồng.
