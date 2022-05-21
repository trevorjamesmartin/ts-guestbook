import { Request, Response, NextFunction } from 'express';
import { Socket } from 'socket.io';
import { sessionParser } from './auth';
// import { authMap } from './auth/auth-router';
import userMap from './common/maps';
// io REST handlers
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
    let req = socket.request as Request|TokenSession;
    let res = req.res as Response;
    console.log('-> session parser auth middleware ?')
    sessionParser(req as Request, res, next as NextFunction);
  });

  io.use((socket: Socket, next: NextFunction) => {
    console.log('-> next middleware');
    next()
  })


  io.on('connection', function (socket: Socket) {
    let r;
    const req = socket.request as Request;
    if (req.session.username) {
      r = userMap.getUser(req.session.username);
    }
    if (r?.token) {
      socket.data.token = r.token;
      socket.data.username = r.username;
      socket.data.uid = r.uid;
      socket.data.loggedIn = true;
      r.updateSocket(socket);
      req.session.loggedIn = true;
      req.session.save();
    }
    // socketMap.set(req.session.username, socket);
    console.log({ checkMap: r });

    registerAuthHandler(io, socket);
    registerFeedHandler(io, socket);
    registerPostHandler(io, socket);
    registerSocialHandler(io, socket);
    registerUserHandler(io, socket);
    registerExtraHandlers(io, socket);


    console.log('+ connected', socket.id);
    socket.broadcast.emit("message", `+ connected`);

    socket.on('disconnect', () => {
      req.session.loggedIn = false;
      req.session.save();
      socket.broadcast.emit("message", `${socket.id} - disconnected`);
      console.log('- ', socket.id, 'disconnected');
    });

  })

  return io;
}
