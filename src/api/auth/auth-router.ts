import bcrypt from 'bcryptjs';
import Users, { UserType } from '../users/users-model';
import { Router } from 'express';
import { v4 } from 'uuid';
import { generateToken } from './restricted-middleware';

import userMap from '../common/maps';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).send("?");
})


/**
 * @swagger
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: unique username
 *           example: neo2022
 *         password:
 *           type: string
 *           description: password
 *           example: trinity
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User management and login
 */

/**
 * @swagger
 *
 * /auth/login:
 *   post:
 *     summary: login to the application
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: ok, created
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.post('/login', async (req, res) => {
  const message = 'invalid username or password';
  if (!(req.body.password?.length > 0 && req.body.username?.length > 0)) {
    return res.status(400).json({ message });
  }
  let user: UserType | undefined = await Users.findBy({ username: req.body.username }).first();
  if (!user) {
    return res.status(404).json({ message });
  }
  if (bcrypt.compareSync(req.body.password, user.password)) {
    const token = generateToken(user);
    const uid = v4();
    userMap.addUser({
      username: user.username,
      token, uid, loggedIn: true
    });
    return res.status(200).json({
      message: 'welcome',
      username: user.username,
      token,
      uid
    });
  }
  return res.status(400).json({ message });
});

router.delete('/logout', (req, res) => {
  console.log('logged out');
  res.status(200).send({ result: 'OK', message: 'Logged out' })
});

/**
 * @swagger
 *
 * /auth/register:
 *   post:
 *     summary: create a new acount
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: ok, created
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.post('/register', async (req, res) => {
  const password: string | undefined = req.body.password
    ? String(bcrypt.hashSync(req.body.password, 13))
    : undefined;
  const username: string = req.body.username ? req.body.username : undefined;
  const formError = [username, password].includes(undefined);
  if (formError) {
    return res.status(400).json({ error: "form error" });
  }
  try {
    let saved = await Users.add({ username, password });
    return res.status(201).json(saved);
  } catch (error) {
    return res.status(500).json(error);
  }
});

export default router;
