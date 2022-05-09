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



## Docker containers

these scripts were written for convenience

build

    npm run build:container

run

    npm run start:container

stop

    npm run stop:container

reboot (stop > build > start)

    npm run dockerize

