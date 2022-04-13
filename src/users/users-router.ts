import { Router } from "express";
import { list as listUsers, UserType } from "./users-model";

const router = Router();

router.get('/', (req, res) => {
    listUsers().then((users:UserType[]) => {
        res.json(users.map(({ username }:{ username:string }) => username));
    });
});


export default router;
