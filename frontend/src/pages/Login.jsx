

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log("Login Request:", { email, password });
      const userData = await loginUser({ email, password });

      if (userData.error) {
        setError(userData.error);
        return;
      }

      console.log("Login Response:", userData);
      login(userData);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/LoginPageImg.jpeg')" }}
    >
      <div className="bg-gray-900 bg-opacity-90 p-8 rounded-xl shadow-xl w-96 border border-gray-700">
        <h2 className="text-3xl font-semibold text-center text-cyan-400 mb-4">Login</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 bg-gray-800 text-white border border-cyan-500 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-4 bg-gray-800 text-white border border-cyan-500 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-cyan-500 text-gray-900 font-semibold p-3 rounded-lg hover:bg-cyan-600 transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm mt-3 text-center text-gray-400">
          Don't have an account?{" "}
          <a href="/register" className="text-cyan-400 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
