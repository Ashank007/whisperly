import express from "express";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { getAllUsers, getAllConfessions, deleteConfession, deleteUser } from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", requireAdmin, getAllUsers);
router.get("/confessions", requireAdmin, getAllConfessions);
router.delete("/confession/:id", requireAdmin, deleteConfession);
router.delete("/user/:id", requireAdmin, deleteUser);

export default router;
