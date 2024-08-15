import { Router } from "express";
import {
  shortenUrl,
  getQrCode,
  getLinkAnalytics,
  getLinkHistory,
} from "../controllers/urlController";
import auth from "../middlewares/auth";

const router = Router();

router.post("/shorten", auth, shortenUrl);
router.post("/generate-qr", auth, getQrCode);
router.get("/analytics", auth, getLinkAnalytics);
router.get("/history", auth, getLinkHistory);

export default router;
