#!/usr/bin/env bash
# Scaffold a new Central Square AI video from the branded HyperFrames starter.
#   scripts/new-video.sh <slug> [landscape|portrait|square]
# Creates projects/<slug>/ with brand fonts, the end-card scene, and a BRIEF.md to fill in first.
set -euo pipefail
cd "$(dirname "$0")/.."
slug="${1:?usage: scripts/new-video.sh <slug> [landscape|portrait|square]}"
shape="${2:-landscape}"
case "$shape" in
  landscape) W=1920; H=1080 ;;
  portrait)  W=1080; H=1920 ;;
  square)    W=1080; H=1080 ;;
  *) echo "shape must be landscape, portrait or square" >&2; exit 1 ;;
esac
[[ "$slug" =~ ^[a-z0-9][a-z0-9-]*$ ]] || { echo "slug must be kebab-case, e.g. 2026-11-design-partner-teaser" >&2; exit 1; }
dest="projects/$slug"
[[ -e "$dest" ]] && { echo "$dest already exists" >&2; exit 1; }

cp -r templates/cs-endcard "$dest"
mkdir -p "$dest/assets/fonts" "$dest/assets/audio" "$dest/assets/images"
cp brand/fonts/*.woff2 "$dest/assets/fonts/"
mkdir -p "$dest/assets/vendor" && cp brand/vendor/gsap.min.js "$dest/assets/vendor/"
cp templates/BRIEF.md "$dest/BRIEF.md"

# Swap canvas size everywhere (scene is laid out in vmin, so it reflows).
find "$dest" -name '*.html' -print0 | xargs -0 sed -i \
  -e "s/data-width=\"1920\"/data-width=\"$W\"/g" -e "s/data-height=\"1080\"/data-height=\"$H\"/g" \
  -e "s/width=1920, height=1080/width=$W, height=$H/" \
  -e "s/width: 1920px; height: 1080px/width: ${W}px; height: ${H}px/" \
  -e "s/data-resolution=\"landscape\"/data-resolution=\"$shape\"/"
printf '{ "id": "%s", "name": "%s", "createdAt": "%s" }\n' "$slug" "$slug" "$(date -u +%FT%TZ)" > "$dest/meta.json"
HFV="$(node -p "require('./package.json').hyperframesVersion")"
cat > "$dest/package.json" <<JSON
{
  "name": "$slug",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "npx --yes hyperframes@$HFV preview",
    "check": "npx --yes hyperframes@$HFV check",
    "snapshot": "npx --yes hyperframes@$HFV snapshot --review",
    "render": "npx --yes hyperframes@$HFV render --quality delivery",
    "qa": "bash ../../scripts/qa.sh"
  }
}
JSON
echo "Created $dest (${W}x${H}). Next: fill in $dest/BRIEF.md, then build scenes in $dest/compositions/."
