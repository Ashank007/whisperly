import cron from "node-cron";
import User from "../models/User.js";

cron.schedule("*/15 * * * *", async () => {
  try {
    const now = Date.now();

    const result = await User.deleteMany({
      verified: false,
      otpExpires: { $lt: now },
    });

    if (result.deletedCount > 0) {
      console.log(`🧹 Cleanup: Removed ${result.deletedCount} expired unverified users.`);
    }
  } catch (err) {
    console.error("❌ Cleanup job failed:", err);
  }
});

console.log("✅ Cleanup job scheduled (runs every 15 minutes).");
