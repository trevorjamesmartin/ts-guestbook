import { Router } from "express";
import Connections, {RequestConnect} from './connect-model';
import Profiles from '../users/profile-model';
/**
 * @swagger
 * components:
 *   schemas:
 *     Username:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: username of request
 *           example: morpheus
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ConnectId:
 *       type: object
 *       properties:
 *         connect_id:
 *           type: integer
 *           description: connect request id
 *           example: 1
 */

/**
 * @swagger
 * tags:
 *   name: Connect
 *   description: Create Connections
 */

const router = Router();

router.get('/', async (req:any, res) => {
    let {decodedToken} = req;
    const user_id = decodedToken.subject;
    const r1 = await Connections.findBy({ to_id: user_id });
    res.status(200).json(r1);
});


/**
 * @swagger
 *
 * /connect:
 *   post:
 *     summary: request connection
 *     tags: [Connect]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Username'
 *     responses:
 *       200:
 *         description: ok, created connection request
 */
router.post('/', async (req:any, res) => {
    let {decodedToken} = req;
    let { username } = req.body;
    console.log(req.body)
    if (!username) {
        return res.status(404).json({message: 'no username provided'})
    }

    let profile = await Profiles.findByUsername(username);
    const from_id = decodedToken.subject;
    const to_id = profile.user_id;
    const existing_request = await Connections.findBy({ from_id, to_id });
    if (existing_request.length > 0) {
        return res.status(200).json(existing_request[0]);
    }
    const new_request = await Connections.createRequest(from_id, to_id, true);
    return res.status(201).json(new_request);    
});
/**
 * @swagger
 *
 * /connect/accept:
 *   post:
 *     summary: accept connection
 *     tags: [Connect]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConnectId'
 *     responses:
 *       200:
 *         description: ok, connected
 */ 
router.post('/accept', async(req:any, res) => {
    let {decodedToken} = req;
    let { connect_id } = req.body;
    if (!connect_id) {
        return res.status(404).json({message: 'no connect_id provided'})
    }
    let existing_request = await Connections.byId(connect_id);
    if (decodedToken.subject === existing_request.to_id) {
        let result = await Connections.acceptRequest(connect_id, decodedToken.subject);
        return res.status(200).json(result)
    }
})
/**
 * @swagger
 *
 * /connect/reject:
 *   post:
 *     summary: reject connection
 *     tags: [Connect]
 *     description: Reject a request to connect
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConnectId'
 *     responses:
 *       200:
 *         description: Updated
 */
router.post('/reject', async(req:any, res) => {
    let {decodedToken} = req;
    let { connect_id } = req.body;
    if (!connect_id) {
        return res.status(404).json({message: 'no connect_id provided'})
    }
    let existing_request = await Connections.byId(connect_id);
    if (decodedToken.subject === existing_request.to_id) {
        let result = await Connections.rejectRequest(connect_id, decodedToken.subject);
        return res.status(200).json(result);
    }
})

export default router;
