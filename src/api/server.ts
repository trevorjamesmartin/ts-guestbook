import express from 'express';
import configureServer, {sessionParser} from './configure';
import configureRoutes from './routes';
import configureSockets from './sockets';
import http from 'http';

const httpServer = http.createServer(configureRoutes(configureServer(express())));

httpServer.on('upgrade', function (request: any, socket, head) {
  let response: any = {};
  sessionParser(request, response, () => {
      if (!request.session.userId) {
          console.log("session errror, HTTP://1.1 401 Unauthorized");
          socket.write('HTTP://1.1 401 Unauthorized\r\n\r\n');
          socket.destroy();
          return;
      }
      console.log(`${request.session.username} => upgrade`);
  });
});
const ioServer = require('socket.io')(httpServer, {
  cors: {
    origin: [
      "https://vigilant-cloud.herokuapp.com",
      "http://localhost:8080",
      "http://localhost:3000",
      "http://localhost:5000",
    ],
    credentials: true,
  }
});

export const io = configureSockets(ioServer);

export default httpServer;
