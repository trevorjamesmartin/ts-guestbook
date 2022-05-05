import { Router } from "express";
import connectModel from "./connect-model";
import friendsModel from "./friends-model";
const router = Router();

router.get('/', async (req:any, res) => {
    let {decodedToken} = req;
    let a = await friendsModel.requestsTo(decodedToken.subject);
    let b = await friendsModel.requestsFrom(decodedToken.subject);
    return res.status(200).json([...a, ...b].filter(c => c.username !== decodedToken.username));
});

router.get('/check', async (req:any, res) => {
    let {decodedToken} = req;
    let connections = await connectModel.connectedTo(decodedToken.subject);
    return res.status(200).json(connections);
});


export default router;