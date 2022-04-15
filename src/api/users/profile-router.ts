import { Router } from 'express';
import Users, { UserType } from './users-model';
import Profiles, { ProfileType } from './profile-model';

const router = Router();

router.get('/', async (req, res) => {
    try {
        let u = await Users.findBy({ username: req.session.username });
        let user:UserType = u[0];
        let p = await Profiles.findBy({ user_id: user.id });
        let profile:ProfileType = p[0];
        res.json({ username: req.session.username, ...profile });
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
});

router.get('/user/:username', async (req, res) => {
    let username = req.params.username;
    let user:UserType = await Users.findBy({ username }).first();
    if (!user?.id) return res.status(404).json({error: 'not found'});
    let profile:ProfileType = await Profiles.findBy({ user_id: user.id }).first();
    if (req.session.username === username) {
        res.json({ username: req.session.username, ...profile });
    } else {
        let { name, avatar, email } = profile;        
        res.json({ username, name, avatar, email });
    }
});

export default router;
