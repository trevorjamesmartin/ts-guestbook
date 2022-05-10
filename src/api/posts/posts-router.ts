import {Router} from 'express';
import Posts, {PostType, PostedMessage} from './posts-model';
import pointerModel from './pointer-model';
const router = Router();

router.get('/', async (req:any, res) => {
    let {decodedToken} = req;
    const username = decodedToken?.username;
    if(!username) {
        return res.status(404).send('legit session required.')
    }
    const posts = await Posts.findByUsername(username);
    return res.status(200).json(posts);
});


router.post('/', async (req:any, res) => {
    let {decodedToken} = req;
    const { username, subject } = decodedToken;
    if (!username || !subject) {
        console.log("ERROR", {username, subject})
        return;
    }
    let { tags, title, content }:Partial<PostType> = req.body;
    if (!content) {
        let errorMessage = "ERROR: missing content."
        console.log(errorMessage);
        return res.status(400).send(errorMessage);
    }
    try {
        let post = await Posts.add({
            author_id: subject,
            tags, title, content
        }, 0, 0);
        return res.status(200).json(post);
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.put('/id/:id', async (req:any, res) => {
    let str_id = req.params.id;
    let {decodedToken} = req;
    const my_id = decodedToken?.subject;
    if (!str_id || !my_id) {
        return res.status(404).send('id ?')
    }
    // have id, update post
    let id = Number(str_id);
    if (!(id > 0)) {
        return res.status(404).send(`id ${id} ?`);
    }
    let origin = await Posts.byId(id);
    if (origin.author_id !== my_id) {
        return res.status(200).send("you didn't author this post!")
    }
    let data:Partial<PostType> = req.body;
    delete data["id"];
    let result = await Posts.update(id, data);
    return res.status(200).json(result);
});

router.post('/reply/:id', async(req:any, res) => {
    let id = req.params.id;
    let {decodedToken} = req;
    const { username, subject } = decodedToken;
    
    if (!username || !subject) {
        console.log("ERROR", {username, subject})
        return;
    }
    let { tags, title, content } = req.body;
    if (!content) {
        let errorMessage = "ERROR: missing content."
        console.log(errorMessage);
        return res.status(400).send(errorMessage);
    }
    let result:PostedMessage = await Posts.replyTo(id, req.body, subject);
    return res.status(201).json(result);
});

router.get('/thread/:id', async (req:any, res) => {
    let id = req.params.id;
    let thread_id = Number(id);
    let {decodedToken} = req;
    const { username, subject } = decodedToken;
    if (!username || !subject || !thread_id) {
        console.log("ERROR", {username, subject})
        return res.status(404).json([]);
    }
    let result:any = await Posts.findByThread(thread_id);
    return res.status(200).json(result);
})

export default router;