import postsRouter from './posts-router';
import postsModel from './posts-model';
import userMap from '../common/maps';
import { verifyToken } from '../auth/restricted-middleware';
// import { getPage } from '../common/util';
import logger from '../common/logger';
export { postsRouter }

// *** io -> API ***
const GET_THREAD = "api:thread"; // eq GET /api/posts/:id
const POST_REPLY = "api:reply"; //  eq POST api/posts/reply/:id
// *** API -> io ***
const RETURN_THREAD = GET_THREAD;
const UPDATED_THREAD = "thread:updated";

export default (io: any, socket: any) => {
  let user = userMap.withSocketId(socket.id);
  let token = user?.token;
  let decodedToken: any = undefined;
  if (token) {
    decodedToken = verifyToken(token);
  }

  const getThread = (params: any) => {
    const { id } = params;
    logger.debug('getThread', params)
    // getPage(decodedToken, postsModel, { id: Number(id) })
    logger.debug(GET_THREAD, id);
    // not paginating threads
    if (!id) {
      logger.debug("id REQUIRED")
      return
    }

    postsModel.findByThread(Number(id))
      .then(result => {
        // logger.debug(result);
        socket.emit(RETURN_THREAD, result);
      })
      .catch(logger.debug)
  }

  const postReply = (params: any) => {
    if (!params?.content || !params?.id) {
      return;
    }
    console.log(socket.data)
    console.log(params)
    let id = Number(params.id);
    let author_id = socket.data.decodedToken.subject;
    let body = { content: params.content };
    postsModel.replyTo(id, body, author_id)
    .then((result) => {
      let [data]:any = result
      console.log(data?.id)
      io.to(`/thread/${params.id}`).emit(UPDATED_THREAD, params.id, data?.id)
    }).catch((reason) => logger.error(reason));
  }

  socket.on(GET_THREAD, getThread);

  socket.on(POST_REPLY, postReply);

}