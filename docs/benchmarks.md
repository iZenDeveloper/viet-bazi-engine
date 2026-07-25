# Benchmark

Benchmark batch đo đường xử lý public `calculateBaziBatch()` với input deterministic, gồm cả civil time và true solar time. Workload được chia thành các batch tối đa 1.000 records đúng giới hạn API.

```bash
npm run build
npm run benchmark
```

Mặc định chạy 10.000 lá số. Có thể điều chỉnh:

```bash
node scripts/benchmark-batch.mjs --count 100000 --batch-size 1000 --warmup 500
```

Output là một JSON object machine-readable gồm phiên bản engine/runtime, cấu hình workload, thời gian, throughput, heap đang dùng và checksum kết quả. Benchmark sẽ thất bại nếu bất kỳ record nào không tính được.

## Reference history

Chạy ít nhất ba mẫu trên cùng một máy để tạo candidate record:

```bash
npm run benchmark:reference -- --samples 5 --count 10000 --batch-size 1000 --warmup 250
```

Runner xác minh mọi mẫu có cùng engine, checksum và số record thành công, sau đó xuất
min/median/max cùng Node, OS, kiến trúc, CPU và dung lượng RAM. Khi thêm kết quả vào
[`benchmarks/history.json`](../benchmarks/history.json), điền commit đầy đủ đã benchmark
vào `sourceCommit`; không lưu hostname hoặc identifier cá nhân.

Baseline đầu tiên trên MacBookPro16,1, Intel Core i9-9880H, 16 GiB RAM, macOS Darwin
25.5.0 và Node.js 22.22.1 đạt median 2.735,56 records/giây cho 10.000 records qua năm
mẫu. Con số này là dữ liệu quan sát, không phải performance SLA.

Các số đo chỉ có ý nghĩa khi so sánh trên cùng phần cứng, phiên bản Node.js và trạng thái tải hệ thống. CI chỉ kiểm tra contract/correctness bằng workload nhỏ; dự án không áp một ngưỡng thời gian cố định để tránh flaky test.
