import { Router } from "express";
import Users from './users-model';
import { paginate } from '../common/util';
import { Paginated, UserType } from "../common/types";
/**
 * @swagger
 * tags:
 *   name: User's
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
 *      - User's
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
 *      - User's
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

export default router;
