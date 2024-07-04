import { Url, IUrl } from "../models/urlModel";
import { createHash } from "crypto";
import client from "../db/connectToRedis";
import axios from "axios";

const generateShortUrl = (longUrl: string): string => {
  const newUrl = createHash("sha256").update(longUrl).digest("base64").slice(0, 6);
  return `http://localhost:3000/${newUrl}`
};

const getCachedUrl = async (shortUrl: string): Promise<string | null> => {
  try {
    const data = await client.get(shortUrl);
    return data;
  } catch (err) {
    console.error("Error fetching from Redis", err);
    return null;
  }
};

const cacheUrl = (shortUrl: string, longUrl: string): void => {
  client.set(shortUrl, longUrl);
};

const createShortUrl = async (
  longUrl: string,
  customUrl?: string
): Promise<IUrl> => {
  const shortUrl = customUrl || generateShortUrl(longUrl);
  const url = new Url({ longUrl, shortUrl, customUrl });
  await url.save();
  cacheUrl(shortUrl, longUrl);
  return url;
};

const getLongUrl = async (shortUrl: string): Promise<string | null> => {
  const cachedUrl = await getCachedUrl(shortUrl);
  if (cachedUrl) return cachedUrl;

  const url = await Url.findOne({ shortUrl });
  if (url) {
    cacheUrl(shortUrl, url.longUrl);
    return url.longUrl;
  }
  return null;
};

const incrementClick = async (shortUrl: string): Promise<void> => {
  await Url.updateOne({ shortUrl }, { $inc: { clicks: 1 } });
};

const generateQrCode = async (shortUrl: string): Promise<string> => {
  const response = await axios.get(
    `https://api.qrserver.com/v1/create-qr-code/?data=${shortUrl}`
  );
  return response.request.res.responseUrl;
};

const getAnalytics = async (shortUrl: string): Promise<number> => {
  const urlData: IUrl | null = await Url.findOne({ shortUrl });

  if (!urlData) {
    throw new Error('URL not found');
  }

  return urlData.clicks;
};

const getHistory = async (): Promise<Partial<IUrl>[]> => {
  try {
    const urls = await Url.find({}, 'longUrl shortUrl customUrl');
    return urls;
  } catch (error) {
    throw new Error('Error retrieving URL history');
  }
};

export {
  createShortUrl,
  getLongUrl,
  incrementClick,
  generateQrCode,
  getAnalytics,
  getHistory,
};
