import { Router } from "express";
import Users, {UserType} from './users-model';
import { paginate, Paginated } from '../common/util';

const router = Router();

router.get('/', (req, res) => {
    Users.list().then((users:UserType[]) => {
        res.json(users.map(({ username }:{ username:string }) => username));
    });
});

router.get('/with-profiles', paginate((Users.withProfiles)), async (req:any, res) => {
    const paginatedResult: Paginated = req.paginatedResult;
    return res.status(200).json(paginatedResult);
});

export default router;
