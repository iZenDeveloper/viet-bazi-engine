# Compatibility, deprecation và breaking changes

## Phạm vi public contract

Các thành phần sau được xem là public:

- exports từ package root và các TypeScript types tương ứng;
- JSON CLI flags/output, MCP tool names/input schemas và Python functions;
- JSON Schema `$id`, schema artifacts và conformance fixtures đã phát hành;
- stable machine codes cho Can, Chi, Ngũ Hành, Thập Thần, quan hệ, rules, errors và features;
- npm binaries `viet-bazi`, `viet-bazi-mcp`.

File trong `src/`, `scripts/`, `dist/` không được import qua package exports và các chi tiết không nêu trong tài liệu không phải extension point.

## Chính sách pre-1.0

Dự án tuân Semantic Versioning với cách hiểu chặt hơn mức tối thiểu:

- patch: sửa lỗi không đổi contract và cải thiện tài liệu;
- minor: tính năng tương thích ngược, schema mới hoặc deprecation;
- breaking change: chỉ trong minor release pre‑1.0, phải có mục `BREAKING` trong changelog và migration guide.

Không có cam kết giữ bug calculation chỉ để tương thích. Khi sửa accuracy làm output thay đổi, release notes phải ghi miền ảnh hưởng, fixture/nguồn và tác động pillar nếu có.

## Additive và breaking

Additive, không breaking:

- thêm function/export/tool/schema mới;
- thêm optional input property có default giữ hành vi cũ;
- thêm stable code mới vào catalog mở đã được tài liệu hóa;
- thêm trường output chỉ khi schema/version mới hoặc contract hiện tại cho phép.

Breaking:

- xóa/đổi tên export, CLI flag, Python function, MCP tool hoặc stable code;
- đổi nghĩa code/rule hiện có;
- làm required một input từng optional;
- đổi type, xóa field hoặc thu hẹp miền giá trị;
- thay output mà không bump schema version khi schema hiện tại không cho phép;
- tăng Node.js tối thiểu hoặc bỏ binding/runtime.

Nhãn Việt/Anh và prose có thể được chỉnh mà không breaking; consumer phải dựa vào stable codes.

## Deprecation

API bị deprecate phải:

1. Vẫn hoạt động và có test.
2. Có annotation JSDoc/runtime documentation, replacement và release bắt đầu deprecation.
3. Xuất hiện trong changelog và migration guide.
4. Được giữ tối thiểu hai minor releases hoàn chỉnh trước khi xóa.

Ngoại lệ chỉ áp dụng cho lỗ hổng bảo mật, mất dữ liệu hoặc output nguy hiểm; release notes phải giải thích việc rút ngắn.

## JSON Schema và codes

- `$id` là immutable. Thay contract phải tạo `$id`/artifact version mới.
- Schema cũ còn được đóng gói trong ít nhất hai minor releases sau khi schema thay thế xuất hiện.
- Stable code không được tái sử dụng cho nghĩa khác.
- Enum đóng cần schema version mới khi thêm giá trị có thể làm consumer exhaustive bị vỡ.
- Fixtures/conformance version độc lập với engine version và phải tăng khi dataset contract thay đổi.

## Kênh thông báo và migration

Mọi deprecation/breaking change phải xuất hiện trong `CHANGELOG.md`. Migration guide đặt trong `docs/migrations/` theo tên `from-X-to-Y.md`. Pull request phải phân loại thay đổi là `patch`, `additive`, `deprecated` hoặc `breaking` và nêu các binding bị ảnh hưởng.

Policy máy đọc nằm tại [`policy/compatibility-policy.json`](../policy/compatibility-policy.json) và được CI kiểm tra.
