import { Url, IUrl } from '../models/urlModel';
import { createHash, randomBytes } from 'crypto';
import client from '../db/connectToRedis';
import axios from 'axios';
import CONFIG from '../config/config';

let domainName = CONFIG.DOMAIN_NAME || "http://localhost:3000/";



const generateShortUrl = (longUrl: string, salt: string): string => {
  const newUrl = createHash('sha256').update(longUrl + salt).digest('base64').slice(0, 6);
  return `${domainName}${newUrl}`;
};

const getCachedUrl = async (shortUrl: string): Promise<string | null> => {
  try {
    const data = await client.get(shortUrl);
    return data;
  } catch (err) {
    console.error('Error fetching from Redis', err);
    return null;
  }
};

const cacheUrl = (shortUrl: string, longUrl: string): void => {
  client.set(shortUrl, longUrl);
};

export const createShortUrl = async (
  longUrl: string,
  customUrl?: string,
  userId?: string
): Promise<IUrl> => {
  // Check if custom URL already exists
  if (customUrl) {
    const existingCustomUrl = await Url.findOne({ customUrl });
    if (existingCustomUrl) {
      throw new Error('Custom URL already exists');
    }
  }

  // Check if long URL already exists
  const existingUrl = await Url.findOne({ longUrl });

  // If custom URL is provided and long URL exists, use custom URL
  if (existingUrl && customUrl) {
    return existingUrl;
  }

  // Generate new short URL if custom URL is not provided or long URL doesn't exist
  let shortUrl = customUrl ? `${domainName}${customUrl}` : generateShortUrl(longUrl, randomBytes(4).toString('hex'));

  // Ensure the generated short URL is unique
  while (await Url.findOne({ shortUrl })) {
    shortUrl = generateShortUrl(longUrl, randomBytes(4).toString('hex'));
  }

  // If custom URL is not provided, set it to the short URL
  if (!customUrl) {
    customUrl = shortUrl;
  }else{
    customUrl = `${domainName}${customUrl}`
  }

  // Create a new URL document
  const url = new Url({ longUrl, shortUrl, customUrl, user: userId });
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

const getHistory = async (userId: string | undefined): Promise<Partial<IUrl>[]> => {
  try {
    const urls = await Url.find({ user: userId }, 'longUrl shortUrl customUrl');
    return urls;
  } catch (error) {
    throw new Error('Error retrieving URL history');
  }
};

const deleteUrl = async (shortUrl: string, userId?: string): Promise<boolean> => {

  // Check if the URL exists and belongs to the user
  const url = await Url.findOne({ shortUrl, user: userId });

  if (!url) {
    return false; 
  }

  // If found, delete the URL
  await Url.deleteOne({ _id: url._id });

  // Remove the URL from cache
  await client.del(shortUrl);

  return true; 
};

export {
  getLongUrl,
  incrementClick,
  generateQrCode,
  getAnalytics,
  getHistory,
  deleteUrl
};
