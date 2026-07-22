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
PATH="$temp_dir/venv/bin:$node_dir:/usr/bin:/bin" "$temp_dir/venv/bin/python" -c 'from viet_bazi import BirthInput, calculate_bazi, compare_birth_inputs, get_capabilities, verify_bundled_engine; v=verify_bundled_engine(); c=get_capabilities(); a=BirthInput("2000-01-07T12:00:00",420,"male",2026); b=BirthInput("1988-11-02T08:10:00",420,"female",2026); r=calculate_bazi(a); m=compare_birth_inputs(a,b); assert v["verified"] and c["engineVersion"]=="0.22.0"; assert r["pillars"]["day"]["stem"]["code"]=="JIA" and len(m["factors"])==4; print({"wheelStandalone": True, "integrityVerified": True, "compatibility": True, "engineVersion": c["engineVersion"]})'
