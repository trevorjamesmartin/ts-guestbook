import { Router } from "express";
import Users, {UserType} from './users-model';

const router = Router();

router.get('/', (req, res) => {
    Users.list().then((users:UserType[]) => {
        res.json(users.map(({ username }:{ username:string }) => username));
    });
});

export default router;
