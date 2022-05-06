import { Router } from "express";
import feedModel from "./feed-model";
const router = Router();

router.get('/', async (req: any, res) => {
    let { decodedToken } = req;
    function ascending(y:any, x:any) {
        return y.id - x.id
    }
    function descending(y:any, x:any) {
        return x.id - y.id
    }
    return res.status(200).json((await feedModel.mainFeed(decodedToken)).sort(descending));
});

export default router;