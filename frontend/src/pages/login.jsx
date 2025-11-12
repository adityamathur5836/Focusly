import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../lib/api";
import "../index.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const res = await loginUser(email, password);

      // ✅ Store token + redirect
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
      <div className="hidden md:flex w-1/2 flex-col justify-center items-center bg-gradient-to-br from-[#0F0C29] via-[#302B63] to-[#24243E] p-12">
        <div className="text-center space-y-4">
          <div className="text-4xl font-bold text-blue-500">Focusly</div>
          <p className="text-gray-300 max-w-md mx-auto">
            Connecting your workflow seamlessly — The ultimate AI-driven study system.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-1 justify-center items-center bg-[#0B0B14]">
        <div className="w-full max-w-md bg-[#111122] p-10 rounded-2xl shadow-xl border border-[#1E1E2F]">
          <h2 className="text-3xl font-semibold text-center mb-8">Welcome Back</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 p-3 bg-[#0D0D18] border border-[#1E1E2F] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 p-3 bg-[#0D0D18] border border-[#1E1E2F] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold text-white transition"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
