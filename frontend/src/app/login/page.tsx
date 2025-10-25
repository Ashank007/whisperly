"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/axios";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const doLogin = async () => {
    if (!email || !password) return toast.error("⚠️ Fill all fields!");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      window.dispatchEvent(new Event("storage")); // update Navbar
      toast.success("🎉 Logged in successfully!");
      router.push("/");
    } catch (err: unknown) {
      console.error(err);
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      "Login failed!";
      toast.error(`❌ ${msg}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 via-cyan-50 to-blue-100 p-6">
      <div className="w-full max-w-md bg-white/30 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white/40">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">Login — Whisperly</h2>

        <input
          className="w-full border border-white/30 p-3 rounded-2xl mb-3 bg-white/20 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full border border-white/30 p-3 rounded-2xl bg-white/20 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="Password"
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

        <button
          onClick={doLogin}
          className="w-full bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 text-white p-3 rounded-2xl mt-2 font-semibold hover:scale-105 transition"
        >
          Login
        </button>

        {/* 🧠 Forgot Password Link */}
        <p className="text-center text-gray-700 mt-4 text-sm">
          Forgot your password?{" "}
          <button
            onClick={() => router.push("/reset-password")}
            className="text-cyan-600 font-semibold hover:underline hover:text-cyan-800 transition"
          >
            Reset here
          </button>
        </p>
      </div>
    </div>
  );
}

