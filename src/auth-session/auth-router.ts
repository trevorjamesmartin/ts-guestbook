import bcrypt from 'bcryptjs';
import { findBy, add, UserType } from '../users/users-model';
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.status(200).send("?");
})

router.post('/register', (req, res) => {
    const password:string|undefined = req.body.password
        ? String(bcrypt.hashSync(req.body.password, 13))
        : undefined;
    const username:string|undefined = req.body.username ? req.body.username : undefined;
    const formError = [username, password].includes(undefined);
    if (!formError) {
        add({ username, password })
            .then((saved:any) => {
                res.status(201).json(saved);
            })
            .catch((error:any) => {
                res.status(500).json(error);
            })
    }
});

router.post('/login', (req:any, res) => {
    req.body.password &&
    req.body.username &&
    req.body.username.length > 0 &&
    findBy({ username: req.body.username })
    .first()
    .then((user:UserType) => {
        if (bcrypt.compareSync(req.body.password, user.password)) {
            req.session.user = user.username;
            req.session.loggedIn = true;
            req.session.save();
            res.status(200).json({ message: 'welcome', username: user.username })
        }
    })
})

export default router;
