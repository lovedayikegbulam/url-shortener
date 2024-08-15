import { Request, Response } from 'express';
import {
  createShortUrl,
  getLongUrl,
  incrementClick,
  generateQrCode,
  getAnalytics,
  getHistory,
} from '../services/urlService';
import { isValidUrl } from '../utils/validateUrl';
// import { Request, Response } from '../middlewares/auth';
import CONFIG from '../config/config';

const domainName = CONFIG.DOMAIN_NAME || "http://localhost:3000/";



const shortenUrl = async (req: Request, res: Response): Promise<Response> => {
  const { longUrl, customUrl } = req.body;
  const userId = req.user?.id;

  if (!isValidUrl(longUrl)) {
    return res.status(400).send('Invalid URL');
  }

  try {
    const url = await createShortUrl(longUrl, customUrl, userId); // Pass the userId
    return res.status(200).json({ shortUrl: url.shortUrl });
  } catch (err) {
    console.error(err);
    if ((err as Error).message === 'Custom URL already exists') {
      return res.status(400).json({ message: (err as Error).message });
    }
    return res.status(500).send('Error creating shortened URL');
  }
};

const redirectUrl = async (req: Request, res: Response): Promise<void> => {

  const { id } = req.params;

  const shortUrl = `${domainName}${id}`

  try {
    const longUrl = await getLongUrl(shortUrl);
    if (longUrl) {
      await incrementClick(shortUrl);
      res.status(200).redirect(longUrl);
    } else {
      res.status(404).send('URL not found');
    }
  } catch (err) {
    res.status(500).send('Error redirecting URL');
  }
};

const getQrCode = async (req: Request, res: Response): Promise<Response> => {
  const { shortUrl } = req.body;

  try {
    const qrCodeUrl = await generateQrCode(shortUrl);
    return res.status(200).json({ qrCodeUrl });
  } catch (err) {
    return res.status(500).send('Error generating QR code');
  }
};

const getLinkAnalytics = async (req: Request, res: Response): Promise<Response> => {

  const { shortUrl } = req.body;

  try {
    const analytics = await getAnalytics(shortUrl); 
    return res.status(200).json(analytics);
  } catch (err) {
    return res.status(500).send('Error retrieving link analytics');
  }
};

const getLinkHistory = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const urls = await getHistory(userId); // Pass the userId
    if (urls.length === 0) {
      return res.status(404).json({ message: 'No URLs found' });
    }
    res.status(200).json(urls);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export {
  shortenUrl,
  redirectUrl,
  getQrCode,
  getLinkAnalytics,
  getLinkHistory,
};
