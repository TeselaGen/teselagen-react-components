apk add --no-cache bash git &&
npm install -g pnpm &&
pnpm add -g github-webhook &&
pnpm add -g serve &&
pnpm add -g pm2 &&
pm2 kill &&
cd /app && git checkout package.json && rm -rf ./app/.babelrc && pnpm i
git pull origin master &&
cd /app && pnpm buildWithDemo &&
pm2 start /app/ecosystem.json &&
serve -p 3333 /app/demo/dist
