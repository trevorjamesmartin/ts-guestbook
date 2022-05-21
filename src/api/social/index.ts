import connectRouter from './connect-router';
import friendsRouter from './friends-router';
export {
    connectRouter,
    friendsRouter
}

export default (io:any, socket:any) => {
    const getRequests = (token:string) => {
        console.log('read social requests:', token);
    }
  
    socket.on("api:requests:read", getRequests);
  
  }