import userMap from '../common/maps';
import logger from '../common/logger';
export default (io:any, socket:any) => {
  // main namespace
  const rooms = io.of("/").adapter.rooms;
  const sids = io.of("/").adapter.sids;

  function findUser(username:string) {
    let keys = io.sockets.sockets.keys()
    let result;
    for (let u of keys) {
      let i = io.sockets.sockets.get(u);
      if (i.data.username === username) {
        result = i;
        break;
      }
    }
    return result;
  }

  function inRoom(room:string) {
    let result = [];
    for (let u of rooms.get(room)) {
      let i = io.sockets.sockets.get(u);
      if (i.data.username) {
        result.push(i.data.username);
      } else {
        logger.error(`room ${room} is possibly corrupt`)
      }
    }
    return [...new Set(result)]
  }

  socket.on('log:room', (room:string) => console.log(inRoom(room)));

  socket.on('chat', (...args: any[]) => {
    socket.emit('chat', args)
  });

  socket.on("whos:online", () => {
    socket.emit("whos:online", inRoom('online-users'))
  })

  socket.on("private:message", (username:string, msg:any) => {
    const anotherUser = findUser(username);    
    if (anotherUser?.id) {
      socket.to(anotherUser.id).emit("private:message", socket.data.username, msg);
    } else {
      logger.info(`[private] ${socket.data.username} -> ${username} (NOT ONLINE)`);
      socket.emit("private:message", "[system]", `${username} is not online.`)
    }
  })

  
  // output to log

  socket.on('log:data', () => {
    logger.debug(socket.data)
  })

  socket.on('log:map', (named:string) => {
    logger.debug(userMap.getUser(named));
  })

  socket.on('log:maps', () => {
    logger.debug(userMap)
  })
  
}

