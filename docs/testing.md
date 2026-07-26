# Quality gauntlet

`test-gauntlet` triển khai sáu lớp kiểm thử độc lập: unit, acceptance, property,
torture, mutation và QA. Mọi gate trả exit code chuẩn; CLI dừng ở lỗi đầu tiên theo
mặc định và có output JSON cho CI.

## Chạy nhanh

```bash
npm run test:gauntlet
```

Profile `quick` chạy build, toàn bộ Vitest, property test 1.000 ca và mutation test.
Property runner dùng seed cố định nên lỗi luôn tái lập được.

```bash
npm run test:gauntlet -- --seed 42 --cases 5000
```

## Chạy đầy đủ

```bash
npm run test:gauntlet -- --profile full
```

Profile `full` chạy release gates, 10.000 property cases, mutation, torture 25.000
records qua hai pass và browser acceptance trên Chromium, Firefox, WebKit. Port E2E
mặc định là `4174` để không xung đột với demo:

```bash
npm run test:gauntlet -- --profile full --torture-count 50000 --e2e-port 4174
```

## CI và machine-readable output

```bash
npm run test:gauntlet -- --profile full --json
npm run test:gauntlet -- --profile full --list --json
```

Report chứa profile, coverage của sáu layer, command từng gate, thời gian, exit code
và stdout/stderr. Dùng `--continue` khi cần thu thập tất cả lỗi thay vì fail-fast.

`npm test` luôn chạy property và mutation gates. Torture/browser acceptance chỉ nằm
trong profile `full` vì chi phí cao hơn.

## Runner độc lập

```bash
npm run test:properties -- --cases 2000 --seed 20813326
npm run test:mutation
npm run test:torture -- --count 25000
```

Mutation runner không sửa worktree. Nó transpile các mutant của calendar module vào
thư mục tạm, chạy oracle độc lập, yêu cầu mọi mutant bị giết rồi xóa thư mục tạm.
Torture runner chạy cùng workload hai lần và yêu cầu số record thành công cùng checksum
hoàn toàn giống nhau; thời gian và memory chỉ được báo cáo, không dùng ngưỡng dễ flaky.
