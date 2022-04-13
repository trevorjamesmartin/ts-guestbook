const knex = require('knex');
const config = require('../../knexfile');

const environment = "development";

export default knex(config[environment]);

