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
  // websocket options
  cors: {
    origin: [
      "http://localhost:8080", 
      "https://vigilant-cloud.herokuapp.com"
    ]
  }
});

export { io };

export default httpServer;
