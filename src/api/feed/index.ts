import feedRouter from './feed-router';
import userMap from '../common/maps';
import { verifyToken } from '../auth/restricted-middleware';
import { mainFeed } from "./feed-model";
import { getPage } from '../common/util';

export { feedRouter }

// *** io -> API ***
const GET_FEED = "api:feed"; // eq to GET /api/feed
// *** API -> io ***
const RETURN_FEED = "api:feed-content"

export default (io: any, socket: any) => {
  let user = userMap.withSocketId(socket.id);
  let token = user?.token;
  let decodedToken: any = undefined;
  if (token) {
    decodedToken = verifyToken(token);
  }

  const getFeed = (params: any) => {
    let { page, limit } = params
    console.log(GET_FEED);
    getPage(decodedToken, mainFeed, { page: page ? Number(page) : 1, limit: limit ? limit : 4, sortOrder: 'asc' })
      .then(result => {
        socket.emit(RETURN_FEED, result);
      })
      .catch(console.log)
  }

  socket.on(GET_FEED, getFeed);

}