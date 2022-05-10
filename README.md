# vigilant-cloud

## API
developing

    npm install
    npm run create:db
    npm run develop

building a release

    npm run clean
    npm run release

## Client
with the API release running in a separate window,
take full advantage of hot reloading while building out the graphical user interface.

    code src/app



## Docker

these scripts were written for convenience

build

    npm run build:container

run

    npm run start:container

stop

    npm run stop:container

reboot (stop > build > start)

    npm run dockerize


## Postgres

install container

    docker pull postgres

run

    docker run --name postgresql -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -v /var/lib/pgsql/data:/var/lib/postgresql/data -d postgres

- prep

get container IP


    docker inspect postgresql -f "{{json .NetworkSettings.Networks }}"

- PG Admin connects to the container IP

install pgAdmin

    docker pull dpage/pgadmin4:latest

run

    docker run --name my-pgadmin -p 82:80 -e 'PGADMIN_DEFAULT_EMAIL=pg@local.domain' -e 'PGADMIN_DEFAULT_PASSWORD=postgresmaster' -d dpage/pgadmin4

