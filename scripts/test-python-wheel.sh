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
PATH="$temp_dir/venv/bin:$node_dir:/usr/bin:/bin" "$temp_dir/venv/bin/python" -c 'from viet_bazi import BirthInput, calculate_bazi, get_capabilities; c=get_capabilities(); r=calculate_bazi(BirthInput("2000-01-07T12:00:00",420,"male",2026)); assert c["engineVersion"]=="0.20.0"; assert r["pillars"]["day"]["stem"]["code"]=="JIA"; print({"wheelStandalone": True, "engineVersion": c["engineVersion"]})'
