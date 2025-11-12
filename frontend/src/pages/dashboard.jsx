import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user] = useState({ name: "Aditya" });

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#0B0B14] text-white p-10 font-inter">
      <header className="flex justify-between items-center mb-10 border-b border-[#1E1E2F] pb-6">
        <h1 className="text-3xl font-bold text-blue-400">Welcome, {user.name} 👋</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-medium"
        >
          Log Out
        </button>
      </header>

      <section className="grid md:grid-cols-3 gap-8">
        {[
          { title: "Notes Created", value: "12", color: "blue" },
          { title: "Flashcards Reviewed", value: "45", color: "purple" },
          { title: "Voice Sessions", value: "6", color: "cyan" },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-[#111122] border border-[#1E1E2F] rounded-xl p-6 text-center hover:border-blue-500 transition"
          >
            <h3 className="text-gray-400 text-sm mb-2">{stat.title}</h3>
            <p className="text-3xl font-bold text-blue-400">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">Your AI Tools</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: "🧠", title: "Generate Notes", desc: "Upload or paste material to create AI notes instantly." },
            { icon: "📇", title: "Flashcards", desc: "Auto-generate flashcards from your notes for fast revision." },
            { icon: "🎙️", title: "Voice Mode", desc: "Speak to Focusly to create notes and summaries hands-free." },
          ].map((tool, i) => (
            <div key={i} className="bg-[#111122] border border-[#1E1E2F] rounded-xl p-6 hover:border-blue-500 transition">
              <div className="text-3xl mb-3">{tool.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
              <p className="text-gray-400 text-sm">{tool.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
