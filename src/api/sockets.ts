import { Response } from 'express';
import { Socket } from 'socket.io';
// io API handlers
import handleAuth from './auth';
import registerPostHandler from './posts';
import registerFeedHandler from './feed';
import registerSocialHandler from './social';
import registerUserHandler from './users';
import registerExtraHandlers from './extras';
import logger from './common/logger';

export default function (io: any) {
  logger.debug('⚙ sockets')
  io.use(handleAuth); // 1. authorize

  io.use((socket: Socket, next: any) => {
    // 2. join
    const { username } = socket.data.decodedToken;
    if (username) {
      socket.join("online-users");
      logger.info(`${username} joined online-users`);
    }
    next();
  });

  function inRoom(room:string) {
    const rooms = io.of("/").adapter.rooms;
    let result = [];
    try {
      for (let u of rooms.get(room)) {
        let i = io.sockets.sockets.get(u);
        if (i.data.username) {
          result.push(i.data.username);
        } else {
          logger.error(`room ${room} is possibly corrupt`)
        }
      }
    } catch {
      return [];
    }
    return [...new Set(result)]
  }

  io.on('connection', function (socket: Socket) {
    logger.info(socket.data.username, '🔌', socket.id);

    if (!socket.data.decodedToken) {
      logger.info('authority required')
      socket.disconnect();
      return
    }

    // 3. register handlers

    registerFeedHandler(io, socket);
    registerPostHandler(io, socket);
    registerSocialHandler(io, socket);
    registerUserHandler(io, socket);
    registerExtraHandlers(io, socket);

    socket.to("online-users").emit(
      'joined:room', "online-users", socket.data.username
    );
    // send list of online users
    socket.to("online-users").emit("userlist", inRoom('online-users'));


    socket.on("userlist", () => {
      socket.emit("userlist", inRoom('online-users'));
    })

    socket.on('disconnect', () => {
      socket.to("online-users").emit(
        'departed:room', "online-users", socket.data.username
      );
      socket.to("online-users").emit("userlist", inRoom('online-users'));

      socket.broadcast.emit("message", `- ${socket.data.username}`);
      logger.info('- ', socket.id, 'disconnected');
      socket.disconnect();
    });

    socket.on('subscribe:room', (room:string) => {
      logger.debug(socket.data.username + "subscribe " + room)
      socket.to(room).emit("userlist", inRoom('online-users'));
      socket.join(room);
    });

    socket.on('unsubscribe:room', (room:string) => {
      logger.debug(socket.data.username + "unsubscribe " + room)
      socket.to(room).emit("userlist", inRoom('online-users'));
      socket.leave(room)
    });

  });

  return io;
}
