import userMap from '../common/maps';
import logger from '../common/logger';
export default (io:any, socket:any) => {
  const getThread = (token:string, thread_id:number) => {
      logger.debug('get Thread:', thread_id, token);
  }

  socket.on("api:post", getThread);
  socket.on('message', (msg:string) => {
    logger.debug('message: ', msg);

  });
  
  socket.on('log:data', () => {
    logger.debug(socket.data)
  })

  socket.on('log:map', (named:string) => {
    logger.debug(userMap.getUser(named));
  })

  socket.on('log:maps', () => {
    logger.debug(userMap)
  })

  socket.on('chat', (...args: any[]) => {
    logger.debug("CHAT")
    // logger.debug(args)
    socket.emit('chat', args)
  });

  socket.on('find:map', () => {
    // userMap.
    logger.debug('find map using socket.id, ', socket.id);
    logger.debug(userMap.withSocketId(socket.id));
  })

  socket.on("ping", (count:any) => {
    logger.debug("PONG", count);
  })
}

