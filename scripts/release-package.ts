import path from 'path';
import fs from 'fs';

// NODE
const packageJson = require('../package.json');
let packageDist = {...packageJson,
    "name" : "vigilant-cloud",
    "scripts": {
        "start": "node index.js",
        "build": "npm install"
        // "create:db": "npx knex migrate:latest && npx knex seed:run",
        // "heroku-postbuild": "npm run create:db" // this will be run on Heroku
    }
}
delete packageDist["devDependencies"];
let data = JSON.stringify(packageDist);
let filename = path.join(process.cwd(), 'dist', 'package.json');
fs.writeFileSync(filename, data);

// DOCKER
const WORKDIR="/opt/app";
const RELEASE_FILE="dist.tar.gz";
const REMOVE_CONTENT="mv dist/* . && rmdir dist";
const ENV_PASSWORD="s3cr3tP4ssw0rd";
const PORT=8080
let dockerfile = path.join(process.cwd(), 'release', 'Dockerfile');

fs.writeFileSync(dockerfile, `
FROM node:17-alpine

WORKDIR ${WORKDIR}
COPY ${RELEASE_FILE} .
ENV PASSWORD=${ENV_PASSWORD}

RUN tar zxvf ${RELEASE_FILE} \\
    && ${REMOVE_CONTENT} \\
    && rm ${RELEASE_FILE}    

RUN apk add --no-cache --virtual .gyp python3 make g++ \\
    && npm install \\
    && mkdir ${WORKDIR}/db \\
    && apk del .gyp

EXPOSE ${PORT}

CMD ["node", "index.js"]
`);
