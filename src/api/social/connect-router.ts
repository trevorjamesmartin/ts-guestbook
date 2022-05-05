import { Router } from "express";
import Connections, {RequestConnect} from './connect-model';
import Profiles from '../users/profile-model';
const router = Router();

router.get('/', async (req:any, res) => {
    let {decodedToken} = req;
    const user_id = decodedToken.subject;
    const r1 = await Connections.findBy({ to_id: user_id });
    res.status(200).json(r1);
});

router.post('/', async (req:any, res) => {
    let {decodedToken} = req;
    let { username } = req.body;
    let profile = await Profiles.findByUsername(username);
    const from_id = decodedToken.subject;
    const to_id = profile.user_id;
    const existing_request = await Connections.findBy({ from_id, to_id });
    if (existing_request.length > 0) {
        return res.status(200).json(existing_request[0]);
    }
    const new_request = await Connections.createRequest(from_id, to_id, true);
    return res.status(201).json(new_request);    
});

router.post('/accept', async(req:any, res) => {
    let {decodedToken} = req;
    let { connect_id } = req.body;
    let existing_request = await Connections.byId(connect_id);
    if (decodedToken.subject === existing_request.to_id) {
        let result = await Connections.acceptRequest(connect_id, decodedToken.subject);
        return res.status(200).json(result)
    }
})

router.post('/reject', async(req:any, res) => {
    let {decodedToken} = req;
    let { connect_id } = req.body;
    let existing_request = await Connections.byId(connect_id);
    if (decodedToken.subject === existing_request.to_id) {
        let result = await Connections.rejectRequest(connect_id, decodedToken.subject);
        return res.status(200).json(result);
    }
})

export default router;
