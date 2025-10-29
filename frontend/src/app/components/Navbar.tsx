"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
    setToken(localStorage.getItem("token"));
    const handleStorage = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.href = "/login";
  };

  return (
    <nav className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 shadow-lg rounded-b-2xl text-white">
      <h1 className="text-2xl font-extrabold tracking-wider mb-2 sm:mb-0">Whisperly</h1>
      <div className="space-x-3 flex flex-wrap justify-center sm:justify-end">
        {!token ? (
          <>
            <Link href="/login" className="px-4 py-2 bg-white/20 rounded-full hover:bg-white/40 transition font-semibold">Login</Link>
            <Link href="/register" className="px-4 py-2 bg-white/20 rounded-full hover:bg-white/40 transition font-semibold">Register</Link>
          </>
        ) : (
          <button onClick={logout} className="px-4 py-2 bg-white/20 rounded-full hover:bg-white/40 transition font-semibold">Logout</button>
        )}
      </div>
    </nav>
  );
}

