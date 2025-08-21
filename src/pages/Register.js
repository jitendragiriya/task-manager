import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authAxios from "../utils/axios";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAxios.post("/users/register", form);
      localStorage.setItem("token", data.token);
      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen justify-center bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-200 p-6">
      <div className="w-full h-fit max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8">
        <h2 className="text-[1.5rem] sm:text-3xl font-extrabold text-gray-800 text-center mb-6">
          Create an Account ✨
        </h2>
        <p className="text-gray-500 text-center mb-8">
          Register to start managing your tasks
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition outline-none bg-sky-50"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition outline-none bg-sky-50"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition outline-none pr-10 bg-sky-50"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6 text-center">
          Already have an account?{" "}
          <Link to="/" className="text-sky-600 font-medium hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
