#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
output="$(mktemp -d)"
trap 'rm -rf "$output"' EXIT
"${CXX:-g++}" -std=c++11 -Wall -Wextra -Werror -pedantic \
  -fsanitize=address,undefined -fno-omit-frame-pointer \
  -I "$root/lib/AgentRobotEyes/src" \
  "$root/lib/AgentRobotEyes/src/AgentRobotEyes.cpp" "$root/tests/eyes_test.cpp" \
  -o "$output/eyes-test"
"$output/eyes-test"

