#!/usr/bin/env bash
# Final delivery: render every format, QA each, and write poster + contact sheet.
#   bash scripts/deliver.sh projects/<slug>/film.html [formats=16x9,9x16,1x1] [poster_t=auto]
# Output: projects/<slug>/out/
#   final.mp4 (first format) and final-<format>.mp4 for each, poster.png, contact.png, qa.txt
set -euo pipefail
cd "$(dirname "$0")/.."
film="${1:?usage: deliver.sh projects/<slug>/film.html [16x9,9x16,1x1] [poster_t]}"
formats="${2:-16x9,9x16,1x1}"; poster_t="${3:-auto}"
dir="$(dirname "$film")"; out="$dir/out"; mkdir -p "$out"; : > "$out/qa.txt"
size_of() { case "$1" in 16x9) echo 1920x1080 ;; 9x16) echo 1080x1920 ;; 1x1) echo 1080x1080 ;; 4x5) echo 1080x1350 ;; *) echo "unknown format $1" >&2; exit 1 ;; esac; }
first=""; fail=0
IFS=, read -ra F <<< "$formats"
for f in "${F[@]}"; do
  sz=$(size_of "$f"); mp4="$out/final-$f.mp4"
  echo "== $f ($sz)"
  rm -f "$mp4"
  if ! node scripts/render.mjs "$film" --size="$sz" --out="$mp4" > "$out/render-$f.log" 2>&1; then
    echo "FAIL: render of $f failed:"; tail -3 "$out/render-$f.log"; printf '### %s (%s)\nFAIL: render failed (see render-%s.log)\n\n' "$f" "$sz" "$f" >> "$out/qa.txt"; fail=1; continue
  fi
  grep -E "WARNING|video:" "$out/render-$f.log" || true
  { echo "### $f ($sz)"; bash scripts/qa.sh "$mp4" || fail=1; echo; } >> "$out/qa.txt" 2>&1
  [[ -z "$first" && -f "$mp4" ]] && first="$f"
done
if [[ -z "$first" ]]; then echo "No format rendered; see $out/render-*.log"; exit 1; fi
cp "$out/final-$first.mp4" "$out/final.mp4"
cp "$out/final-$first.contact.jpg" "$out/contact.jpg" 2>/dev/null || true
# contact.png: one frame per beat of the primary format (the review sheet)
node scripts/render.mjs "$film" --sheet --size="$(size_of "$first")" --out="$out/review.mp4" >/dev/null
base="$(basename "$film" .html)"
mv "${out:?}/${base:?}.beats.png" "$out/contact.png"; rm -rf "${out:?}/${base:?}.beats"
# poster: the CTA/end state by default (2 s before the end), or a chosen time
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$out/final.mp4")
[[ "$poster_t" == auto ]] && poster_t=$(awk -v d="$dur" 'BEGIN{t=d-2; if(t<0)t=d/2; printf "%.2f", t}')
node scripts/render.mjs "$film" --poster="$poster_t" --size="$(size_of "$first")" --out="$out/poster.png" --no-audio >/dev/null
echo "== delivered to $out:"; ls -1 "$out" | grep -vE "\.contact\.jpg$" | sed 's/^/   /'
grep -E "FAIL|WARN" "$out/qa.txt" && echo "QA problems above (full report: $out/qa.txt)" || echo "QA passed for every format (report: $out/qa.txt)"
exit $fail
