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

Các số đo chỉ có ý nghĩa khi so sánh trên cùng phần cứng, phiên bản Node.js và trạng thái tải hệ thống. CI chỉ kiểm tra contract/correctness bằng workload nhỏ; dự án không áp một ngưỡng thời gian cố định để tránh flaky test.
