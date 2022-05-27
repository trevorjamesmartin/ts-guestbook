#!/bin/env bash
docker pull redis
docker run --name my-redis -p 6379:6379 -d redis
