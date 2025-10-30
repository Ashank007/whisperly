"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/axios";
import toast from "react-hot-toast";

type Conf = {
  _id: string;
  text: string;
  createdAt: string;
  replies?: {
    _id: string;
    createdAt: string;
    text: string;
    replierEmail: string;
  }[];
  reactions: {
    love: { count: number; users: string[] };
    laugh: { count: number; users: string[] };
    sad: { count: number; users: string[] };
  };
};

interface Props {
  confession?: Conf; // 👈 make it optional
  refresh: () => void;
  token: string | null;
  userId: string;
}
export default function ConfessionCard({
  confession,
  refresh,
  token,
  userId,
}: Props) {
  const defaultReactions = {
    love: { count: 0, users: [] },
    laugh: { count: 0, users: [] },
    sad: { count: 0, users: [] },
  };
  const router = useRouter();
  const [reactions, setReactions] = useState(
    confession?.reactions || defaultReactions,
  );
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState("");
  if (!confession) {
    return (
      <div className="p-4 rounded-2xl bg-gray-100 animate-pulse">
        <p className="text-gray-400">Loading confession...</p>
      </div>
    );
  }

  const userHasReacted = (type: keyof typeof reactions) => {
    return reactions[type]?.users?.includes(userId);
  };

  const handleReact = async (type: keyof typeof reactions) => {
    if (!token) {
      toast.error("Please log in to react on confessions!");
      router.push("/login");
      return;
    }
    if (loading) return;

    setLoading(true);

    setReactions((prev) => {
      const alreadyReacted = prev[type].users.includes(userId);
      const newUsers = alreadyReacted
        ? prev[type].users.filter((u) => u !== userId)
        : [...prev[type].users, userId];
      return {
        ...prev,
        [type]: {
          count: newUsers.length,
          users: newUsers,
        },
      };
    });

    try {
      await api.post(
        `/confessions/react/${confession._id}`,
        { type },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      refresh(); // optional if you want full re-fetch
    } catch (err) {
      console.error(err);
      toast.error("Failed to react");
      setReactions(confession.reactions || defaultReactions);
    } finally {
      setLoading(false);
    }
  };

  const sendReply = async () => {
    if (!token) return toast.error("Login first!");
    if (!reply.trim()) return toast.error("Reply cannot be empty!");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/confessions/reply",
        { confessionId: confession._id, text: reply },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("💬 Reply added!");
      setReply("");
      refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to send reply!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-tr from-green-50 to-cyan-50 backdrop-blur-sm p-5 rounded-3xl shadow-xl border border-white/20 hover:scale-105 transition">
      <p className="text-gray-900 font-medium">{confession.text}</p>

      {/* Reactions */}
      <div className="mt-3 flex flex-wrap gap-3 items-center">
        <button
          onClick={() => handleReact("love")}
          disabled={loading}
          className={`px-4 py-2 rounded-2xl font-semibold flex items-center gap-1 transition ${
            userHasReacted("love")
              ? "bg-red-500 text-white scale-105"
              : "bg-white/20 text-gray-800 hover:bg-red-100"
          }`}
        >
          ❤️ <span>{reactions.love.count || 0}</span>
        </button>
        <button
          onClick={() => handleReact("laugh")}
          disabled={loading}
          className={`px-4 py-2 rounded-2xl font-semibold flex items-center gap-1 transition ${
            userHasReacted("laugh")
              ? "bg-yellow-400 text-white scale-105"
              : "bg-white/20 text-gray-800 hover:bg-yellow-100"
          }`}
        >
          😂 <span>{reactions.laugh.count || 0}</span>
        </button>
        <button
          onClick={() => handleReact("sad")}
          disabled={loading}
          className={`px-4 py-2 rounded-2xl font-semibold flex items-center gap-1 transition ${
            userHasReacted("sad")
              ? "bg-blue-400 text-white scale-105"
              : "bg-white/20 text-gray-800 hover:bg-blue-100"
          }`}
        >
          😭 <span>{reactions.sad.count || 0}</span>
        </button>

        <span className="text-xs text-gray-500 ml-auto italic">
          {new Date(confession.createdAt).toLocaleString()}
        </span>
      </div>
      {/* Replies List */}
      <div className="mt-3 space-y-2">
        {confession.replies?.map((r) => (
          <div
            key={r._id}
            className={`p-3 rounded-xl border border-white/20 text-gray-900 flex justify-between items-start bg-green-100
      }`}
          >
            <div className="flex flex-col">
              <span>{r.text}</span>
            </div>
            <span className="text-gray-500 text-xs italic ml-3 flex-shrink-0">
              {new Date(r.createdAt).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Reply Box */}
      <div className="mt-2 flex flex-col gap-2">
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={2}
          placeholder="Type your reply..."
          className="w-full p-3 rounded-2xl bg-white/20 text-gray-900 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-600"
        />
        <button
          onClick={sendReply}
          disabled={loading}
          className={`w-full bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 text-white p-2 rounded-2xl font-semibold hover:scale-105 transition flex justify-center items-center gap-2 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Sending..." : "Send Reply"}
        </button>
      </div>
    </div>
  );
}
