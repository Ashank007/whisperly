import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import "./utils/cleanupExpiredUsers.js";
dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import confessionRoutes from "./routes/confessionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
app.use(cors({origin:"*"}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { dbName:"whisperly"})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/confessions", confessionRoutes);
app.use("/api/v1/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on ${PORT}`));
