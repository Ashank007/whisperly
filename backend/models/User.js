import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String },
  otpExpires: { type: Date },
  verified: { type: Boolean, default: false },
  password: { type: String }, 
  role: { type: String, enum: ["user", "admin"], default: "user" }
},{versionKey: false});

export default mongoose.model("User", userSchema);
