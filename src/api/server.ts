import express from 'express';
import configureServer from './configure';
import configureRoutes from './routes';
import configureSockets from './sockets';
import http from 'http';
import { Server } from 'socket.io';
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import logger from './common/logger';
logger.debug('create server')
const httpServer = http.createServer(configureRoutes(configureServer(express())));

httpServer.on('upgrade', function (request: any, socket, head) {
  logger.debug('upgrade 🕸️')
});

// TODO
// https://socket.io/docs/v4/typescript/#types-for-the-server  

interface SocketData {
  username: string|undefined;
  token: string|undefined;
  [key:string]:any;
}

const ioServer = new Server<Server, {}, {}, SocketData>(
  httpServer, {
  cors: {
    origin: [
      "https://vigilant-cloud.herokuapp.com",
      "http://localhost:8080",
      "http://localhost:3000",
      "http://localhost:5000",
      "http://127.0.0.1:8080",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5000",
      "http://0.0.0.0:8080",
      "http://172.17.0.2:8080"
    ],
    credentials: true,
  },
  // allowEIO3: true
});

// REDIS ADAPTER
if(process.env.NODE_ENV !== "design") {
  logger.debug('create redis adapter');
  const pubClient = createClient({ url: process.env.REDIS_URL });
  pubClient.on('error', (err) => console.log('Redis Client Error [pub]', err));
  const subClient = pubClient.duplicate();
  subClient.on('error', (err) => console.log('Redis Client Error [sub]', err));
  logger.debug('connect redis adapter');
  Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    ioServer.adapter(createAdapter(pubClient, subClient));
  });
}
// POSTGRES ADAPTER
if(process.env.NODE_ENV !== "design") {
  const {createAdapter} = require("@socket.io/postgres-adapter");
  const {Pool, PoolConfig} = require('pg');
  let pool;
  function getPoolConfig():typeof PoolConfig {
    let url: string = process.env.DATABASE_URL || '';
    let [_, b, c, d] = url?.split(':');
    let [__, user] = b?.split('//');
    let [password, host] = c?.split('@');
    let [port, database] = d?.split('/');
    return {
      user, password, host, database, port: Number(port)
    }
  }
  logger.debug('create Postgres pool');
  pool = new Pool(getPoolConfig());
  pool.query(`
    CREATE TABLE IF NOT EXISTS socket_id_attachments (
      id          bigserial UNIQUE,
      created_at  timestamptz DEFAULT NOW(),
      payload     bytea
    );
  `);
  logger.debug('create postgres pool adapter')
  ioServer.adapter(createAdapter(pool))
}
export const io = configureSockets(ioServer);

export default httpServer;
