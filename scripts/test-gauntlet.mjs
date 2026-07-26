import { spawn } from "node:child_process";
import { performance } from "node:perf_hooks";

const ALL_LAYERS = ["unit", "acceptance", "property", "torture", "mutation", "qa"];

function valueFlag(name, fallback) {
  const index = process.argv.indexOf(name);
  return index < 0 ? fallback : process.argv[index + 1];
}

function integerFlag(name, fallback, minimum, maximum) {
  const raw = valueFlag(name, String(fallback));
  const value = Number(raw);
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new RangeError(`${name} must be an integer in ${minimum}..${maximum}`);
  }
  return value;
}

const profile = valueFlag("--profile", "quick");
const json = process.argv.includes("--json");
const list = process.argv.includes("--list");
const continueOnFailure = process.argv.includes("--continue");
const seed = integerFlag("--seed", 20_813_326, 0, 0xffffffff);
const propertyCases = integerFlag("--cases", profile === "full" ? 10_000 : 1_000, 1, 100_000);
const tortureCount = integerFlag("--torture-count", 25_000, 1, 1_000_000);
const e2ePort = integerFlag("--e2e-port", 4174, 1, 65535);

const gate = (id, layers, command, args, env = {}) => ({ id, layers, command, args, env });
const shared = [
  gate("build", ["qa"], "npm", ["run", "build"]),
  gate("unit", ["unit"], "npm", ["run", "test:unit"]),
  gate("property", ["property"], process.execPath, ["scripts/test-properties.mjs", "--cases", String(propertyCases), "--seed", String(seed)]),
  gate("mutation", ["mutation"], process.execPath, ["scripts/test-mutations.mjs"]),
];
const profiles = {
  quick: shared,
  full: [
    gate("release", ["unit", "qa"], "npm", ["run", "release:check"]),
    gate("property", ["property"], process.execPath, ["scripts/test-properties.mjs", "--cases", String(propertyCases), "--seed", String(seed)]),
    gate("mutation", ["mutation"], process.execPath, ["scripts/test-mutations.mjs"]),
    gate("torture", ["torture"], process.execPath, ["scripts/test-torture.mjs", "--count", String(tortureCount)]),
    gate("browser-acceptance", ["acceptance"], "npm", ["run", "test:e2e"], { VIET_BAZI_E2E_PORT: String(e2ePort) }),
  ],
};

if (!(profile in profiles)) {
  throw new RangeError(`Unknown profile "${profile}". Expected quick or full.`);
}

const selected = profiles[profile];
const plan = {
  tool: "viet-bazi-test-gauntlet",
  version: 1,
  profile,
  failFast: !continueOnFailure,
  layers: ALL_LAYERS.map(name => ({
    name,
    covered: selected.some(item => item.layers.includes(name)),
  })),
  gates: selected.map(item => ({
    id: item.id,
    layers: item.layers,
    command: [item.command, ...item.args].join(" "),
  })),
};

if (list) {
  console.log(json ? JSON.stringify(plan) : JSON.stringify(plan, null, 2));
  process.exit(0);
}

function execute(item) {
  return new Promise(resolve => {
    const startedAt = performance.now();
    const child = spawn(item.command, item.args, {
      cwd: process.cwd(),
      env: { ...process.env, ...item.env },
      stdio: json ? ["ignore", "pipe", "pipe"] : "inherit",
    });
    let stdout = "";
    let stderr = "";
    if (json) {
      child.stdout.setEncoding("utf8");
      child.stderr.setEncoding("utf8");
      child.stdout.on("data", chunk => { stdout += chunk; });
      child.stderr.on("data", chunk => { stderr += chunk; });
    }
    child.once("error", error => resolve({
      status: "failed",
      exitCode: null,
      error: error.message,
      durationMs: Number((performance.now() - startedAt).toFixed(2)),
    }));
    child.once("exit", (code, signal) => resolve({
      status: code === 0 ? "passed" : "failed",
      exitCode: code,
      signal,
      durationMs: Number((performance.now() - startedAt).toFixed(2)),
      ...(json ? { stdout: stdout.trim(), stderr: stderr.trim() } : {}),
    }));
  });
}

const startedAt = performance.now();
const results = [];
for (const item of selected) {
  if (!json) console.log(`\n[gauntlet] ${item.id} (${item.layers.join(", ")})`);
  const result = await execute(item);
  results.push({ id: item.id, layers: item.layers, ...result });
  if (result.status === "failed" && !continueOnFailure) break;
}

const passed = results.filter(result => result.status === "passed").length;
const report = {
  ...plan,
  status: passed === selected.length ? "passed" : "failed",
  summary: {
    planned: selected.length,
    executed: results.length,
    passed,
    failed: results.filter(result => result.status === "failed").length,
    durationMs: Number((performance.now() - startedAt).toFixed(2)),
  },
  results,
};
console.log(json ? JSON.stringify(report) : `\n${JSON.stringify(report.summary)}`);
if (report.status !== "passed") process.exitCode = 1;
