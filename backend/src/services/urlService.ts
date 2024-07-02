import { Url, IUrl } from "../models/urlModel";
import { createHash } from "crypto";
import client from "../db/connectToRedis";
import axios from "axios";

const generateShortUrl = (longUrl: string): string => {
  return createHash("sha256").update(longUrl).digest("base64").slice(0, 6);
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

const getHistory = async (): Promise<IUrl[]> => {
  return await Url.find({});
};

export {
  createShortUrl,
  getLongUrl,
  incrementClick,
  generateQrCode,
  getHistory,
};
