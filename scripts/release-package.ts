import path from 'path';
import fs from 'fs';
// NODE
const packageJson = require('../package.json');
let packageDist = {...packageJson,
    "name" : "vigilant-cloud",
    "scripts": {
        "pre:start": "npm install",
        "start": "node index.js",
        "create:db": "npx knex migrate:latest && npx knex seed:run"
    }
}
delete packageDist["devDependencies"];
let data = JSON.stringify(packageDist);
let filename = path.join(process.cwd(), 'dist', 'package.json');
fs.writeFileSync(filename, data);

// DOCKER
const NODE_IMAGE="18-alpine"
const WORKDIR="/opt/app";
const RELEASE_FILE="dist.tar.gz";
const REMOVE_CONTENT="mv dist/* . && rmdir dist";
const ENV_PASSWORD="s3cr3tP4ssw0rd";
const PORT=8080
let dockerfile = path.join(process.cwd(), 'release', 'Dockerfile');

fs.appendFileSync(dockerfile, `FROM node:${NODE_IMAGE}\n`);
fs.appendFileSync(dockerfile, `RUN apk add g++ make python3\n`);

fs.appendFileSync(dockerfile, `WORKDIR ${WORKDIR}\n`);
// copy latest release file
fs.appendFileSync(dockerfile, `COPY ${RELEASE_FILE} .\n`);
// extract contents
fs.appendFileSync(dockerfile, `RUN tar zxvf ${RELEASE_FILE} && ${REMOVE_CONTENT} && rm ${RELEASE_FILE}\n`);
fs.appendFileSync(dockerfile, `ENV PASSWORD=${ENV_PASSWORD}\n`);
// install library dependencies
fs.appendFileSync(dockerfile, `RUN npm install && mkdir ${WORKDIR}/db && npm run create:db\n`);
fs.appendFileSync(dockerfile, `EXPOSE ${PORT}\n`);
fs.appendFileSync(dockerfile, `CMD ["npm", "start"]\n`);
