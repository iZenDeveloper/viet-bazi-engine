# AI integration

## Grounded prompt bundle

`createInterpretationPrompt()` tạo messages trung lập nhà cung cấp, không gọi mạng và không gọi model. Bundle luôn gồm:

- `summary`: trụ, Nhật Chủ, Ngũ Hành, Đại Vận hiện hành, Lưu Niên và stable codes.
- `facts`: dữ kiện có `code`, `confidence` và `evidence`.
- `methodology`: profile cùng các quy ước tính.
- `audit`: rule code/version và đường dẫn input/output.

```ts
import { calculateBazi, createInterpretationPrompt } from 'viet-bazi-engine';

const chart = calculateBazi({
  localDateTime: '1990-05-17T14:30:00',
  timezoneOffsetMinutes: 420,
  asOfYear: 2026,
  gender: 'female'
});

const bundle = createInterpretationPrompt(chart, {
  locale: 'vi',
  focus: 'elements'
});

// Truyền bundle.messages cho SDK/model do ứng dụng lựa chọn.
console.log(bundle.messages);
```

Các focus ổn định: `overview`, `elements`, `career`, `relationships`, `timing`. JSON bridge tương ứng:

```ts
createInterpretationPromptFromJson(inputJson, 'en', 'timing');
```

Output tuân theo `interpretation-prompt-bundle-1.0.json`. System message yêu cầu chỉ dùng grounding, dẫn stable codes/evidence, tách dữ kiện khỏi diễn giải, giữ cảnh báo heuristic và không đưa lời khuyên y tế, pháp lý hoặc tài chính.

## Ranh giới trách nhiệm

Engine chịu trách nhiệm calculation và grounding deterministic. Model bên ngoài chỉ chịu trách nhiệm diễn đạt. Ứng dụng nên lưu `engineVersion`, `templateVersion`, model/version và output để audit; không đưa văn bản do model sinh ngược lại làm dữ kiện calculation.

## Interpretation pipeline mẫu

[`examples/interpretation-pipeline.mjs`](../examples/interpretation-pipeline.mjs) minh họa bốn stage:

1. Tính chart deterministic.
2. Tạo grounded prompt.
3. Gọi callback `generate({ messages, metadata })` do ứng dụng cung cấp.
4. Đóng gói chart, SHA-256 calculation, template metadata và generated text trong audit envelope.

```bash
npm run build
node examples/interpretation-pipeline.mjs
```

Ví dụ mặc định dùng `offlineMockProvider`, nên không cần API key hoặc network. Khi thay bằng SDK thật, callback chỉ nên nhận `messages` và metadata bất biến như ví dụ; không truyền quyền sửa chart. Envelope tuân theo [`interpretation-envelope.schema.json`](../examples/interpretation-envelope.schema.json).

```js
const result = await runInterpretationPipeline({
  birth,
  locale: 'en',
  focus: 'timing',
  generate: async ({ messages, metadata }) => ({
    provider: 'your-provider',
    model: 'your-model-version',
    text: await callYourModel(messages, metadata)
  })
});
```
