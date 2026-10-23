#!/usr/bin/env bash
# Rebuild game/app.js from game/src/app.jsx (JSX → plain JS, minified).
# The site itself has no build step; this only needs to run after editing the game source.
# React is vendored in game/vendor (react@18.3.1 UMD production builds, MIT).
set -euo pipefail
cd "$(dirname "$0")/.."
npx --yes esbuild@0.25 game/src/app.jsx --loader:.jsx=jsx --minify --target=es2020 --legal-comments=none --outfile=game/app.js
echo "game/app.js built ($(wc -c < game/app.js) bytes)"
