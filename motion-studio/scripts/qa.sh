#!/usr/bin/env bash
# Delivery QA for a rendered video. Run before calling anything "done".
#   bash scripts/qa.sh path/to/video.mp4 [target_lufs=-14]
# Prints specs, loudness, black/frozen stretches, and writes <video>.contact.jpg (one frame per second).
set -euo pipefail
v="${1:?usage: qa.sh video.mp4 [target_lufs]}"; target="${2:--14}"
[[ -f "$v" ]] || { echo "no such file: $v" >&2; exit 1; }
fail=0

echo "== Specs"
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,pix_fmt,width,height,r_frame_rate -of default=nw=1 "$v"
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$v"); echo "duration=${dur}s"
pix=$(ffprobe -v error -select_streams v:0 -show_entries stream=pix_fmt -of csv=p=0 "$v")
codec=$(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 "$v")
[[ "$codec" == "h264" && "$pix" == "yuv420p" ]] || { echo "WARN: social delivery wants h264/yuv420p (got $codec/$pix)"; }

echo "== Audio"
if ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$v" | grep -q .; then
  ffmpeg -hide_banner -nostats -i "$v" -af ebur128=peak=true -f null - 2>&1 \
    | awk '/Integrated loudness:/{f=1} f&&/I:|LRA:|Peak:/{print "  "$0}' | head -4
  I=$(ffmpeg -hide_banner -nostats -i "$v" -af ebur128 -f null - 2>&1 | awk '/Integrated loudness:/{getline; print $2}')
  TP=$(ffmpeg -hide_banner -nostats -i "$v" -af ebur128=peak=true -f null - 2>&1 | awk '/True peak:/{getline; print $2}')
  echo "  target ${target} LUFS (±1), true peak ≤ -1.0 dBTP (measured ${TP})"
  awk -v p="$TP" 'BEGIN{exit !(p>-1.0)}' && { echo "FAIL: true peak ${TP} dBTP is above -1.0"; fail=1; }
  awk -v i="$I" -v t="$target" 'BEGIN{d=i-t; if(d<0)d=-d; exit !(d>1)}' && { echo "FAIL: loudness ${I} LUFS is off target"; fail=1; }
else
  echo "  (no audio stream — fine for a silent loop, otherwise FAIL)"
fi

echo "== Black frames (>0.25s)"
ffmpeg -hide_banner -nostats -i "$v" -vf "blackdetect=d=0.25:pix_th=0.04" -an -f null - 2>&1 | grep -o 'black_start.*' || echo "  none"
echo "== Frozen stretches (>1.5s; expected only on deliberate holds)"
ffmpeg -hide_banner -nostats -i "$v" -vf "freezedetect=n=0.001:d=1.5" -an -f null - 2>&1 | grep -oE 'freeze_(start|duration): [0-9.]+' | paste - - || echo "  none"

out="${v%.*}.contact.jpg"
n=$(awk -v d="$dur" 'BEGIN{n=int(d+0.999); if(n<1)n=1; print n}')
cols=$(( n < 6 ? n : 6 )); rows=$(( (n + cols - 1) / cols ))
ffmpeg -hide_banner -loglevel error -y -i "$v" -vf "fps=1,scale=480:-2,tile=${cols}x${rows}:padding=6:color=0x222222" -frames:v 1 -update 1 "$out"
echo "== Contact sheet: $out  (open it and look at every frame)"
exit $fail
