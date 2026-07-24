#!/bin/sh
set -eu
root_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
node_bin=$(command -v node)
node_dir=$(dirname "$node_bin")
temp_dir=$(mktemp -d)
trap 'rm -rf "$temp_dir"' EXIT
python3 -m pip wheel "$root_dir/bindings/python" --no-deps --wheel-dir "$temp_dir/wheels" >/dev/null
python3 -m venv "$temp_dir/venv"
"$temp_dir/venv/bin/python" -m pip install --no-deps "$temp_dir"/wheels/*.whl >/dev/null
cd "$temp_dir"
PATH="$temp_dir/venv/bin:$node_dir:/usr/bin:/bin" "$temp_dir/venv/bin/python" -c 'from viet_bazi import BirthInput, calculate_annual_timeline, calculate_bazi, compare_birth_inputs, create_bazi_audit_report, get_capabilities, localize_annual_timeline, localize_bazi_audit_report, localize_birth_time_sensitivity, localize_chart_summary, localize_compatibility, localize_methodology, render_bazi_svg, verify_bundled_engine; v=verify_bundled_engine(); c=get_capabilities(); a=BirthInput("2000-01-07T12:00:00",420,"male",2026); b=BirthInput("1988-11-02T08:10:00",420,"female",2026); r=calculate_bazi(a); cs=localize_chart_summary(a,locale="en"); m=compare_birth_inputs(a,b); ml=localize_compatibility(a,b,locale="en"); s=render_bazi_svg(a,locale="en",high_contrast=True); t=create_bazi_audit_report(a); tl=localize_bazi_audit_report(a,locale="en"); y=calculate_annual_timeline(a,2025,2027); yl=localize_annual_timeline(a,2025,2027,locale="en"); sl=localize_birth_time_sensitivity(a,15,5,locale="en"); l=localize_methodology(a,locale="en"); assert v["verified"] and c["engineVersion"]=="0.43.0"; assert r["pillars"]["day"]["stem"]["code"]=="JIA" and cs["locale"]=="en" and cs["pillars"]["day"]["stemCode"]=="JIA" and len(cs["elements"])==5 and len(m["factors"])==4 and ml["locale"]=="en" and "element-balance" in s and "data-contrast=\"high\"" in s and len(t["rules"])>=10 and tl["locale"]=="en" and all("text" in x for x in tl["rules"]) and len(y)==3 and yl["locale"]=="en" and len(yl["entries"])==3 and sl["locale"]=="en" and sl["summary"] and len(l["items"])==13; print({"wheelStandalone": True, "integrityVerified": True, "localizedChartSummary": True, "compatibility": True, "localizedCompatibility": True, "svgEnhanced": True, "audit": True, "localizedAudit": True, "timeline": True, "localizedTimeline": True, "localizedSensitivity": True, "localizedMethodology": True, "engineVersion": c["engineVersion"]})'
