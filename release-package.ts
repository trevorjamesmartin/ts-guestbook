import path from 'path';
import fs from 'fs';

const packageJson = require('./package.json');
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
