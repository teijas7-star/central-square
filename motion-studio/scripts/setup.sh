#!/usr/bin/env bash
# Idempotent setup for the motion studio. Safe to run on every session start.
#   bash motion-studio/scripts/setup.sh          # full check + install what's missing
#   bash motion-studio/scripts/setup.sh --quiet  # same, only prints problems
set -uo pipefail
cd "$(dirname "$0")/.."
Q=0; [[ "${1:-}" == "--quiet" ]] && Q=1
say(){ [[ $Q == 1 ]] || echo "$@"; }
warn(){ echo "motion-studio setup: $*" >&2; }

command -v node >/dev/null || warn "node missing (need 22+)"
command -v ffmpeg >/dev/null || warn "ffmpeg missing (brew install ffmpeg / apt install ffmpeg)"
command -v python3 >/dev/null || warn "python3 missing"

# Python audio stack
if ! python3 -c "import numpy, librosa, soundfile" 2>/dev/null; then
  say "Installing numpy librosa soundfile..."
  python3 -m pip install -q numpy librosa soundfile 2>/dev/null \
    || python3 -m pip install -q --break-system-packages numpy librosa soundfile \
    || warn "pip install of librosa/soundfile failed"
fi

# Node deps (playwright for frame QA; HyperFrames runs via npx at the pinned version)
if [[ ! -d node_modules/playwright ]]; then
  say "Installing node dev deps..."
  npm install --silent --no-audit --no-fund >/dev/null 2>&1 || warn "npm install failed"
fi

# Hand-drawn plugin's canvas dependency (only if the plugin is installed for this user)
for d in "$HOME"/.claude/plugins/cache/claude-animation-skill/claude-animation/*/skills/claude-animation; do
  [[ -d "$d" && ! -d "$d/node_modules/@napi-rs/canvas" ]] && (cd "$d" && npm install --silent --no-audit --no-fund >/dev/null 2>&1 || warn "canvas install failed in $d")
done

# Warm the pinned HyperFrames CLI so the first real command is fast
HFV="$(node -p "require('./package.json').hyperframesVersion" 2>/dev/null)"
[[ -n "$HFV" ]] && (npx --yes "hyperframes@$HFV" --version >/dev/null 2>&1 || warn "could not fetch hyperframes@$HFV")

say "motion-studio ready."
