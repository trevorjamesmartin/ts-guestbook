import session from 'express-session';
import KnexSession from 'connect-session-knex';
import knex from '../../data/dbConfig';

const KnexStore = KnexSession(session);

const sessionConfig = {
    name: "monkey",
    secret: "typewriters",
    cookie: {
      secure: false,
    },
    resave: true,
    saveUninitialized: true,
    store: new KnexStore({
      knex,
      tablename: "sessions",
      createtable: true,
      sidfieldname: "sid",
      clearInterval: 1000 * 60 * 15
    })
};

export { sessionConfig, session };
