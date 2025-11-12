import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../lib/api";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const res = await registerUser(name, email, password);

      localStorage.setItem("token", res.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen text-white">
      {/* Left Side */}
      <div className="hidden md:flex w-1/2 flex-col justify-center items-center bg-gradient-to-br from-[#0F0C29] via-[#302B63] to-[#24243E] relative overflow-hidden">
        <img
          src="https://cdni.iconscout.com/illustration/premium/thumb/ai-learning-concept-illustration-download-in-svg-png-gif-file-formats--artificial-intelligence-machine-digital-technology-pack-science-illustrations-7990932.png?f=webp"
          alt="AI learning illustration"
          className="w-80 h-auto mb-8 drop-shadow-2xl animate-fade-in"
        />
        <h1 className="text-4xl font-bold text-blue-400">Welcome to Focusly</h1>
        <p className="text-gray-300 max-w-md mx-auto text-center mt-4">
          Learn faster, smarter, and more efficiently — powered by our intelligent AI engine.
        </p>
      </div>

      {/* Right Side */}
      <div className="flex flex-1 justify-center items-center bg-[#0B0B14]">
        <div className="w-full max-w-md bg-[#111122] p-10 rounded-2xl shadow-xl border border-[#1E1E2F]">
          <h2 className="text-3xl font-semibold text-center mb-8">Create Your Account</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-2 p-3 bg-[#0D0D18] border border-[#1E1E2F] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 p-3 bg-[#0D0D18] border border-[#1E1E2F] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 p-3 bg-[#0D0D18] border border-[#1E1E2F] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold text-white transition"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already part of Focusly?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
