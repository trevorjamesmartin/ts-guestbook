import { Router } from "express";
import Users from './users-model';
import { paginate } from '../common/util';
import { Paginated, UserType } from "../common/types";
import { validateString } from '../auth/restricted-middleware'
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Account & Profile
 */
const router = Router();


/**
 * @swagger
 * 
 * /users:
 * 
 *  get:
 *    summary: list of usernames
 *    tags:
 *      - Users
 *    responses:
 *      '200':
 *        description: 'Will send `Authenticated`'
 *      '403': 
 *        description: 'You do not have necessary permissions for the resource'
 */
router.get('/', (req, res) => {
  Users.list().then((users: UserType[]) => {
    res.json(users.map(({ username }: { username: string }) => username));
  });
});

/**
 * @swagger
 * 
 * /users/with-profiles:
 * 
 *  get:
 *    summary: list of usernames w/ profiles
 *    tags:
 *      - Users
 *    parameters:
 *      - in: query
 *        name: page
 *        required: false
 *        description: Page Number
 *        schema:
 *          type: integer
 *      - in: query
 *        name: limit
 *        required: false
 *        description: Limit items per page
 *        schema:
 *          type: integer
 *    responses:
 *      '200':
 *        description: 'Will send `Authenticated`'
 *      '403': 
 *        description: 'You do not have necessary permissions for the resource'
 */
router.get('/with-profiles', paginate((Users.withProfiles)), async (req: any, res) => {
  const paginatedResult: Paginated = req.paginatedResult;
  return res.status(200).json(paginatedResult);
});

/**
 * @swagger
 * 
 * /users:
 * 
 *  delete:
 *    summary: delete your account
 *    tags: 
 *      - Users
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Login'
 *    responses:
 *      '200':
 *        description: 'Will send `Authenticated`'
 *      '403': 
 *        description: 'You do not have necessary permissions for the resource'
 */
router.delete('/', async (req: any, res): Promise<any> => {
  const { decodedToken } = req;
  const { username, password } = req.body;
  let user: UserType | undefined = await Users.findBy({ username }).first();
  if (!user) {
    return res.status(404).json({ error: "not found" });
  }
  if (!validateString(password, user.password)) {
    return res.status(403).json({ error: "bad credentials" });
  }
  if (decodedToken.username !== username || decodedToken.subject !== user.id) {
    return res.status(403).json({ error: "token mismatch. forbidden!"})
  }
  let result = await Users.remove(user);
  return res.status(200).json(result);
});

export default router;
