import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authAxios from "../utils/axios";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAxios.post("/users/login", { email, password });
      localStorage.setItem("token", data.token);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-200 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          Welcome Back 👋
        </h2>
        <p className="text-gray-500 text-center mb-8">
          Login to manage your tasks efficiently
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition outline-none bg-sky-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition outline-none pr-10 bg-sky-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-[3px] transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? "show off" : "show on"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg shadow-md transition"
            disabled={loading}
          >
            {loading ? "Login..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6 text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-sky-600 font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
