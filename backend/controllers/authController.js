import User from "../models/User.js";
import { sendMail } from "../utils/sendMail.js";
import { sendResetMail } from "../utils/sendresetMail.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const OTP_TTL_MS = 5 * 60 * 1000; 

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    let user = await User.findOne({ email });
    if (!user) user = new User({email});

    user.otp = otp;
    user.otpExpires = Date.now() + OTP_TTL_MS;
    user.verified = false;
    await user.save();

    await sendMail(email, otp);
    return res.json({ message: "OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.otpExpires && user.otpExpires > Date.now()) {
      const remaining = Math.ceil((user.otpExpires - Date.now()) / 1000);
      return res.status(400).json({
        error: `Please wait ${remaining}s before requesting a new OTP`,
      });
    }
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = newOtp;
    user.otpExpires = Date.now() + OTP_TTL_MS;
    await user.save();
    await sendMail(email, newOtp);
    return res.json({ message: "New OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) return res.status(400).json({ error: "Email, otp and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "No such user" });
    if (!user.otp || user.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });
    if (user.otpExpires < Date.now()) return res.status(400).json({ error: "OTP expired" });

    // set password and mark verified
    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.verified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const sendResetOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const user = await User.findOne({ email, verified: true });
    if (!user) return res.status(404).json({ error: "User not found or not verified" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; 
    await user.save();

    await sendResetMail(email, otp, "RESET_PASSWORD");
    res.json({ message: "Reset OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ error: "All fields required" });

    const user = await User.findOne({ email, verified: true });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });
    if (user.otpExpires < Date.now()) return res.status(400).json({ error: "OTP expired" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email & password required" });

    const user = await User.findOne({ email, verified: true });
    if (!user) return res.status(404).json({ error: "User not found or not verified" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Wrong credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
