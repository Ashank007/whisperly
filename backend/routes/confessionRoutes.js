import express from "express";
import { createConfession, getConfessions, react, replyConfession } from "../controllers/confessionController.js";
import { requireAuth } from "../middleware/auth.js";
const router = express.Router();

router.get("/", getConfessions);
router.post("/", requireAuth, createConfession);
router.post("/react/:id", requireAuth, react);
router.post("/reply", requireAuth,replyConfession);

export default router;
