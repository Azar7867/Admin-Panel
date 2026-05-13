import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../api/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/auth/register`, form);

      alert("Registered Successfully");

      navigate("/login");
    } catch {
      alert("Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-pink-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Create Account</h1>

          <p className="text-gray-500 mt-2">Register to continue</p>
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-2">Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-2">Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
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
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-pink-600 hover:bg-pink-700 transition duration-300 text-white py-3 rounded-xl font-semibold shadow-lg"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-pink-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
