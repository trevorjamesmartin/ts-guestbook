import bcrypt from 'bcryptjs';
import Users, {UserType} from '../users/users-model';
import Profiles, {ProfileType} from '../users/profile-model';
import { Router } from 'express';
import {v4} from 'uuid';

const map = new Map();

const router = Router();

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
        let profile = await Profiles.addByUsername(username);
        return res.status(201).json({...saved, profile });
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
    const id = v4(); // create new unique session-id
    if (bcrypt.compareSync(req.body.password, user.password)) {
        req.session.userId = id;
        req.session.username = user.username;
        req.session.loggedIn = true;
        req.session.save();
        return res.status(200).json({ message: 'welcome', username: user.username })
    } 
    return res.status(400).json({ message });
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
