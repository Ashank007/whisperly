import express from "express";
import { sendOTP, verifyOTP, login, resendOTP, sendResetOTP, resetPassword } from "../controllers/authController.js";
const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/resend-otp", resendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/send-reset-otp", sendResetOTP);
router.post("/reset-password", resetPassword);
router.post("/login", login);


export default router;
