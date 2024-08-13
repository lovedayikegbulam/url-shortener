import request from "supertest";
import app from "../app";
import { Url } from "../models/urlModel";
// import client from "../db/connectToRedis";
import { AuthRequest } from '../middlewares/auth';
import axios from "axios";

jest.mock("../models/urlModel");
jest.mock("../db/connectToRedis");
jest.mock("axios");
jest.mock("jsonwebtoken");

const userId = "123";
const token = "Bearer mockToken";
const mockAuth = jest.fn((req: AuthRequest, res, next) => {
  req.user = { id: 'testUserId' } as any;
  next();
});

jest.mock("../middlewares/auth", () => ({
  auth: mockAuth,
}));

describe("URL Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/shorten", () => {
    it("should shorten a URL", async () => {
      const longUrl = "http://example.com";
      const shortUrl = "http://localhost:3000/abcdef";
      const url = { longUrl, shortUrl, user: userId };
      Url.prototype.save = jest.fn().mockResolvedValue(url);

      const response = await request(app)
        .post("/api/shorten")
        .set("Authorization", token)
        .send({ longUrl });

      expect(response.status).toBe(200);
      expect(response.body.shortUrl).toBe(shortUrl);
    });

    it("should return an error for invalid URL", async () => {
      const response = await request(app)
        .post("/api/shorten")
        .set("Authorization", token)
        .send({ longUrl: "invalid-url" });

      expect(response.status).toBe(400);
      expect(response.text).toBe("Invalid URL");
    });

    it("should return an error if custom URL already exists", async () => {
      const longUrl = "http://example.com";
      const customUrl = "custom";
      Url.findOne = jest.fn().mockResolvedValueOnce({ customUrl });

      const response = await request(app)
        .post("/api/shorten")
        .set("Authorization", token)
        .send({ longUrl, customUrl });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Custom URL already exists");
    });
  });

  describe("GET /api/:shortUrl", () => {
    it("should redirect to the long URL", async () => {
      const shortUrl = "abcdef";
      const longUrl = "http://example.com";
      Url.findOne = jest.fn().mockResolvedValueOnce({ longUrl });

      const response = await request(app).get(`/api/${shortUrl}`);

      expect(response.status).toBe(302);
      expect(response.headers.location).toBe(longUrl);
    });

    it("should return 404 if URL not found", async () => {
      const shortUrl = "abcdef";
      Url.findOne = jest.fn().mockResolvedValueOnce(null);

      const response = await request(app).get(`/api/${shortUrl}`);

      expect(response.status).toBe(404);
      expect(response.text).toBe("URL not found");
    });
  });

  describe("POST /api/qr", () => {
    it("should generate a QR code", async () => {
      const shortUrl = "abcdef";
      const qrCodeUrl = "http://example.com/qrcode";
      Url.findOne = jest.fn().mockResolvedValueOnce({ shortUrl });
      axios.get = jest
        .fn()
        .mockResolvedValueOnce({
          request: { res: { responseUrl: qrCodeUrl } },
        });

      const response = await request(app)
        .post("/api/qr")
        .set("Authorization", token)
        .send({ shortUrl });

      expect(response.status).toBe(200);
      expect(response.body.qrCodeUrl).toBe(qrCodeUrl);
    });
  });

  describe("GET /api/analytics/:shortUrl", () => {
    it("should return the click count for a URL", async () => {
      const shortUrl = "abcdef";
      const clicks = 5;
      Url.findOne = jest.fn().mockResolvedValueOnce({ clicks });

      const response = await request(app)
        .get(`/api/analytics/${shortUrl}`)
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toBe(clicks);
    });
  });

  describe("GET /api/history", () => {
    it("should return URL history for a user", async () => {
      const urls = [
        {
          longUrl: "http://example.com",
          shortUrl: "abcdef",
          customUrl: "custom",
        },
      ];
      Url.find = jest.fn().mockResolvedValueOnce(urls);

      const response = await request(app)
        .get("/api/history")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(urls);
    });

    it("should return 404 if no URLs found", async () => {
      Url.find = jest.fn().mockResolvedValueOnce([]);

      const response = await request(app)
        .get("/api/history")
        .set("Authorization", token);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("No URLs found");
    });
  });
});