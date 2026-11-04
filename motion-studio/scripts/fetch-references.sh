#!/usr/bin/env bash
# Shallow-clone (or update) every repo in references.txt into references/<name>.
#   bash scripts/fetch-references.sh [name ...]   # all, or only the named ones
set -uo pipefail
cd "$(dirname "$0")/.."
mkdir -p references
only=" $* "
grep -vE '^\s*(#|$)' references.txt | while read -r name url _; do
  [[ $# -gt 0 && "$only" != *" $name "* ]] && continue
  dest="references/$name"
  if [[ -d "$dest/.git" ]]; then
    git -C "$dest" pull -q --depth 1 && echo "updated  $name" || echo "FAILED   $name (pull)"
  else
    ok=0
    for i in 1 2 3 4; do
      GIT_TERMINAL_PROMPT=0 git clone -q --depth 1 --no-recurse-submodules "$url" "$dest" 2>/tmp/fetchref.err && { ok=1; break; }
      grep -qiE 'not found|404|repository .* does not exist|could not read Username' /tmp/fetchref.err && break
      rm -rf "$dest"; sleep $((2**i))
    done
    [[ $ok == 1 ]] && echo "cloned   $name  ($(du -sh "$dest" | cut -f1))" || echo "FAILED   $name: $(tail -1 /tmp/fetchref.err)"
  fi
done
