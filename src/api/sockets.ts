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
  io.use(handleAuth); // 1st authorize

  io.use((socket: Socket, next: any) => {
    // 2nd join
    const { username } = socket.data.decodedToken;
    if (username) {
      socket.join("online-users");
      logger.info(`${username} joined online-users`);
    }
    next();
  });

  io.on('connection', function (socket: Socket) {
    logger.info(socket.data.username, '🔌', socket.id);
    if (!socket.data.decodedToken) {
      logger.info('missing authority token')
      return io.handleAuth();
    }

    socket.on("private message", (anotherSocketId, msg) => {
      socket.to(anotherSocketId).emit("private message", socket.id, msg);
    });

    registerFeedHandler(io, socket);
    registerPostHandler(io, socket);
    registerSocialHandler(io, socket);
    registerUserHandler(io, socket);
    registerExtraHandlers(io, socket);


    socket.to("online-users").emit(
      'joined:room', "online-users", socket.data.username
    );

    socket.on('disconnect', () => {
      socket.to("online-users").emit(
        'departed:room', "online-users", socket.data.username
      );
  
      socket.broadcast.emit("message", `- ${socket.data.username}`);
      logger.info('- ', socket.id, 'disconnected');
      socket.disconnect();
    });

  })

  return io;
}
