"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/axios";
import toast from "react-hot-toast";

export default function Register() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [sent, setSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const router = useRouter();
  const otpRef = useRef<HTMLInputElement>(null);

  const sendOtp = async () => {
    if (!email) return toast.error("📧 Email required!");
    const allowedDomains = ["@gmail.com"];
    const valid = allowedDomains.some((suffix) => email.endsWith(suffix));
    if (!valid) return toast.error("❌ Only @gmail.com emails are allowed!");
    try {
      setLoading(true);
      await api.post("/auth/send-otp", { email });
      setSent(true);
      toast.success("📩 OTP sent! Check your inbox 👀");
      startCooldown(); // start timer
      setTimeout(() => otpRef.current?.focus(), 100);
    } catch (err:unknown) {
      console.error(err);
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message 
      toast.error(`❌ ${msg || "Failed to send OTP. Try later!"}`);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!email) return toast.error("📧 Email required!");

    try {
      setLoading(true);
      const res = await api.post("/auth/resend-otp", { email });
      toast.success(res.data.message || "New OTP sent successfully!");
      startCooldown(); // restart cooldown
    } catch (err: unknown) {
      console.error(err);
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      "Failed to resend OTP. Try later!";
      toast.error(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    if (!email || !otp || !password)
      return toast.error("All fields required!");
    try {
      setLoading(true);
      const res = await api.post("/auth/verify-otp", { email, otp, password });
      localStorage.setItem("token", res.data.token);
      window.dispatchEvent(new Event("storage")); // update Navbar
      toast.success("🎉 Verified & Logged in successfully!");
      router.push("/");
    } catch (err: unknown) {
      console.error(err);
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message 
      toast.error(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const startCooldown = () => {
    setCooldown(180);
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const passwordStrength = password.length >= 6 ? "Strong" : "Weak";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 via-cyan-50 to-blue-100 p-6">
      <div className="w-full max-w-md bg-white/30 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white/40">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">
          Register — Whisperly
        </h2>

        {/* Email Input */}
        <input
          className="w-full border border-white/30 p-3 rounded-2xl mb-3 bg-white/20 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={sent}
        />

        {/* STEP 1: Send OTP */}
        {!sent ? (
          <button
            onClick={sendOtp}
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 text-white p-3 rounded-2xl mt-2 font-semibold transition ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:scale-105"
            }`}
          >
            {loading ? (
              <>
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                Sending OTP...
              </>
            ) : (
              "Send OTP"
            )}
          </button>
        ) : (
          <>
            {/* STEP 2: Verify OTP */}
            <div className="flex gap-2 items-center mb-3">
              <input
                ref={otpRef}
                className="flex-1 border border-white/30 p-3 rounded-2xl bg-white/20 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              {/* Resend OTP Button */}
              {cooldown === 0 ? (
                <button
                  onClick={resendOtp}
                  disabled={loading}
                  className="px-3 py-2 bg-cyan-400 text-white rounded-2xl hover:scale-105 transition"
                >
                  Resend OTP
                </button>
              ) : (
                <span className="text-gray-500 text-sm">
                  Resend in {cooldown}s
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="relative mb-1">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border border-white/30 p-3 rounded-2xl bg-white/20 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Choose password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 font-bold"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-2">
              Password strength: {passwordStrength}
            </p>

            {/* Verify Button */}
            <button
              onClick={verify}
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 text-white p-3 rounded-2xl mt-2 font-semibold transition ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:scale-105"
              }`}
            >
              {loading ? (
                <>
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                  Verifying...
                </>
              ) : (
                "Verify & Register"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

