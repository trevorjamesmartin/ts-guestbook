import {Router} from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.send('Hello trusted client, thanks for including a whitelisted Host header.')
});

export default router;
