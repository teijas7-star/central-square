#!/usr/bin/env bash
# Scaffold a new Central Square AI film (seek(t) render contract).
#   scripts/new-video.sh <slug> [landscape|portrait|square]
# Creates projects/<slug>/ with film.html (branded starter), brand fonts, BRIEF.md and SCORECARD.md.
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

mkdir -p "$dest/assets/fonts" "$dest/assets/images" "$dest/audio"
cp templates/cs-film/film.html "$dest/film.html"
mkdir -p "$dest/lib" "$dest/docs" && cp lib/motion.js "$dest/lib/motion.js"
cp brand/fonts/*.woff2 "$dest/assets/fonts/"
cp templates/BRIEF.md "$dest/BRIEF.md"
cp templates/SCORECARD.md "$dest/SCORECARD.md"
sed -i "s/window.FILM = { width: 1920, height: 1080,/window.FILM = { width: $W, height: $H,/" "$dest/film.html"
grep -q "width: $W, height: $H" "$dest/film.html" || { echo "could not set film size" >&2; exit 1; }
echo "Created $dest (${W}x${H}).
  1. Fill in $dest/BRIEF.md
  2. Build in $dest/film.html (window.seek(t) paints frame t)
  3. node scripts/render.mjs $dest/film.html --sheet   -> look, score SCORECARD.md, fix, repeat until all 8+
  4. node scripts/render.mjs $dest/film.html           -> then bash scripts/qa.sh $dest/renders/film.mp4"
