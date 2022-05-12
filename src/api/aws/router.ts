import { Router } from 'express';
import { generateSignedURL } from './s3-model';
const router = Router();


router.get('/sign-s3', async (req, res) => {
  let fileName = req.query['file-name'];
  let fileType = req.query['file-type'];
  if (typeof fileName !== "string" || typeof fileType !== "string") {
    return res.status(400).send('check your params');
  }
  let signedURL = await generateSignedURL(fileName, fileType);
  res.status(200).json({signedURL});
});

export default router;

