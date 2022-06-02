[release-package.ts](release-package.ts) is one of the steps taken by the [package > scripts > "release"](../package.json) task.

It creates a new package.json file for a clean deployment.

#
Convenience scripts, for installing resources with Docker.

Postgres
- install-pgdocker.sh
- remove-pgdocker.sh


Redis
- install-redisdocker.sh
- remove-redisdocker

#
_Archive_

prior to CI integration, the following scripts were used for deployment.

[package > scripts](../package.json) > "deploy" 
- build-javascript.sh
- deploy-to-heroku.sh

