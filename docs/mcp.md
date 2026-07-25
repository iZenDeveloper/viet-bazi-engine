# MCP server offline

`viet-bazi-mcp` là server stdio theo MCP revision `2025-06-18`. Server không mở cổng mạng, không gọi model và không thêm runtime dependency.

## Chạy từ source

```bash
npm install
npm run build
node /absolute/path/to/dist/mcp-server.js
```

Ví dụ cấu hình client:

```json
{
  "mcpServers": {
    "viet-bazi": {
      "command": "node",
      "args": ["/absolute/path/to/viet-bazi-engine/dist/mcp-server.js"]
    }
  }
}
```

Sau khi package được cài, có thể dùng binary `viet-bazi-mcp`.

## Structured tools

| Tool | Công dụng |
|---|---|
| `get_engine_capabilities` | Versions, feature codes, limits và schema IDs |
| `calculate_bazi` | Tính lá số từ birth input |
| `analyze_birth_time_sensitivity` | Kiểm tra thay đổi trụ trong cửa sổ phút |
| `compare_bazi` | Compatibility factors và evidence |
| `create_grounded_interpretation_prompt` | Messages LLM có grounding và guardrails |

Mỗi tool trả cả `structuredContent` và JSON text tương đương để tương thích client cũ. Lỗi calculation được trả bằng tool result `isError: true` với stable error code; lỗi protocol dùng JSON-RPC error.

Server chỉ nhận từng JSON-RPC message UTF-8 phân cách bằng newline. Stdout chỉ chứa MCP messages; không có telemetry, log hoặc network access.

## Đặc tả tham chiếu

- [MCP lifecycle 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18/basic/lifecycle)
- [MCP stdio transport](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports)
- [MCP tools và structured output](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)
