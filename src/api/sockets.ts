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
  logger.debug('configure sockets')
  io.use(handleAuth);

  io.on('connection', function (socket: Socket) {
    logger.info(socket.data.username, '🔌', socket.id);
    if (!socket.data.decodedToken) {
      logger.info('missing authority token')
      return io.handleAuth();
    }
    registerFeedHandler(io, socket);
    registerPostHandler(io, socket);
    registerSocialHandler(io, socket);
    registerUserHandler(io, socket);
    registerExtraHandlers(io, socket);

    socket.broadcast.emit("message", `+ ${socket.data.username}`);

    socket.on('disconnect', () => {
      socket.broadcast.emit("message", `- ${socket.data.username}`);
      logger.info('- ', socket.id, 'disconnected');
      socket.disconnect();
    });

  })

  return io;
}
