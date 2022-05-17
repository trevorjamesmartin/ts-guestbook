import express from 'express';
import { Socket } from 'socket.io';
import { sessionParser } from './configure';
const map = new Map();
// (IO)
import postIO from './posts';

export default function (io: any) {
    // socket.io
    io.use((socket:Socket, next: express.NextFunction) => {
      let req = socket.request as express.Request;
      let res = req.res as express.Response;
      sessionParser(req, res, next as express.NextFunction);
    });
  
    io.on('connection', function (socket:Socket) {
      const req = socket.request as express.Request;
      req.session.loggedIn = true;
      req.session.save();
      map.set(req.session.username, socket);
      console.log('+ ', req.session.username, 'connected', socket.id);
      for (let username of map.keys()) {
        const client:Socket = map.get(username);
        client.send(`+ ${req.session.username} connected`);
      }
      socket.on('disconnect', () => {
        map.delete(req.session.username);
        req.session.loggedIn = false;
        req.session.save();
        for (let username of map.keys()) {
          const client:Socket = map.get(username);
          client.send(`- ${req.session.username} disconnected`);
        } 
        console.log('- ', req.session.username, 'disconnected', socket.id);
      });

      socket.on('message', (msg:string) => {
        console.log('message: ', msg);

      });

      socket.on('post', postIO);


    })

    return io;
}
