#!/bin/sh
set -eu
project_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
mkdir -p "$project_dir/dist/wasm"
"$project_dir/node_modules/.bin/asc" "$project_dir/bindings/wasm/calendar.ts" \
  --outFile "$project_dir/dist/wasm/calendar.wasm" --optimize --noAssert
