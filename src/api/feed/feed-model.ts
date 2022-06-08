import postsModel from "../posts/posts-model";
import connectModel from "../social/connect-model";
import logger from '../common/logger';
import { ModelOptions, Food, TokenError, DecodedToken } from "../common/types";

export {
    mainFeed
}

async function mainFeed(decodedToken: DecodedToken, __?: ModelOptions): Promise<Food | TokenError[]> {
    let author_id = decodedToken?.subject;
    if (!author_id) {
        // this can happen due to a stale session,
        // a reconnected socket,
        // or (more often) when a server loses it's memory of UserSpace. 
        logger.info('ERROR DECODING TOKEN - mainFeed');
        return [{
            error: "ERROR DECODING TOKEN - mainFeed",
            response: { event: "token?" }
        }];
        // the response, handled upstream, need only enough information to fix the error.
    }
    // setup 1st feed filter
    let options: any = {
        author_id, // self authored
        thread_id: null // main stream
    }
    // read the database
    let myMainFeed: any[] = (await postsModel.findBy(options));

    // repeat for each subscription
    for (let friend of (await connectModel.connectedTo(decodedToken.subject)).friends) {
        let { id: author_id, username, avatar, name } = friend;
        options = {
            author_id, // friend authored
            thread_id: null // main stream
        };
        let meal: Food[] = [...(await postsModel.findBy(options)).map(post => ({
            username, avatar, name, ...post
        }))];
        myMainFeed = [...myMainFeed, ...meal]; // collect
    }
    return myMainFeed
}
