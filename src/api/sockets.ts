import express from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { sessionParser } from './configure';
const map = new Map();
// (IO)
export default function (io: any) {
    // socket.io
    io.use((socket: { request: express.Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>; }, next: express.NextFunction) => {
      let req = socket.request as express.Request;
      let res = req.res as express.Response;
      sessionParser(req, res, next as express.NextFunction);
    });
  
    io.on('connection', function (socket: { request: express.Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>; on: (arg0: string, arg1: () => void) => void; id: any; }) {
      const req = socket.request as express.Request;
      req.session.loggedIn = true;
      req.session.save();
      map.set(req.session.username, socket);
      
      socket.on('disconnect', () => {
        map.delete(req.session.username);
        req.session.loggedIn = false;
        req.session.save();
        console.log(req.session.username, 'disconnected', socket.id);
      });
    })
  
    io.on('message', function (message: any) {
      console.log(message)
    });
    return io;
}
