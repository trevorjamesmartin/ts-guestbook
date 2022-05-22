import postsModel from "../posts/posts-model";
import connectModel from "../social/connect-model";

export {
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
    let author_id = decodedToken?.subject;
    if (!author_id) {
        // TODO
        // this could happen due to a re-connected web socket.
        // 
        console.log('ERROR DECODING TOKEN - mainFeed');

        return []
    }
    // set filter
    let options:any = {
        author_id, // self authored
        thread_id: null // main stream
    }
    // read db
    let myMainFeed: any[] = (await postsModel.findBy(options));

    for (let friend of (await connectModel.connectedTo(decodedToken.subject)).friends) {        
        let { id: author_id, username, avatar, name } = friend;
        // set filter
        options = { 
            author_id, // friend authored
            thread_id: null // main stream
        };
        // read db
        let meal: Food[] = [...(await postsModel.findBy(options)).map(post => ({
            username, avatar, name, ...post
        }))];

        myMainFeed = [...myMainFeed, ...meal]; // collect
    }

    return myMainFeed
}
