import { Router } from 'express';
import { validateString, encryptString } from '../auth/restricted-middleware';
import Users, { yourSettings, updatePassword } from './users-model';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Password:
 *       type: object
 *       properties:
 *         old_password:
 *           type: string
 *           description: old password
 *         new_password:
 *           type: string
 *           description: password
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Settings:
 *       type: object
 *       properties:
 *         directory_layout:
 *           type: string
 *           description: view style
 *           example: carousel
 */



/**
 * @swagger
 * 
 * /settings:
 * 
 *  get:
 *    tags: [Settings]
 *    responses:
 *      '200':
 *        description: 'Will send `Authenticated`'
 *      '403': 
 *        description: 'You do not have necessary permissions for the resource'
 */
router.get('/', async (req: any, res) => {
  let { decodedToken } = req;
  const username = decodedToken?.username;
  const user_id = decodedToken.subject;
  if (!username) return res.status(403).json({ error: 'user undefined' });
  let result = await yourSettings.get(user_id);
  res.status(200).json(result);
});

/**
 * @swagger
 *
 * /settings:
 *   put:
 *     summary: update your settings
 *     tags:
 *       - Settings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Settings'
 *     responses:
 *       200:
 *         description: ok, updated
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.put('/', async (req: any, res) => {
  let { decodedToken } = req;
  const username = decodedToken?.username;
  const user_id = decodedToken.subject;
  const data = req.body;
  if (!username) return res.status(403).json({ error: 'user undefined' });
  let result = await yourSettings.set(user_id, data);
  res.status(200).json(result);
});


/**
 * @swagger
 *
 * /settings/password:
 *   post:
 *     summary: change password
 *     tags: [Settings,Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Password'
 *     responses:
 *       200:
 *         description: ok, changed
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.post('/password', async (req: any, res) => {
  let { decodedToken } = req;
  console.log(decodedToken)
  const username = decodedToken?.username;
  const user_id = decodedToken.subject;
  if (!username || !user_id) return res.status(403).json({ error: 'user undefined' });
  const { old_password, new_password } = req.body;
  if (!old_password || !new_password) return res.status(406).json({ error: 'body incomplete' });
  const u = await Users.findBy({ username, id: user_id }).first();
  const password: string | undefined = encryptString(new_password);
  if (!password) {
    return res.status(418).json({ error: 'encryption error' });
  }
  const valid = validateString(old_password, u.password);
  if (valid) {
    const result = await updatePassword(user_id, password);
    return res.status(200).json(result);
  }
  res.status(401).json({ error: "what do you think you're doing ?" });
});

export default router;
