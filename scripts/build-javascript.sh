#!/bin/env sh
(ls index.ts >> /dev/null 2>&1 && \
echo "found typescript, generating JS" && \
read -n 1 -p "Press any key to continue, ctrl-C to abort." inputkey && \
  echo "cleaning ./dist" && \
  npm run clean && \
  echo "building new release" && \
  npm run release)
