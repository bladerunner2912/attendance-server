#!/usr/bin/env bash
set -euo pipefail

npm ci
npm run db:setup
npm run start
