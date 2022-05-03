#!/bin/env sh
(ls dev.sqlite3 >> /dev/null 2>&1 && echo "removing old database file." && rm dev.sqlite3)
(ls index.js >> /dev/null 2>&1 && echo "installing/updating library dependencies..." && npm install && echo "creating database" && npm run create:db)
