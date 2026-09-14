#!/bin/sh
set -e

# The repo is bind-mounted at /app; deps live in the named volume
# /app/node_modules so container installs never pollute the host tree.
# Install as root (first-run volume is root-owned), then hand the tree to
# the `node` user (uid 1000 = host user) so vite's cache dirs and the
# files Keystatic writes are host-user-owned.
bun install --frozen-lockfile
chown -R node:node /app/node_modules

# A container restart leaves Astro's dev-server lock behind in the bind
# mount, and the next start refuses to boot ("already running"). Clear it.
rm -rf /app/.astro

exec su-exec node:node npm run dev -- --host 0.0.0.0 --port 4321
