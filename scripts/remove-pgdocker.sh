#!/bin/env bash

docker ps|grep postgresql|awk '{print $1}' | xargs docker stop
docker ps|grep my-pgadmin|awk '{print $1}' | xargs docker stop
docker ps -a|grep postgresql|awk '{print $1}' | xargs docker rm
docker ps -a|grep my-pgadmin|awk '{print $1}' | xargs docker rm
