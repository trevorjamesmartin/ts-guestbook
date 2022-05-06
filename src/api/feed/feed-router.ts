import { Router } from "express";
import feedModel from "./feed-model";
const router = Router();

router.get('/', async (req:any, res) => {
    let {decodedToken} = req;
    let result = await feedModel.mainFeed(decodedToken);
    return res.status(200).json(result);
});

export default router;