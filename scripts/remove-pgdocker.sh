#!/bin/env bash

docker ps|grep local.postgresql|awk '{print $1}' | xargs docker stop
docker ps|grep local.pgadmin|awk '{print $1}' | xargs docker stop
docker ps -a|grep local.postgresql|awk '{print $1}' | xargs docker rm
docker ps -a|grep local.pgadmin|awk '{print $1}' | xargs docker rm
