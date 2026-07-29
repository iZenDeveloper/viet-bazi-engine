# Quick-start: AI/MCP agent

Dành cho assistant hoặc agent cần dữ kiện Bát Tự có grounding. Engine chỉ calculation
offline; model bên ngoài chỉ đảm nhiệm diễn đạt.

## 1. Kết nối MCP server

Thêm server sau vào cấu hình MCP client:

```json
{
  "mcpServers": {
    "viet-bazi": {
      "command": "npx",
      "args": [
        "--yes",
        "--package",
        "viet-bazi-engine@next",
        "viet-bazi-mcp"
      ]
    }
  }
}
```

Khởi động lại client, sau đó gọi `get_engine_capabilities` trước để khám phá version,
feature codes và schema IDs. Server cung cấp năm tool:

- `calculate_bazi`
- `analyze_birth_time_sensitivity`
- `compare_bazi`
- `create_grounded_interpretation_prompt`
- `get_engine_capabilities`

MCP server dùng stdio, không mở cổng mạng, không telemetry và không tự gọi model.

## 2. Tạo grounded prompt trong code

```bash
npm install viet-bazi-engine@next
```

```js
import {
  calculateBazi,
  createInterpretationPrompt
} from 'viet-bazi-engine';

const chart = calculateBazi({
  localDateTime: '1990-05-17T14:30:00',
  timezoneOffsetMinutes: 420,
  asOfYear: 2026,
  gender: 'female'
});

const bundle = createInterpretationPrompt(chart, {
  locale: 'vi',
  focus: 'timing'
});

// Chỉ gửi messages tới provider; giữ grounding để audit response.
const requestForModel = bundle.messages;
const auditContext = bundle.grounding.audit;

console.log(requestForModel, auditContext);
```

Các focus ổn định là `overview`, `elements`, `career`, `relationships` và `timing`.
Bundle giữ summary, facts, methodology và audit trace cạnh messages.

## 3. Giữ ranh giới an toàn

Không đưa văn bản model sinh ngược lại vào calculation. Khi cần audit, lưu
`engineVersion`, `templateVersion`, provider/model version và output cạnh nhau. Không
dùng kết quả làm cơ sở duy nhất cho quyết định y tế, pháp lý hoặc tài chính.

## Tiếp theo

- [MCP server](https://github.com/iZenDeveloper/viet-bazi-engine/blob/main/docs/mcp.md)
- [AI integration](https://github.com/iZenDeveloper/viet-bazi-engine/blob/main/docs/ai-integration.md)
- [Interpretation pipeline mẫu](https://github.com/iZenDeveloper/viet-bazi-engine/blob/main/examples/interpretation-pipeline.mjs)
