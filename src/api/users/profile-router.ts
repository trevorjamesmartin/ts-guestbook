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
    let { name, avatar, email, dob } = req.body;
    let id:number = Number(decodedToken.subject);
    if (id > 0){
        let result = await Profiles.update(id, 
            { name, avatar, email, dob 
        });
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
