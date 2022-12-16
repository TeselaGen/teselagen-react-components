#!/bin/sh
cd /app && git checkout package.json && rm -rf ./app/.babelrc && pnpm i
git pull origin master &&
cd /app && pnpm buildWithDemo
