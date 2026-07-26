import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const calendarSource = await readFile(new URL("../src/calendar.ts", import.meta.url), "utf8");
const ephemerisSource = await readFile(new URL("../src/jie-ephemeris.generated.ts", import.meta.url), "utf8");
const fixtures = [
  [1600, 315, "1600-02-04T10:31:09.442Z"],
  [2026, 315, "2026-02-03T20:02:00Z"],
  [2100, 315, "2100-02-03T19:02:09.622Z"],
];
const mutants = [
  {
    name: "default-model-apparent",
    from: "solarTermBoundary(year:number,targetLongitude:number,model:SolarLongitudeModel='ephemeris')",
    to: "solarTermBoundary(year:number,targetLongitude:number,model:SolarLongitudeModel='apparent')",
  },
  {
    name: "exclude-verified-start-year",
    from: "year>=JIE_EPHEMERIS_VERIFIED_START_YEAR&&year<=JIE_EPHEMERIS_VERIFIED_END_YEAR) {\n    const slot=",
    to: "year>JIE_EPHEMERIS_VERIFIED_START_YEAR&&year<=JIE_EPHEMERIS_VERIFIED_END_YEAR) {\n    const slot=",
  },
  {
    name: "shift-month-index",
    from: "return mod(slot-1,12);",
    to: "return mod(slot+1,12);",
  },
  {
    name: "fallback-to-legacy",
    from: "const effectiveModel=model==='ephemeris'?'apparent':model;",
    to: "const effectiveModel=model==='ephemeris'?'legacy':model;",
  },
  {
    name: "corrupt-table-stride",
    from: "const index=(year-JIE_EPHEMERIS_DATA_START_YEAR)*12+slot;",
    to: "const index=(year-JIE_EPHEMERIS_DATA_START_YEAR)*11+slot;",
  },
];

function transpile(source) {
  return ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ES2022,
    },
  }).outputText;
}

async function writeCandidate(directory, source) {
  await writeFile(join(directory, "package.json"), '{"type":"module"}\n');
  await writeFile(join(directory, "jie-ephemeris.generated.js"), transpile(ephemerisSource));
  await writeFile(join(directory, "calendar.js"), transpile(source));
}

async function verifyCalendar(module) {
  for (const [year, longitude, expected] of fixtures) {
    const delta = Math.abs(module.solarTermBoundary(year, longitude).getTime() - Date.parse(expected));
    assert.ok(delta <= 3 * 60000, `${year} boundary drifted by ${delta / 60000} minutes`);
  }
  for (const year of [1600, 2100]) {
    assert.equal(
      module.solarTermBoundary(year, 315).getTime(),
      module.jieEphemerisBoundary(year, 1).getTime(),
    );
  }
  assert.equal(
    module.solarTermBoundary(2200, 315, "ephemeris").getTime(),
    module.solarTermBoundary(2200, 315, "apparent").getTime(),
  );
  const lichun = module.solarTermBoundary(2026, 315, "ephemeris");
  assert.equal(module.solarMonthIndex(new Date(lichun.getTime() - 2 * 60000), "ephemeris"), 11);
  assert.equal(module.solarMonthIndex(new Date(lichun.getTime() + 2 * 60000), "ephemeris"), 0);
}

const directory = await mkdtemp(join(tmpdir(), "viet-bazi-mutation-"));
try {
  await writeCandidate(directory, calendarSource);
  await verifyCalendar(await import(`${pathToFileURL(join(directory, "calendar.js")).href}?baseline`));

  const killed = [];
  const survived = [];
  for (const mutant of mutants) {
    const occurrences = calendarSource.split(mutant.from).length - 1;
    assert.equal(occurrences, 1, `Mutation target ${mutant.name} must occur exactly once`);
    await writeCandidate(directory, calendarSource.replace(mutant.from, mutant.to));
    try {
      await verifyCalendar(await import(`${pathToFileURL(join(directory, "calendar.js")).href}?mutant=${mutant.name}`));
      survived.push(mutant.name);
    } catch {
      killed.push(mutant.name);
    }
  }
  assert.deepEqual(survived, [], `Surviving mutants: ${survived.join(", ")}`);
  console.log(JSON.stringify({
    layer: "mutation",
    total: mutants.length,
    killed: killed.length,
    survived: survived.length,
    score: 100,
    mutants: killed,
  }));
} finally {
  await rm(directory, { recursive: true, force: true });
}
