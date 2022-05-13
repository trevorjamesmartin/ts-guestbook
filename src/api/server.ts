import express from 'express';
import configureServer from './configure';
import configureRoutes from './routes';
import http from 'http';
import { Server } from 'socket.io'
try {
  require('dotenv').config();
} catch {
  console.log('[production mode]');
}

const httpServer = http.createServer(configureRoutes(configureServer(express())));

const io = new Server(httpServer, {
  // options
});

export { io };

export default httpServer;
