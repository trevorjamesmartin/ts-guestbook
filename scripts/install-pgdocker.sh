#!/bin/env bash

docker pull postgres
docker run --name local.postgresql -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -v /var/lib/pgsql/data:/var/lib/postgresql/data -d postgres
docker inspect postgresql -f "{{json .NetworkSettings.Networks }}"
docker pull dpage/pgadmin4:latest
docker run --name local.pgadmin -p 82:80 -e 'PGADMIN_DEFAULT_EMAIL=pg@local.domain' -e 'PGADMIN_DEFAULT_PASSWORD=postgresmaster' -d dpage/pgadmin4
