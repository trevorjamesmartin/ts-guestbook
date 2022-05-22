import bcrypt from 'bcryptjs';
import Users, {UserType} from '../users/users-model';
import { Router } from 'express';
import { v4 } from 'uuid';
import { generateToken } from './restricted-middleware';

import userMap from '../common/maps';

// const authMap = new Map();

// export {
//     authMap
// };

const router = Router();
// export const readMap = (username:string) => authMap.get(username)

router.get('/', (req, res) => {
    res.status(200).send("?");
})

router.post('/register', async (req, res) => {
    const password:string|undefined = req.body.password
        ? String(bcrypt.hashSync(req.body.password, 13))
        : undefined;
    const username:string = req.body.username ? req.body.username : undefined;
    const formError = [username, password].includes(undefined);
    if (formError) {
        return res.status(400).json({error: "form error"});
    }
    try {
        let saved = await Users.add({username, password});
        return res.status(201).json(saved);
    } catch (error) {
        return res.status(500).json(error);
    }
});

router.post('/login', async (req, res) => {
    const message = 'invalid username or password';
    if (!(req.body.password?.length > 0 && req.body.username?.length > 0)) {
        return res.status(400).json({ message });
    }
    let user:UserType|undefined = await Users.findBy({ username: req.body.username }).first();
    if (!user) {
        return res.status(404).json({ message });
    }
    if (bcrypt.compareSync(req.body.password, user.password)) {
        const token = generateToken(user);
        const uid = v4();
        req.session.userId = uid;
        req.session.username = user.username;
        req.session.loggedIn = true;
        req.session.save();
        userMap.addUser({
            username: user.username,
            token, uid, loggedIn: true
        });
        return res.status(200).json({
            message: 'welcome',
            username: user.username,
            token, // authorization
            uid // socket id
        });
    }
    return res.status(400).json({ message });
});

router.delete('/logout', (req, res) => {
    let username = req.session.username;
    let space:any;
    
    if (username) {
        space = userMap.getUser(username);
    }
    
    if (username){
        console.log(`${username} logged out.`);
    }
    if (space) {
        console.log(space);
    }
    req.session.destroy(function() {
        res.send({result: 'OK', message: 'Logged out'});
    });
})

export default router;
