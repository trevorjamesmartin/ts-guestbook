#!/bin/env bash

docker ps|grep redis|awk '{print $1}' | xargs docker stop
docker ps|grep my-redis|awk '{print $1}' | xargs docker stop
docker ps -a|grep redis|awk '{print $1}' | xargs docker rm
docker ps -a|grep my-my|awk '{print $1}' | xargs docker rm
