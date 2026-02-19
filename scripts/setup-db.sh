#!/usr/bin/env bash
set -euo pipefail

npm run db:init
npm run db:seed
