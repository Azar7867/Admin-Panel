import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../api/api";
import { useNavigate, Link, Navigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  if (localStorage.getItem("token")) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/auth/login`, form);

      localStorage.setItem("token", res.data.token);

      navigate("/", { replace: true });
    } catch {
      alert("Invalid Login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Welcome Back</h1>

          <p className="text-gray-500 mt-2">Login to continue</p>
        </div>
        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-2">Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition duration-300 text-white py-3 rounded-xl font-semibold shadow-lg"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
