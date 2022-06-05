import { Router } from 'express';
import { yourSettings } from './users-model';

const router = Router();

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


export default router;
