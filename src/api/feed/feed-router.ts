import { Router } from "express";
import { paginatedWithToken, Paginated } from '../../util';
import feedModel from "./feed-model";
const router = Router();

router.get('/', paginatedWithToken(feedModel.mainFeed), (req: any, res: any) => {
    const paginatedResult:Paginated = req.paginatedResult;
    return res.status(200).json(paginatedResult);
});

export default router;
