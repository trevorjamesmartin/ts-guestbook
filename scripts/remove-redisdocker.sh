#!/bin/env bash

docker ps|grep local.redis|awk '{print $1}' | xargs docker stop
docker ps -a|grep local.redis|awk '{print $1}' | xargs docker rm
