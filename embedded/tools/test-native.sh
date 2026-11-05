#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
output="$(mktemp -d)"
trap 'rm -rf "$output"' EXIT
"${CXX:-g++}" -std=c++11 -Wall -Wextra -Werror -pedantic \
  -fsanitize=address,undefined -fno-omit-frame-pointer \
  -I "$root/lib/BoopFace/src" \
  "$root/lib/BoopFace/src/BoopFace.cpp" "$root/tests/eyes_test.cpp" \
  -o "$output/eyes-test"
"$output/eyes-test"

