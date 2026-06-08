#!/bin/bash
# garden-push.sh
# Syncs Obsidian vault content → src/content, then commits and pushes to git.
# Usage: ./garden-push.sh
#        ./garden-push.sh "optional commit message"

set -e

VAULT="${VAULT_PATH:-"/Users/giannacrisha/Library/Mobile Documents/iCloud~md~obsidian/Documents/gi-garden-vault"}"
CONTENT="${CONTENT_PATH:-"/Users/giannacrisha/projects/giannacrisha.github.io/src/content"}"

echo "🌱 Syncing Obsidian → src/content..."

# Sync each folder (delete files removed in Obsidian, skip .DS_Store and Obsidian metadata)
rsync -av --delete \
  --exclude='.DS_Store' \
  --exclude='.obsidian/' \
  --exclude='*.canvas' \
  "$VAULT/🌱 garden/archives/" "$CONTENT/archives/"

rsync -av --delete \
  --exclude='.DS_Store' \
  --exclude='.obsidian/' \
  --exclude='*.canvas' \
  "$VAULT/🌱 garden/lab/" "$CONTENT/lab/"

rsync -av --delete \
  --exclude='.DS_Store' \
  --exclude='.obsidian/' \
  --exclude='*.canvas' \
  "$VAULT/🌱 garden/gallery/" "$CONTENT/gallery/"

rsync -av --delete \
  --exclude='.DS_Store' \
  --exclude='.obsidian/' \
  --exclude='*.canvas' \
  "$VAULT/🌱 garden/library/" "$CONTENT/library/"

rsync -av --delete \
  --exclude='.DS_Store' \
  --exclude='.obsidian/' \
  --exclude='*.canvas' \
  "$VAULT/👇 now/" "$CONTENT/now/"

echo ""

# Convert HEIC images (often iPhone photos with a faked .jpg extension) to real
# JPEG — Astro's image pipeline reads the actual bytes and rejects HEIC at build.
echo "🖼  Checking for HEIC images..."
converted=0
while IFS= read -r -d '' img; do
  if file -b "$img" | grep -q "ISO Media"; then
    sips -s format jpeg "$img" --out "$img" >/dev/null 2>&1
    echo "   ↳ converted $(basename "$img")"
    converted=$((converted + 1))
  fi
done < <(find "$CONTENT" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) -print0)
[ "$converted" -eq 0 ] && echo "   ✓ none found" || echo "   ✓ converted $converted image(s)"

echo ""

# Check if there's anything to commit
REPO="${CONTENT%/src/content}"
cd "$REPO"
if git diff --quiet && git diff --staged --quiet; then
  echo "✓ Nothing changed — already up to date."
  exit 0
fi

npm run check || { echo "⛔ Type errors — fix before pushing"; exit 1; }

# Commit message: use argument or default with date
MSG="${1:-"content: sync from Obsidian $(date '+%Y-%m-%d')"}"

git add src/content/
git commit -m "$MSG"
git push

echo ""
echo "🚀 Pushed! Vercel will redeploy shortly."
