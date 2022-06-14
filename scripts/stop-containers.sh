#!/bin/env bash
docker ps -a |grep local |awk '{print $1}'|xargs docker stop
