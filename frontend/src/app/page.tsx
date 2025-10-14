"use client";
import { useEffect, useState } from "react";
import ConfessionCard from "./components/ConfessionCard";
import api from "../lib/axios";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import toast from "react-hot-toast";

type Conff = {
  _id: string;
  text: string;
  createdAt: string;
  reactions: {
  love: { count: number; users: string[] };
  laugh: { count: number; users: string[] };
  sad: { count: number; users: string[] };
};
};

export default function Home() {
  const [confs, setConfs] = useState<Conff[]>([]);
  const [text, setText] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");

  const fetchFeed = async () => {
    const res = await api.get("/confessions");
    setConfs(res.data);
  };

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
    if (t) {
      const payload = JSON.parse(atob(t.split(".")[1]));
      setUserId(payload.id);
    }
    fetchFeed();
  }, []);

  const post = async () => {
    if (!token) return toast.error("Please log in to post a confession!");
    if (!text.trim()) return;
    await api.post(
      "/confessions",
      { text },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setText("");
    fetchFeed();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-green-50 via-cyan-50 to-blue-100 flex flex-col">
      {/* SCROLLABLE CONTENT */}
      <main className="flex-1 overflow-y-auto pb-24 p-4">
        <div className="bg-white/30 backdrop-blur-md p-5 rounded-3xl shadow-md mb-6 border border-white/40">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your secret..."
            className="w-full bg-white/20 p-3 rounded-2xl border border-white/30 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
            rows={3}
          />
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={post}
              className="bg-green-400 text-white px-4 py-2 rounded-2xl hover:scale-105 transition font-semibold"
            >
              Confess
            </button>
            <button
              onClick={fetchFeed}
              className="px-4 py-2 border border-white/30 rounded-2xl hover:bg-white/20 transition font-semibold"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {confs.map((c) => (
            <ConfessionCard
              key={c._id}
              confession={c}
              refresh={fetchFeed}
              token={token}
              userId={userId}
            />
          ))}
        </div>
      </main>

      {/* ✅ STICKY FOOTER (Always visible) */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/40 backdrop-blur-md border-t border-white/50 py-3 shadow-sm">
        <div className="flex flex-col items-center justify-center gap-1 text-center">
          <p className="text-gray-800 font-semibold text-sm">
            Created by <span className="text-green-600 font-bold">Ashank Gupta</span>
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://www.linkedin.com/in/ashank-gupta-tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:scale-110 transition-transform"
            >
              <FaLinkedin size={22} />
            </a>
            <a
              href="https://github.com/ashank007"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 hover:scale-110 transition-transform"
            >
              <FaGithub size={22} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

