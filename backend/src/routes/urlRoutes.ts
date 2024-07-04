import { Router } from 'express';
import {
  shortenUrl,
  redirectUrl,
  getQrCode,
  getLinkAnalytics,
  getLinkHistory,
} from '../controllers/urlController';

const router = Router();

router.post('/shorten', shortenUrl);
router.post('/generate-qr', getQrCode);
router.get('/analytics/:shortUrl', getLinkAnalytics);
router.get('/history', getLinkHistory);
router.get('/:shortUrl', redirectUrl);


export default router;
