#!/usr/bin/env bash
# Bundles each deployed MoreIELTS Edge Function into one ASCII file under
# supabase/functions/_dist. supabase/config.toml points each function's
# entrypoint at its bundle, so `supabase functions deploy` uploads exactly
# what CI type-checked and the deployed code never reaches back into this
# repository. Re-run and commit after changing a function.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/supabase/functions/_dist"
mkdir -p "$OUT"
for fn in ielts-submit-attempt ielts-drill ielts-grading-worker ielts-generate-audio; do
  npx esbuild "$ROOT/supabase/functions/$fn/index.ts" --bundle --format=esm \
    --platform=neutral --target=es2022 --charset=ascii --legal-comments=none \
    --external:'jsr:*' --outfile="$OUT/$fn.js" --log-level=error
done
if LC_ALL=C grep -q '[^ -~	]' "$OUT"/*.js; then
  echo "non-ASCII byte in a bundle" >&2
  exit 1
fi
echo "bundled into $OUT"
