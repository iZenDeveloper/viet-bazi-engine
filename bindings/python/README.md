# viet-bazi-engine for Python

[![PyPI](https://img.shields.io/pypi/v/viet-bazi-engine)](https://pypi.org/project/viet-bazi-engine/)
[![Python](https://img.shields.io/pypi/pyversions/viet-bazi-engine)](https://pypi.org/project/viet-bazi-engine/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/iZenDeveloper/viet-bazi-engine/blob/main/LICENSE)

Offline, deterministic Bazi/Four Pillars calculations for Python applications,
automation, and data pipelines.

The wheel bundles the matching JavaScript engine snapshot and verifies its integrity
before first use. It has no Python dependencies and does not send birth data over the
network. Node.js 20 or newer is required at runtime.

## Install

```bash
python -m pip install viet-bazi-engine==1.0.0rc4
node --version
```

## Calculate a chart

```python
from viet_bazi import BirthInput, calculate_bazi

birth = BirthInput(
    localDateTime="1990-05-17T14:30:00",
    timezoneOffsetMinutes=420,
    asOfYear=2026,
    gender="female",
    trueSolarTime=True,
    location={"city": "Hà Nội"},
)

chart = calculate_bazi(birth)
print(chart["pillars"])
print(chart["metadata"]["methodology"])
```

## What is included

- Four Pillars, hidden stems, Ten Gods, Five Elements, relations, luck pillars, and
  annual analysis.
- True solar time, Vietnamese city catalog, and birth-time sensitivity analysis.
- Batch calculation with per-record stable error codes.
- Compatibility factors, accessible SVG output, and Vietnamese/English localization.
- Grounded interpretation prompts with facts, evidence, methodology, and audit traces.
- Bundled engine manifest with file size and SHA-256 verification.

Calculation and generated interpretation are deliberately separate. Conventions and
heuristics are exposed in `metadata.methodology`; results should not be the sole basis
for medical, legal, or financial decisions.

## Documentation

- [CRM quick-start](https://github.com/iZenDeveloper/viet-bazi-engine/blob/main/docs/quick-start-practitioner-crm.md)
- [Python API and WASM bindings](https://github.com/iZenDeveloper/viet-bazi-engine/blob/main/docs/bindings.md)
- [Methodology and accuracy](https://github.com/iZenDeveloper/viet-bazi-engine/blob/main/docs/methodology.md)
- [JSON Schema and conformance fixtures](https://github.com/iZenDeveloper/viet-bazi-engine/blob/main/docs/schemas-and-conformance.md)
- [Source and issue tracker](https://github.com/iZenDeveloper/viet-bazi-engine)
