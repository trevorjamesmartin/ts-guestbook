import express from 'express';
import configureServer from './configure';
import configureRoutes from './routes';
import configureSockets from './sockets';
import http from 'http';
import { Server } from 'socket.io';
import { createAdapter } from "@socket.io/postgres-adapter";
import { Pool, PoolConfig } from "pg";
import userMap from './common/maps';
const httpServer = http.createServer(configureRoutes(configureServer(express())));



httpServer.on('upgrade', function (request: any, socket, head) {
  console.log('upgrading to websocket');
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
    ],
    credentials: true,
  },
  // allowEIO3: true
});

function getPoolConfig() {
  let url: string = process.env.DATABASE_URL || '';
  let [_, b, c, d] = url?.split(':');
  let [__, user] = b.split('//');
  let [password, host] = c.split('@');
  let [port, database] = d.split('/');
  let config: PoolConfig = {
    user, password, host, database, port: Number(port)
  }
  return config
}

const pool = new Pool(getPoolConfig());

pool.query(`
  CREATE TABLE IF NOT EXISTS socket_id_attachments (
    id          bigserial UNIQUE,
    created_at  timestamptz DEFAULT NOW(),
    payload     bytea
  );
`);

ioServer.adapter(createAdapter(pool))

export const io = configureSockets(ioServer);

export default httpServer;
