#!/bin/sh
# Install /build-jane to the user scope (~/.claude).
set -e
SRC="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$SRC/../.." && pwd)"
mkdir -p "$HOME/.claude/commands"
cp "$REPO/.claude/commands/build-jane.md" "$HOME/.claude/commands/build-jane.md"
rm -rf "$HOME/.claude/build-jane"
cp -r "$SRC" "$HOME/.claude/build-jane"
chmod +x "$HOME/.claude/build-jane/scripts/jane.mjs"
echo "installed /build-jane to $HOME/.claude"
node "$HOME/.claude/build-jane/scripts/jane.mjs" self-test
