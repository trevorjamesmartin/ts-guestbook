import { Router } from "express";
import { paginate, Paginated } from '../common/util';
import { mainFeed } from "./feed-model";
const router = Router();

/**
 * @swagger
 * 
 * /feed:
 * 
 *  get:
 *    summary: your feed (includes your posts)
 *    tags:
 *      - Feed
 *    responses:
 *      '200':
 *        description: 'Will send `Authenticated`'
 *      '403': 
 *        description: 'You do not have necessary permissions for the resource'
 */
router.get('/', paginate(mainFeed), (req: any, res: any) => {
    const paginatedResult: Paginated = req.paginatedResult;
    return res.status(200).json(paginatedResult);
});

export default router;
