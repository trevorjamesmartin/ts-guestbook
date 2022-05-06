import postsModel from "../posts/posts-model";
import connectModel from "../social/connect-model";

export default {
    mainFeed
}

interface Food {
    id: number;
    author_id: number;
    title: string;
    tags: string;
    content: JSON;
    posted_at: any;
    parent_id: number;
    thread_id: number;
    created_at: any;
    username: any;
    avatar: any;
    name: any;
}

async function mainFeed(decodedToken: any) {
    let feed:any[] = (await postsModel.findByUsername(decodedToken.username));
    for (let friend of (await connectModel.connectedTo(decodedToken.subject)).friends) {
        let { username, avatar, name } = friend;
        let meal:Food[] = [...(await postsModel.findByUsername(username)).map(post => ({
            username, avatar, name, ...post
        }))];
        feed = [ ...feed, ...meal ];
    }
    return feed;
}
