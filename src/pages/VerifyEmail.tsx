import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { account } from "../lib/appwrite";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");

    if (!userId || !secret) {
      setStatus("error");
      setMessage("Missing verification parameters.");
      return;
    }

    

    async function verify() {
      try {
        await account.updateVerification(userId!, secret!);
        setStatus("success");
        setMessage(" Email verified successfully!");
        setTimeout(() => {
          window.location.href = "https://auexamweb.netlify.app/auth";
        }, 1000);
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
        setMessage(" Verification failed. Please try again.");
      }
    }

    verify();
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#030014] text-white font-sans">
      <div className="max-w-md w-full text-center p-8 rounded-xl bg-[#0a0a1a] shadow-lg shadow-orange-500/30">
        <div
          className={`text-xl mb-4 message ${
            status === "success"
              ? "text-[#00ff9f]"
              : status === "error"
              ? "text-[#ff4c4c]"
              : ""
          }`}
        >
          {message}
        </div>
        {status === "verifying" && (
          <div className="w-10 h-10 mx-auto border-4 border-white/20 border-t-[#ff6b00] rounded-full animate-spin"></div>
        )}
      </div>
    </div>
  );
}
