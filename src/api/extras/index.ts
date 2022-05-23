import userMap from '../common/maps';

export default (io:any, socket:any) => {
  const getThread = (token:string, thread_id:number) => {
      console.log('get Thread:', thread_id, token);
  }

  socket.on("api:post", getThread);
  socket.on('message', (msg:string) => {
    console.log('message: ', msg);

  });
  
  socket.on('log:data', () => {
    console.log(socket.data)
  })

  socket.on('log:map', (named:string) => {
    console.log(userMap.getUser(named));
  })

  socket.on('log:maps', () => {
    console.log(userMap)
  })

  socket.on('chat', (...args: any[]) => {
    console.log("CHAT")
    // console.log(args)
    socket.emit('chat', args)
  });

  socket.on('find:map', () => {
    // userMap.
    console.log('find map using socket.id, ', socket.id);
    console.log(userMap.withSocketId(socket.id));
  })

  socket.on("ping", (count:any) => {
    console.log("PONG", count);
  })
}

