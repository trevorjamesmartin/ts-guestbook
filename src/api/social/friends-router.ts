import { Router } from "express";
import connectModel from "./connect-model";
import friendsModel from "./friends-model";
/**
 * @swagger
 * tags:
 *   name: Friends
 *   description: your circle of Connections
 */

const router = Router();


/**
 * @swagger
 * 
 * /friends:
 * 
 *  get:
 *    summary: the accounts you've connected with
 *    tags: [Friends]
 *    responses:
 *      '200':
 *        description: 'Will send `Authenticated`'
 *      '403': 
 *        description: 'You do not have necessary permissions for the resource'
 */
router.get('/', async (req:any, res) => {
    let {decodedToken} = req;
    let a = await friendsModel.requestsTo(decodedToken.subject);
    let b = await friendsModel.requestsFrom(decodedToken.subject);
    return res.status(200).json([...a, ...b].filter(c => c.username !== decodedToken.username));
});


/**
 * @swagger
 * 
 * /friends/check:
 * 
 *  get:
 *    summary: pending & current Connections,
 *    tags: [Friends]
 *    responses:
 *      '200':
 *        description: 'Will send `Authenticated`'
 *      '403': 
 *        description: 'You do not have necessary permissions for the resource'
 */
router.get('/check', async (req:any, res) => {
    let {decodedToken} = req;
    let connections = await connectModel.connectedTo(decodedToken.subject);
    return res.status(200).json(connections);
});


export default router;