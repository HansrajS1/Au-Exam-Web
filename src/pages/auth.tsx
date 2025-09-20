import { useAuth } from "../lib/authcontext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { icons } from "../constants/icons";

export default function Auth() {
  const [isSignIn, setIsSignIn] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>("");

  const { signIn, signUp } = useAuth();
  const router = useNavigate();

  const handleSwitch = () => setIsSignIn((prev) => !prev);

  const openEmail = () => {
    window.location.href = "mailto:auexamapp@gmail.com";
  };

  const handleAuth = async () => {
    if (!email || !password) {
      setError("Email and Password are required");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!isSignIn) {
      const err = await signIn(email, password);
      if (err) {
        setError(err);
        return;
      }
      router("/Home");
    } else {
      const err = await signUp(name, email, password);
      if (err) {
        setError(err);
        return;
      }
    }
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#030014] flex flex-col items-center justify-center px-6 py-10">
      <img src={icons.logo} alt="Logo" className="h-24 w-24 mb-6" />

      <div className="w-full max-w-md">
        <h1 className="text-white text-3xl font-bold text-center mb-6">
          {isSignIn ? "Create Account" : "Welcome Back"}
        </h1>

        {isSignIn && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#1a1a2e] text-white px-4 py-3 rounded-md mb-4"
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#1a1a2e] text-white px-4 py-3 rounded-md mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#1a1a2e] text-white px-4 py-3 rounded-md mb-4"
        />

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <button
          onClick={handleAuth}
          disabled={!email || !password}
          className="w-full bg-green-600 cursor-pointer py-3 rounded-md mb-4 text-white font-semibold"
        >
          {isSignIn ? "Sign Up" : "Sign In"}
        </button>

        <button
          onClick={handleSwitch}
          className="w-full border cursor-pointer border-blue-400 text-blue-400 text-xl rounded-md py-2 font-medium mb-4"
        >
          {isSignIn
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </button>

        <button onClick={openEmail} className="w-full cursor-pointer text-gray-400 text-sm text-center">
          Forgot Password? Contact Support
        </button>
      </div>
    </div>
  );
}
