import postsRouter from './posts-router';
import postsModel from './posts-model';
import userMap from '../common/maps';
import { verifyToken } from '../auth/restricted-middleware';
// import { getPage } from '../common/util';
export { postsRouter }

// *** io -> API ***
const GET_THREAD = "api:thread"; // eq to GET /api/feed
// *** API -> io ***
const RETURN_THREAD = GET_THREAD;

export default (io: any, socket: any) => {
  let user = userMap.withSocketId(socket.id);
  let token = user?.token;
  let decodedToken: any = undefined;
  if (token) {
    decodedToken = verifyToken(token);
  }

  const getThread = (params: any) => {
    const { id } = params;
    console.log('getThread', params)
    // getPage(decodedToken, postsModel, { id: Number(id) })
    console.log(GET_THREAD, id);
    // not paginating threads
    if (!id) {
      console.log("id REQUIRED")
      return
    }

    postsModel.findByThread(Number(id))
      .then(result => {
        // console.log(result);
        socket.emit(RETURN_THREAD, result);
      })
      .catch(console.log)
  }

  socket.on(GET_THREAD, getThread);

}