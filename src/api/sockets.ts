import { Response } from 'express';
import { Socket } from 'socket.io';
// io API handlers
import handleAuth from './auth';
import registerPostHandler from './posts';
import registerFeedHandler from './feed';
import registerSocialHandler from './social';
import registerUserHandler from './users';
import registerExtraHandlers from './extras';

export default function (io: any) {
  io.use(handleAuth);

  io.on('connection', function (socket: Socket) {
    console.log(socket.data.username, '🔌', socket.id);

    registerFeedHandler(io, socket);
    registerPostHandler(io, socket);
    registerSocialHandler(io, socket);
    registerUserHandler(io, socket);
    registerExtraHandlers(io, socket);

    socket.broadcast.emit("message", `+ ${socket.data.username}`);

    socket.on('disconnect', () => {
      socket.broadcast.emit("message", `- ${socket.data.username}`);
      console.log('- ', socket.id, 'disconnected');
      socket.disconnect();
    });

  })

  return io;
}
