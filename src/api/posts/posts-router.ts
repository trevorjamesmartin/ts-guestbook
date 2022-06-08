import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Posts from './posts-model';
import logger from '../common/logger';
import  { PostType, PostedMessage } from '../common/types';
const router = Router();


/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *           description: what's happening?
 *           example: frisbee golf with Morpheus today?
 */


/**
 * @swagger
 * 
 * /posts:
 * 
 *  get:
 *    summary: your posts
 *    tags:
 *      - Posts
 *    responses:
 *      '200':
 *        description: 'Will send `Authenticated`'
 *      '403': 
 *        description: 'You do not have necessary permissions for the resource'
 */
router.get('/', async (req: any, res: Response) => {
    let { decodedToken } = req;
    const username = decodedToken?.username;
    if (!username) {
        return res.status(404).send('legit session required.')
    }
    const posts = await Posts.findByUsername(username);
    return res.status(200).json(posts);
});

/**
 * @swagger
 *
 * /posts:
 *   post:
 *     summary: create a new post
 *     tags:
 *       - Posts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: ok, created
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.post('/',
    body('content').isString(),
    body('content').isLength({ max: 254 }),
    async (req: any, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let { decodedToken } = req;
        const { username, subject } = decodedToken;
        if (!username || !subject) {
            logger.debug("ERROR", { username, subject })
            return;
        }
        let { content }: Partial<PostType> = req.body;
        if (!content) {
            let errorMessage = "ERROR: missing content."
            logger.debug(errorMessage);
            return res.status(400).send(errorMessage);
        }
        try {
            let post = await Posts.add({
                author_id: subject,
                // tags, title, 
                content
            }, 0, 0);
            return res.status(200).json(post);
        } catch (error) {
            logger.debug(error);
            return res.status(500).json(error);
        }
    });


/**
 * @swagger
 *
 * /posts/id/{id}:
 *   put:
 *     summary: edit post
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Id of post to edit/update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: ok, created
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.put('/id/:id',
    body('content').isString(),
    body('content').isLength({ max: 254 }),
    async (req: any, res) => {
        // todo : add validation to other routes
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let str_id = req.params.id;
        let { decodedToken } = req;
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
        let data: Partial<PostType> = req.body;
        delete data["id"];
        let result = await Posts.update(id, data);
        return res.status(200).json(result);
    });
/**
 * @swagger
 *
 * /posts/reply/{id}:
 *   post:
 *     summary: reply to post
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Id of Original Post
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: ok, created
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.post('/reply/:id',
    body('content').isString(),
    body('content').isLength({ max: 254 }),
    async (req: any, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let id = req.params.id;
        let { decodedToken } = req;
        const { username, subject } = decodedToken;

        if (!username || !subject) {
            logger.debug("ERROR", { username, subject })
            return;
        }

        let { content } = req.body;
        if (!content) {
            let errorMessage = "ERROR: missing content."
            logger.debug(errorMessage);
            return res.status(400).send(errorMessage);
        }
        let result: PostedMessage = await Posts.replyTo(id, req.body, subject);
        return res.status(201).json(result);
    });

/**
 * @swagger
 * 
 * /posts/thread/{id}:
 * 
 *  get:
 *    summary: list replies
 *    tags:
 *      - Posts
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Id of Original Post
 *        schema:
 *          type: integer
 *    responses:
 *      '200':
 *        description: 'Will send `Authenticated`'
 *      '403': 
 *        description: 'You do not have necessary permissions for the resource'
 */
router.get('/thread/:id', async (req: any, res) => {
    let id = req.params.id;
    let thread_id = Number(id);
    let { decodedToken } = req;
    const { username, subject } = decodedToken;
    if (!username || !subject || !thread_id) {
        logger.debug("ERROR", { username, subject })
        return res.status(404).json([]);
    }
    let result: any = await Posts.findByThread(thread_id);
    return res.status(200).json(result);
})

export default router;