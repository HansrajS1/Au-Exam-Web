import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { account } from "../lib/appwrite";
import { icons } from "../constants/icons";
import { useNavigate } from "react-router-dom";




export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("Validating recovery link…");
  const [showForm, setShowForm] = useState(false);
  const router = useNavigate();
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");
  const expire = searchParams.get("expire");

  useEffect(() => {
    if (!userId || !secret) {
      setStatus("error");
      setMessage("Missing recovery parameters.");
      return;
    }

    if (expire && new Date(expire) < new Date()) {
      setStatus("error");
      setMessage("This link has expired. Please request a new one.");
      return;
    }

    setStatus("success");
    setMessage("Recovery link verified. Please enter your new password.");
    setShowForm(true);
  }, [userId, secret, expire]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const newPassword = (form.newPassword as HTMLInputElement).value;
    const confirmPassword = (form.confirmPassword as HTMLInputElement).value;

    if (!newPassword || !confirmPassword) {
      setStatus("error");
      setMessage("Please fill in both password fields.");
      return;
    }
    if (newPassword.length < 8) {
      setStatus("error");
      setMessage("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    try {
      await account.updateRecovery(userId!, secret!, newPassword);
      setStatus("success");
      setMessage("Password updated successfully! Redirecting…");
      setTimeout(() => {
        router("/auth");
      }, 2000);
    } catch (err) {
      console.error("Recovery error:", err);
      setStatus("error");
      setMessage("Failed to update password. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-[#030014] text-white flex flex-col items-center justify-center p-6 font-sans">
      <img src={icons.logo} alt="Logo" className="w-24 h-24 mb-6" />
      <div className="max-w-md w-full bg-[#1a1a2e] p-6 rounded-xl text-center shadow-md">
        <h2
          className={`text-lg mb-4 ${
            status === "success"
              ? "text-green-400"
              : status === "error"
              ? "text-red-400"
              : ""
          }`}
        >
          {message}
        </h2>

        {status === "verifying" && (
          <div className="w-10 h-10 mx-auto border-4 border-white/20 border-t-green-400 rounded-full animate-spin"></div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              className="w-full p-3 rounded-lg bg-[#2a2a3e] text-white"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full p-3 rounded-lg bg-[#2a2a3e] text-white"
            />
            <button
              type="submit"
              className="w-full bg-green-400 hover:bg-green-500 text-black font-bold py-3 rounded-lg"
            >
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
