import bcrypt from 'bcryptjs';
import { findBy, add, UserType } from '../users/users-model';
import { Router } from 'express';
import {v4} from 'uuid';

const map = new Map();

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

router.post('/login', (req, res) => {
    req.body.password &&
    req.body.username &&
    req.body.username.length > 0 &&
    findBy({ username: req.body.username })
    .first()
    .then((user:UserType) => {
        const id = v4(); // create new unique session-id
        if (bcrypt.compareSync(req.body.password, user.password)) {
            req.session.userId = id;
            req.session.username = user.username;
            req.session.loggedIn = true;
            req.session.save();
            res.status(200).json({ message: 'welcome', username: user.username })
        }
    })
});

router.delete('/logout', (req, res) => {
    const ws = map.get(req.session.userId);
    console.log(`${req.session.username} logged out.`);
    req.session.destroy(function() {
        if (ws) ws.close();
        res.send({result: 'OK', message: 'Logged out'});
    })
})

export default router;
