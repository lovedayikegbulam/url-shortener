import { Router } from "express";
import {
  redirectUrl,
} from "../controllers/urlController";

const router = Router();

router.get("/:id", redirectUrl);

export default router;