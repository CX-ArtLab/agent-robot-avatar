#!/usr/bin/env bash
# Pack what npm installs into agent-robot-avatar-<version>.zip, unpacking to an
# agent-robot-avatar folder, and attach it to the GitHub Release of that tag.
# Pass --no-upload to only build the zip.
set -euo pipefail
tag="$1"
version="${tag#v}"
work="$(mktemp -d)"
npm pack --ignore-scripts --silent --pack-destination "$work" >/dev/null
tar -xzf "$work/agent-robot-avatar-$version.tgz" -C "$work"
mv "$work/package" "$work/agent-robot-avatar"
zip_file="$PWD/agent-robot-avatar-$version.zip"
rm -f "$zip_file"
(cd "$work" && python3 -m zipfile -c "$zip_file" agent-robot-avatar)
rm -rf "$work"
if [ "${2:-}" != "--no-upload" ]; then gh release upload "$tag" "$zip_file" --clobber; fi
echo "$zip_file"
