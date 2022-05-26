import { NextFunction } from 'express'
import authRouter from './auth-router';
import authMiddleware, { verifyToken } from './restricted-middleware';
import { Socket } from 'socket.io';
import logger from '../common/logger';
export {
  authRouter, authMiddleware
}

export default (socket: Socket, next: NextFunction) => {
  let token = socket.handshake.auth.token;
  let decodedToken: any = token ? verifyToken(token) : undefined;
  if (decodedToken) {
    socket.data.decodedToken = decodedToken;
    socket.data.username = decodedToken.username;
    socket.data.user_id = decodedToken.user_id;
    logger.info("🔓 [Authorized]", decodedToken.username)
    next();
  } else {
    logger.info(socket.data);
    next(new Error("[💩Authorization Failed]"));
  }
}
