import express from 'express';
import configureServer from './configure';
import configureRoutes from './routes';
import configureSockets from './sockets';
import http from 'http';
import { Server } from 'socket.io';
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { SocketData } from './common/types';
import logger from './common/logger';
logger.debug('express()')
const httpServer = http.createServer(configureRoutes(configureServer(express())));

httpServer.on('upgrade', function (request: any, socket, head) {
  logger.debug('🕸️ upgrade')
});

// TODO
// https://socket.io/docs/v4/typescript/#types-for-the-server  


logger.debug('🔌 attach socket io');

const ioServer = new Server<Server, {}, {}, SocketData>(
  httpServer, {
  cors: {
    origin: [
      "https://ts-guestbook.herokuapp.com",
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
logger.debug('🛋  create room adapter');
let redis_enabled = false;
// REDIS ADAPTER
function redisClient(tag: string) {
  const client = createClient({ url: process.env.REDIS_URL });
  client.on('error', err => logger.error(`[${tag}] client error`, err));
  client.on('connect', () => logger.debug(`[${tag}] client connect`));
  client.on('reconnecting', () => logger.debug(`[${tag}] client reconnecting`));
  client.on('ready', () => logger.info(`[${tag}] client ready`));
  return client;
}

if (process.env.REDIS_URL) {
  redis_enabled = true;
  const pub = redisClient("publish");
  const sub = redisClient("subscribe");
  Promise.all([pub.connect(), sub.connect()]).then(() => {
    ioServer.adapter(createAdapter(pub, sub));
    logger.debug('🔌  🛋  Redis 💡');
  });
}
// POSTGRES ADAPTER
if (!redis_enabled && process.env.DATABASE_URL) {
  const { createAdapter } = require("@socket.io/postgres-adapter");
  const { Pool, PoolConfig } = require('pg');
  let pool;
  function getPoolConfig(): typeof PoolConfig {
    let url: string = process.env.DATABASE_URL || '';
    let [_, b, c, d] = url?.split(':');
    let [__, user] = b?.split('//');
    let [password, host] = c?.split('@');
    let [port, database] = d?.split('/');
    return {
      user, password, host, database, port: Number(port)
    }
  }
  pool = new Pool(getPoolConfig());
  pool.query(`
    CREATE TABLE IF NOT EXISTS socket_id_attachments (
      id          bigserial UNIQUE,
      created_at  timestamptz DEFAULT NOW(),
      payload     bytea
    );
  `);
  ioServer.adapter(createAdapter(pool))
  logger.debug('[Postgres adapter]');
}
export const io = configureSockets(ioServer);

export default httpServer;
