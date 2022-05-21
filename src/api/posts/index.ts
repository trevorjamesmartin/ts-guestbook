import postsRouter from './posts-router';

export { postsRouter }


export default (io:any, socket:any) => {
  const getThread = (token:string, thread_id:number) => {
      console.log('get Thread:', thread_id, token);
  }

  socket.on("api:post", getThread);

}