"use client";
import { useState } from "react";
import api from "../../lib/axios";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendResetOTP = async () => {
    if (!email) return toast.error("📧 Email required!");
    try {
      setLoading(true);
      await api.post("/auth/send-reset-otp", { email });
      toast.success("📩 Reset OTP sent to your email!");
      setStep(2);
    } catch (err : unknown) {
      console.error(err);
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message 
      toast.error(` ${msg} || ❌ Failed to send OTP!`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!email || !otp || !newPassword)
      return toast.error("All fields required!");
    try {
      setLoading(true);
      await api.post("/auth/reset-password", { email, otp, newPassword });
      toast.success("✅ Password reset successful!");
      window.location.href = "/login";
    } catch (err: unknown) {
      console.error(err);
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message 
      toast.error(` ${msg}|| ❌ Invalid OTP or expired!`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 via-cyan-50 to-blue-100 p-6">
      <div className="w-full max-w-md bg-white/30 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white/40">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">
          Reset Password — Whisperly
        </h2>

        {step === 1 && (
          <>
            <input
              className="w-full border border-white/30 p-3 rounded-2xl mb-3 bg-white/20 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={sendResetOTP}
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 text-white p-3 rounded-2xl mt-2 font-semibold transition ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:scale-105"
              }`}
            >
              {loading ? (
                <>
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                  Sending...
                </>
              ) : (
                "Send Reset OTP"
              )}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              className="w-full border border-white/30 p-3 rounded-2xl mb-3 bg-white/20 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <div className="relative mb-3">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border border-white/30 p-3 rounded-2xl bg-white/20 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 font-bold"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <button
              onClick={handleReset}
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 text-white p-3 rounded-2xl mt-2 font-semibold transition ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:scale-105"
              }`}
            >
              {loading ? (
                <>
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

