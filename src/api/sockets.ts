import { Request, Response, NextFunction } from 'express';
import { Socket } from 'socket.io';
import { sessionParser } from './configure';
// import { authMap } from './auth/auth-router';
import userMap from './common/maps';
// io API handlers
import registerPostHandler from './posts';
import registerFeedHandler from './feed';
import registerSocialHandler from './social';
import registerUserHandler from './users';
import registerAuthHandler from './auth';
import registerExtraHandlers from './extras';

interface TokenSession {
  token: any;
  session: any;
  res: Response;
}

const socketMap = new Map();
export {
  socketMap
}
export default function (io: any) {
  // socket.io
  io.use((socket: Socket, next: NextFunction) => {
    let req = socket.request as Request & TokenSession;
    let res = req.res as Response;
    console.log('-> session parser')
    sessionParser(req as Request, res, next as NextFunction);
  });

  // io.use((socket: Socket, next: NextFunction) => {
  //   let req = socket.request as Request & TokenSession;
  //   let res = req.res as Response;
  //   console.log('-> next middleware');
  //   next()
  // })


  io.on('connection', function (socket: Socket) {
    const request = socket.request as Request;
    const session = request.session;
    let r;
    if (session.username) {
      r = userMap.getUser(session.username);
    }
    if (r?.token) {
      // updated after login
      socket.data.token = r.token;
      socket.data.username = r.username;
      socket.data.uid = r.uid;
      socket.data.loggedIn = true;
      r.updateSocket(socket); // add socket to UserSpace
      session.loggedIn = true;
      session.save();
    }
    // console.log({ checkMap: r });

    registerAuthHandler(io, socket);
    registerFeedHandler(io, socket);
    registerPostHandler(io, socket);
    registerSocialHandler(io, socket);
    registerUserHandler(io, socket);
    registerExtraHandlers(io, socket);

    console.log('+ connected', socket.id);
    socket.broadcast.emit("message", `+ connected`);

    socket.on('disconnect', () => {
      session.loggedIn = false;
      session.save();
      socket.broadcast.emit("message", `${socket.id} - disconnected`);
      console.log('- ', socket.id, 'disconnected');
    });

  })

  return io;
}
