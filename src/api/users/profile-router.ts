import { Router } from 'express';
import Profiles, { ProfileType } from './profile-model';
import logger from '../common/logger';
const router = Router();
/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: describes User
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Your Name
 *           example: John Smith
 *         avatar:
 *           type: string
 *           description: url
 *           example: /user.png
 *         email:
 *           type: string
 *           description: email address
 *           example: jsmith@local.matrix
 *         dob:
 *           type: string
 *           description: date of birth
 *           example: 05/24/1979
 *  
 * */


/**
 * @swagger
 * 
 * /profile:
 * 
 *  get:
 *    summary: your profile information
 *    tags: [Profile]
 *    responses:
 *      '200':
 *        description: 'Will send `Authenticated`'
 *      '403': 
 *        description: 'You do not have necessary permissions for the resource'
 */
router.get('/', async (req:any, res) => {
    let {decodedToken} = req;
    const username = decodedToken?.username;
    if(!username) {
        return res.status(404).send('legit session required.')
    }
    const profile = await Profiles.findByUsername(username);
    return res.status(200).json(profile);
});

/**
 * @swagger
 *
 * /profile:
 *   put:
 *     summary: update your profile information
 *     tags: [Profile]
 *     description: Update your user profile
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profile'
 *     responses:
 *       200:
 *         description: Updated
 */
router.put('/', async (req:any, res) => {
    let profile:ProfileType|undefined;
    let {decodedToken} = req;
    const username = decodedToken?.username;
    if (!username) return res.status(403).json({error: 'user undefined'});
    let { name, avatar, email, dob } = req.body;
    let id:number = Number(decodedToken.subject);
    if (id > 0){
        let result = await Profiles.update(id, 
            { name, avatar, email, dob 
        });
        res.status(200).json(result);
    } else {
        logger.debug('error', profile)
        res.status(404);
    }
})

/**
 * @swagger
 * 
 * /profile/user/{username}:
 * 
 *  get:
 *    tags: [Profile]
 *    parameters:
 *      - in: path
 *        name: username
 *        required: true
 *        description: username
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: 'Will send `Authenticated`'
 *      '403': 
 *        description: 'You do not have necessary permissions for the resource'
 */
router.get('/user/:username', async (req:any, res) => {
    let { decodedToken } = req;
    const requestedBy = decodedToken?.username;
    let username = req.params.username;
    let profile = await Profiles.findByUsername(username);
    if (requestedBy === username) {
        res.json(profile);
    } else {
        let {id, user_id, config,...rest } = profile;
        res.json(rest);
    }
})

export default router;
