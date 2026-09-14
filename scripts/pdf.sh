#!/bin/sh
# Build the site, serve dist statically, crawl it into a PDF (starlight-to-pdf).
# Output: dist/<filename>.pdf
set -e
cd "$(dirname "$0")/.."

NODE_ENV=production npx astro build

npx astro preview --port 4322 >/tmp/docs-pdf-preview.log 2>&1 &
PREVIEW=$!
trap 'kill $PREVIEW 2>/dev/null' EXIT
sleep 3

# Chrome on Ubuntu 24.04 needs --no-sandbox (AppArmor disabled unprivileged
# user namespaces); starlight-to-pdf has no flag for it, so wrap the binary.
CHROME=${CHROME:-$(ls "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux*/chrome 2>/dev/null | tail -1)}
WRAPPER="/tmp/chrome-nosandbox.$$"
printf '#!/bin/sh\nexec %s --no-sandbox "$@"\n' "$CHROME" > "$WRAPPER"
chmod +x "$WRAPPER"

./node_modules/.bin/starlight-to-pdf http://localhost:4322/main/introduction \
  --browser-executable "$WRAPPER" \
  --filename "${PDF_NAME:-docs}" \
  --format A4 --print-bg --contents-name "Contents" --contents-links internal \
  -p dist

rm -f "$WRAPPER"
echo "PDF: dist/${PDF_NAME:-docs}.pdf"
