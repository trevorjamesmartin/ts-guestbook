import { Router } from "express";
import Users, {UserType} from './users-model';

const router = Router();

router.get('/', (req, res) => {
    Users.list().then((users:UserType[]) => {
        res.json(users.map(({ username }:{ username:string }) => username));
    });
});

router.get('/with-profiles', async (req, res) => {
    res.status(200).json((await Users.withProfiles()));
});

export default router;
