#!/bin/env sh

(ls index.js >> /dev/null 2>&1 && npm run create:db && npm run start)
