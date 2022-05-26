import feedRouter from './feed-router';
import { mainFeed } from "./feed-model";
import { getPage } from '../common/util';
import logger from '../common/logger';
export { feedRouter }

// *** io -> API ***
const GET_FEED = "api:feed"; // eq to GET /api/feed
// *** API -> io ***
const RETURN_FEED = "api:feed-content"

export default (io: any, socket: any) => {
  let decodedToken:any = socket.data.decodedToken;
  const getFeed = (params: any) => {
    let { page, limit } = params
    logger.debug(GET_FEED);
    getPage(decodedToken, mainFeed, { page: page ? Number(page) : 1, limit: limit ? limit : 4, sortOrder: 'asc' })
      .then(result => {
        let page = result.pages[0];
        if (!page?.error) {
          socket.emit(RETURN_FEED, result);
        } else {
          let {event, ...args} = page.response;
          socket.emit(event, args);
        }
      })
      .catch(logger.error)
  }

  socket.on(GET_FEED, getFeed);

}