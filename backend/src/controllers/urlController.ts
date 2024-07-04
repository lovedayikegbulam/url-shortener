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

const shortenUrl = async (req: Request, res: Response): Promise<Response> => {
  const { longUrl, customUrl } = req.body;

  if (!isValidUrl(longUrl)) {
    return res.status(400).send('Invalid URL');
  }

  try {
    const url = await createShortUrl(longUrl, customUrl);
    return res.json({ shortUrl: url.shortUrl });
  } catch (err) {
    return res.status(500).send('Error creating shortened URL');
  }
};

const redirectUrl = async (req: Request, res: Response): Promise<void> => {
  const { shortUrl } = req.params;

  try {
    const longUrl = await getLongUrl(shortUrl);
    if (longUrl) {
      await incrementClick(shortUrl);
      res.redirect(longUrl);
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
    return res.json({ qrCodeUrl });
  } catch (err) {
    return res.status(500).send('Error generating QR code');
  }
};

const getLinkAnalytics = async (req: Request, res: Response): Promise<Response> => {

  const { shortUrl } = req.params;

  try {
    const analytics = await getAnalytics(shortUrl);
    return res.json(analytics);
  } catch (err) {
    return res.status(500).send('Error retrieving link analytics');
  }
};


const getLinkHistory = async (req: Request, res: Response) => {
  try {
    const urls = await getHistory();
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
