import authRouter from './auth-router';
import authMiddleware from './restricted-middleware';
import session from 'express-session';
import KnexSession from 'connect-session-knex';
import knex from '../../data/dbConfig';

const KnexStore = KnexSession(session);

const sessionConfig = {
    name: "monkey",
    secret: "typewriters",
    cookie: {
      maxAge: 1000 * 60 * 7,
      secure: false,
      httpOnly: true
    },
    resave: false,
    saveUninitialized: true,
    store: new KnexStore({
      knex,
      tablename: "sessions",
      createtable: true,
      sidfieldname: "sid",
      clearInterval: 1000 * 60 * 15
    })
};

export {
    authRouter, authMiddleware, session, sessionConfig
}
