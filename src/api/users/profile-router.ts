import { Router } from 'express';
import Profiles, { ProfileType } from './profile-model';
const router = Router();

router.get('/', async (req, res) => {
    const username = req.session.username;
    if(!username) {
        return res.status(404).send('legit session required.')
    }
    const profile = await Profiles.findByUsername(username);
    return res.status(200).json(profile);
});


router.put('/', async (req, res) => {
    let profile:ProfileType|undefined;
    if (!req.session.username) return res.status(403).json({error: 'user undefined'});
    try {
        profile = await Profiles.findByUsername(req.session.username);
    } catch (e) {
        console.log('error, ', e)
        profile = undefined;
        return res.status(404).json({error: e});
    }
    // console.log({profile})
    let data = req.body;
    let id:number = profile?.id||0;
    if (id > 0){
        let result = await Profiles.update(id, data);
        res.status(200).json(result);
    } else {
        console.log('error', profile)
        res.status(404);
    }
})

router.get('/user/:username', async (req,res) => {
    let username = req.params.username;
    let profile = await Profiles.findByUsername(username);
    if (req.session.username === username) {
        res.json(profile);
    } else {
        let {name, avatar, email} = profile;
        res.json({ username, name, avatar, email });
    }
})

export default router;
