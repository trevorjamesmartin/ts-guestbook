import { Router } from "express";
import { paginate, Paginated } from '../../util';
import { mainFeed } from "./feed-model";
const router = Router();

router.get('/', paginate(mainFeed), (req: any, res: any) => {
    const paginatedResult: Paginated = req.paginatedResult;
    return res.status(200).json(paginatedResult);
});

export default router;
