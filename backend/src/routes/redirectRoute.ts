import { Router } from "express";
import {
  redirectUrl,
} from "../controllers/urlController";

const router = Router();

router.get("/:shortUrl", redirectUrl);

export default router;
