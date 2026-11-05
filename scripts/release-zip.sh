#!/usr/bin/env bash
# Pack what npm installs into boopface-<version>.zip, unpacking to an
# boopface folder, and attach it to the GitHub Release of that tag.
# Pass --no-upload to only build the zip.
set -euo pipefail
tag="$1"
version="${tag#v}"
work="$(mktemp -d)"
npm pack --ignore-scripts --silent --pack-destination "$work" >/dev/null
tar -xzf "$work/boopface-$version.tgz" -C "$work"
mv "$work/package" "$work/boopface"
zip_file="$PWD/boopface-$version.zip"
rm -f "$zip_file"
(cd "$work" && python3 -m zipfile -c "$zip_file" boopface)
rm -rf "$work"
if [ "${2:-}" != "--no-upload" ]; then gh release upload "$tag" "$zip_file" --clobber; fi
echo "$zip_file"
