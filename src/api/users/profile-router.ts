import { Router } from 'express';
import Profiles, { ProfileType } from './profile-model';
const router = Router();

router.get('/', async (req:any, res) => {
    let {decodedToken} = req;
    const username = decodedToken?.username;
    if(!username) {
        return res.status(404).send('legit session required.')
    }
    const profile = await Profiles.findByUsername(username);
    return res.status(200).json(profile);
});


router.put('/', async (req:any, res) => {
    let profile:ProfileType|undefined;
    let {decodedToken} = req;
    const username = decodedToken?.username;

    if (!username) return res.status(403).json({error: 'user undefined'});
    try {
        profile = await Profiles.byId(decodedToken.subject);
    } catch (e) {
        console.log('error, ', e)
        profile = undefined;
        return res.status(404).json({error: e});
    }
    let data = req.body;
    let id:number = profile?.id||0;
    if (id > 0){
        delete data["id"]; // no sneaky updates
        let result = await Profiles.update(id, data);
        res.status(200).json(result);
    } else {
        console.log('error', profile)
        res.status(404);
    }
})

router.get('/user/:username', async (req:any, res) => {
    let { decodedToken } = req;
    const requestedBy = decodedToken?.username;
    let username = req.params.username;
    let profile = await Profiles.findByUsername(username);
    if (requestedBy === username) {
        res.json(profile);
    } else {
        let {id, user_id, config,...rest } = profile;
        res.json(rest);
    }
})

export default router;
