import { Url } from '../src/models/urlModel.js';
import client from '../src/db/connectToRedis.js';
import {
  createShortUrl,
  getLongUrl,
  incrementClick,
  generateQrCode,
  getAnalytics,
  getHistory,
} from '../src/services/urlService.js';
import axios from 'axios';
import { mocked } from 'jest-mock';

jest.mock('../models/urlModel');
jest.mock('../db/connectToRedis');
jest.mock('axios');

describe('URL Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createShortUrl', () => {
    it('should create a new short URL', async () => {
      const longUrl = 'http://example.com';
      const shortUrl = 'http://localhost:3000/abcdef';
      const userId = '123';
      const saveMock = jest.fn().mockResolvedValue({ longUrl, shortUrl });
      Url.prototype.save = saveMock;

      const result = await createShortUrl(longUrl, undefined, userId);

      expect(saveMock).toHaveBeenCalled();
      expect(result.shortUrl).toBe(shortUrl);
    });

    it('should throw an error if custom URL already exists', async () => {
      const longUrl = 'http://example.com';
      const customUrl = 'custom';
      const userId = '123';
      Url.findOne = jest.fn().mockResolvedValueOnce({ customUrl });

      await expect(createShortUrl(longUrl, customUrl, userId)).rejects.toThrow('Custom URL already exists');
    });

    it('should return existing URL if long URL already exists and custom URL is provided', async () => {
      const longUrl = 'http://example.com';
      const customUrl = 'custom';
      const userId = '123';
      const existingUrl = { longUrl, customUrl, shortUrl: 'http://localhost:3000/custom' };
      Url.findOne = jest.fn().mockResolvedValueOnce(existingUrl);

      const result = await createShortUrl(longUrl, customUrl, userId);

      expect(result).toEqual(existingUrl);
    });
  });

  describe('getLongUrl', () => {
    it('should return the long URL if found', async () => {
      const shortUrl = 'abcdef';
      const longUrl = 'http://example.com';
      client.get = jest.fn().mockResolvedValueOnce(null);
      Url.findOne = jest.fn().mockResolvedValueOnce({ longUrl });

      const result = await getLongUrl(shortUrl);

      expect(result).toBe(longUrl);
    });

    it('should return cached URL if found in cache', async () => {
      const shortUrl = 'abcdef';
      const longUrl = 'http://example.com';
      client.get = jest.fn().mockResolvedValueOnce(longUrl);

      const result = await getLongUrl(shortUrl);

      expect(result).toBe(longUrl);
    });
  });

  describe('incrementClick', () => {
    it('should increment click count', async () => {
      const shortUrl = 'abcdef';
      Url.updateOne = jest.fn().mockResolvedValueOnce(null);

      await incrementClick(shortUrl);

      expect(Url.updateOne).toHaveBeenCalledWith({ shortUrl }, { $inc: { clicks: 1 } });
    });
  });

  describe('generateQrCode', () => {
    it('should generate a QR code URL', async () => {
      const shortUrl = 'abcdef';
      const responseUrl = 'http://example.com/qrcode';
      axios.get = jest.fn().mockResolvedValueOnce({ request: { res: { responseUrl } } });

      const result = await generateQrCode(shortUrl);

      expect(result).toBe(responseUrl);
    });
  });

  describe('getAnalytics', () => {
    it('should return the click count for a URL', async () => {
      const shortUrl = 'abcdef';
      const clicks = 5;
      Url.findOne = jest.fn().mockResolvedValueOnce({ clicks });

      const result = await getAnalytics(shortUrl);

      expect(result).toBe(clicks);
    });
  });

  describe('getHistory', () => {
    it('should return URL history for a user', async () => {
      const userId = '123';
      const urls = [
        { longUrl: 'http://example.com', shortUrl: 'abcdef', customUrl: 'custom' },
      ];
      Url.find = jest.fn().mockResolvedValueOnce(urls);

      const result = await getHistory(userId);

      expect(result).toEqual(urls);
    });
  });
});