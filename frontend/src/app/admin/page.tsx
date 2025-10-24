"use client";
import { useEffect, useState, useMemo } from "react"; // Added useMemo for efficient filtering
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import toast from "react-hot-toast";

interface User {
  _id: string;
  email: string;
  role: string;
}

interface Confession {
  _id: string;
  text: string;
  user?: { email?: string };
  createdAt: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- NEW STATE FOR SEARCH ---
  const [confessionSearch, setConfessionSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized");
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [uRes, cRes] = await Promise.all([
          api.get("/admin/users", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/admin/confessions", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setUsers(uRes.data);
        setConfessions(cRes.data);
         
      } catch (err) {
        console.error(err);
        toast.error("⚠️ Failed to fetch admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // --- SEARCH FILTER LOGIC ---
  const filteredConfessions = useMemo(() => {
    if (!confessionSearch) return confessions;
    const lowercasedSearch = confessionSearch.toLowerCase();
    
    return confessions.filter(c => 
      c.text.toLowerCase().includes(lowercasedSearch) ||
      (c.user?.email && c.user.email.toLowerCase().includes(lowercasedSearch))
    );
  }, [confessions, confessionSearch]);

  const filteredUsers = useMemo(() => {
    if (!userSearch) return users;
    const lowercasedSearch = userSearch.toLowerCase();

    return users.filter(u => 
      u.email.toLowerCase().includes(lowercasedSearch)
    );
  }, [users, userSearch]);
  // --- END SEARCH FILTER LOGIC ---

  const deleteConfession = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      await api.delete(`/admin/confession/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConfessions(confessions.filter((c) => c._id !== id));
      toast.success("🗑️ Confession deleted");
    } catch {
      toast.error("❌ Failed to delete confession");
    }
  };

  const deleteUser = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      await api.delete(`/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
      toast.success("👤 User deleted");
    } catch {
      toast.error("❌ Failed to delete user");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-800">
        Loading admin panel...
      </div>
    );

  return (
    <div className="min-h-screen w-full p-6 bg-gradient-to-b from-green-50 via-cyan-50 to-blue-100">
      <div className="w-full bg-white/30 backdrop-blur-md rounded-3xl p-6 border border-white/40 shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Admin Dashboard — Whisperly
        </h1>

        {/* Confessions Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            📜 All Confessions ({filteredConfessions.length} found)
          </h2>
          
          {/* Confession Search Input */}
          <input
            type="text"
            placeholder="Search confessions by text or user email..."
            value={confessionSearch}
            onChange={(e) => setConfessionSearch(e.target.value)}
            className="w-full p-3 mb-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 transition shadow-sm bg-white/80 text-gray-800"
          />
          
          <div className="bg-white/20 rounded-2xl p-4 border border-white/30 space-y-3">
            {filteredConfessions.length === 0 ? (
              <p className="text-gray-600 text-center">
                {confessionSearch ? `No confessions match "${confessionSearch}".` : "No confessions yet."}
              </p>
            ) : (
              filteredConfessions.map((c) => ( // Using filteredConfessions here
                <div
                  key={c._id}
                  className="p-3 rounded-xl bg-white/30 border border-white/40 flex justify-between items-start"
                >
                  <div>
                    <p className="text-gray-800">{c.text}</p>
                    <p className="text-gray-500 text-sm">
                      By: {c.user?.email || "Anonymous"}
                    </p>
                    <p className="text-gray-400 text-xs italic">
                      {new Date(c.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteConfession(c._id)}
                    className="bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 text-white px-3 py-1 rounded-xl hover:scale-105 transition"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Users Section */}
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            👥 All Users ({filteredUsers.length} found)
          </h2>

          {/* User Search Input */}
          <input
            type="text"
            placeholder="Search users by email..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="w-full p-3 mb-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 transition shadow-sm bg-white/80 text-gray-800"
          />

          <div className="bg-white/20 rounded-2xl p-4 border border-white/30 space-y-3">
            {filteredUsers.length === 0 ? (
              <p className="text-gray-600 text-center">
                {userSearch ? `No users match "${userSearch}".` : "No users found."}
              </p>
            ) : (
              filteredUsers.map((u) => ( // Using filteredUsers here
                <div
                  key={u._id}
                  className="p-3 rounded-xl bg-white/30 border border-white/40 flex justify-between items-center"
                >
                  <div>
                    <p className="text-gray-800 font-medium">{u.email}</p>
                    <p className="text-gray-500 text-sm italic">{u.role}</p>
                  </div>
                  <button
                    onClick={() => deleteUser(u._id)}
                    className="bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 text-white px-3 py-1 rounded-xl hover:scale-105 transition"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
