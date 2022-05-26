#!/bin/env sh
cd dist
(ls index.js >> /dev/null 2>&1 && \
echo "found javascript, updating heroku repo" && \
read -n 1 -p "ready to deploy, ctrl-C to abort." && \
  git add . && \
  git commit -m "update" && \
  git push)
