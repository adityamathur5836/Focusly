import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../lib/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        navigate("/login");
        return;
      }

      try {
        const data = await getUserById(userId);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [navigate]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-300 text-lg">
        Loading your dashboard...
      </div>
    );

  if (!userData)
    return (
      <div className="flex items-center justify-center h-screen text-gray-300 text-lg">
        Failed to load data. Please login again.
      </div>
    );

  const { name, stats, recent } = userData;

  return (
    <div className="min-h-screen bg-[#0B0B14] text-gray-100 font-inter flex">

      <aside className="w-64 bg-[#111122] border-r border-[#1E1E2F] flex flex-col">
        <div className="px-6 py-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
            F
          </div>
          <span className="text-xl font-bold tracking-tight">Focusly</span>
        </div>

        <nav className="px-4 flex-1">
          <div className="text-xs uppercase text-gray-500 mb-3 px-2">Study</div>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600/20 text-blue-300">
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 mt-1 rounded-lg hover:bg-[#1E1E2F] transition">
            Notes
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 mt-1 rounded-lg hover:bg-[#1E1E2F] transition">
            Flashcards
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 mt-1 rounded-lg hover:bg-[#1E1E2F] transition">
            Voice Room
          </a>

          <div className="text-xs uppercase text-gray-500 mt-8 mb-3 px-2">Account</div>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1E1E2F] transition">
            Settings
          </a>
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-3 px-3 py-2 mt-1 rounded-lg hover:bg-red-900/30 text-red-400 transition"
          >
            Logout
          </button>
        </nav>

        <div className="p-4">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-4 text-sm">
            <div className="font-semibold mb-1">Pro Access</div>
            <div className="text-gray-200 opacity-90">Unlock unlimited AI features</div>
            <button className="mt-3 px-3 py-1.5 bg-white/10 rounded-lg text-xs hover:bg-white/20 transition">
              Upgrade
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="px-10 pt-8 pb-4 flex items-center justify-between border-b border-[#1E1E2F]">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {name}</h1>
            <p className="text-gray-400 mt-1">
              Here’s your personalized AI learning overview — stay focused and grow daily.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 rounded-lg bg-[#1E1E2F] hover:bg-[#2A2A3F] transition">
              Feedback
            </button>
            <img
              src={`https://ui-avatars.com/api/?name=${name}&background=6366f1&color=fff`}
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </header>

        {/* Stats Section */}
        <section className="px-10 py-8 grid grid-cols-3 gap-6">
          <div className="bg-[#111122] border border-[#1E1E2F] rounded-xl p-5 hover:border-blue-500 transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-400 text-sm">Notes Created</div>
                <div className="text-3xl font-bold mt-1 text-blue-400">
                  {stats?.notes || 0}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#111122] border border-[#1E1E2F] rounded-xl p-5 hover:border-purple-500 transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-400 text-sm">Flashcards Reviewed</div>
                <div className="text-3xl font-bold mt-1 text-purple-400">
                  {stats?.flashcards || 0}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#111122] border border-[#1E1E2F] rounded-xl p-5 hover:border-cyan-500 transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-400 text-sm">Voice Sessions</div>
                <div className="text-3xl font-bold mt-1 text-cyan-400">
                  {stats?.voices || 0}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activity Section */}
        <section className="px-10 pb-10">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="bg-[#111122] border border-[#1E1E2F] rounded-xl divide-y divide-[#1E1E2F]">
            {recent && recent.length > 0 ? (
              recent.map((r, i) => (
                <div
                  key={i}
                  className="px-5 py-4 flex items-center justify-between hover:bg-[#1A1A2E] transition"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        r.type === "note"
                          ? "bg-blue-500/20 text-blue-300"
                          : r.type === "flash"
                          ? "bg-purple-500/20 text-purple-300"
                          : "bg-cyan-500/20 text-cyan-300"
                      }`}
                    >
                      {r.type === "note" && "📄"}
                      {r.type === "flash" && "📇"}
                      {r.type === "voice" && "🎙️"}
                    </div>
                    <div>
                      <div className="font-medium">{r.name}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(r.date).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <button className="text-sm text-blue-400 hover:underline">Open →</button>
                </div>
              ))
            ) : (
              <div className="px-5 py-6 text-gray-500 text-center">
                No recent activity found.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
