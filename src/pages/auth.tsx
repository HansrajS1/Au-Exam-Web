import { useAuth } from "../lib/authcontext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { icons } from "../constants/icons";
import { account } from "../lib/appwrite";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";



export default function Auth() {
  const [isSignIn, setIsSignIn] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>("");
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const FRONTEND_URL = import.meta.env.VITE_BASE_URL_FRONTEND || "http://localhost:5173";

  const { signIn, signUp } = useAuth();
  const router = useNavigate();

  const handleSwitch = () => setIsSignIn((prev) => !prev);

  const handleAuth = async () => {
    if (!email || !password) return setError("Email and Password are required");
    if (password.length < 8) return setError("Password must be at least 8 characters");

    const err = isSignIn
      ? await signUp(name, email, password)
      : await signIn(email, password);

    if (err) return setError(err);
    setError(null);
    if (!isSignIn) router("/Home");
  };

  const handleForgotPassword = async () => {
    if (!email) return setError("Enter your email to reset password");
    try {
      await account.createRecovery(email, `${FRONTEND_URL}/reset-password`);
      setResetMessage("Recovery email sent. Please check your inbox.");
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to send recovery email.");
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] flex flex-col items-center justify-center px-6 py-10">
      <img src={icons.logo} alt="Logo" className="h-24 w-24 mb-6 drop-shadow-md" />

      <div className="w-full max-w-md bg-[#1a1a2e] rounded-xl shadow-lg p-6 space-y-4">
        <h1 className="text-white text-3xl font-bold text-center">
          {isSignIn ? "Create Account" : "Welcome Back"}
        </h1>

        {isSignIn && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#2a2a3e] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#2a2a3e] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAuth()}
            className="w-full bg-[#2a2a3e] text-white px-4 py-3 rounded-md pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
            aria-label="Toggle password visibility"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          onClick={handleAuth}
          disabled={!email || !password}
          className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-md text-white font-semibold transition disabled:opacity-50"
        >
          {isSignIn ? "Sign Up" : "Sign In"}
        </button>

        <button
          onClick={handleSwitch}
          className="w-full border border-blue-400 text-blue-400 text-sm rounded-md py-2 font-medium hover:bg-blue-400 hover:text-white transition"
        >
          {isSignIn
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </button>

        <button
          onClick={handleForgotPassword}
          className="w-full text-gray-400 text-xs text-center hover:text-gray-200 transition"
        >
          Forgot Password? Send Recovery Email
        </button>
        {resetMessage && <p className="text-green-500 text-sm text-center">{resetMessage}</p>}
      </div>
    </div>
  );
}
