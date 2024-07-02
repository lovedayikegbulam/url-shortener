import { Router } from 'express';
import {
  shortenUrl,
  redirectUrl,
  getQrCode,
  getLinkHistory,
} from '../controllers/urlController';

const router = Router();

router.post('/shorten', shortenUrl);
router.get('/:shortUrl', redirectUrl);
router.post('/generate-qr', getQrCode);
router.get('/history', getLinkHistory);

export default router;
