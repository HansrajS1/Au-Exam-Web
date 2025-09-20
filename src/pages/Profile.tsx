import { images } from "../constants/images";
import { account } from "../lib/appwrite";
import { useAuth } from "../lib/authcontext";
import { useEffect, useState } from "react";

export default function Profile() {
  const { signOut, userEmail, userName, userVerified, setUserVerified } =
    useAuth();
  const username = userName
    ? userName.charAt(0).toUpperCase() + userName.slice(1)
    : "Guest";
  const userEmailDisplay = userEmail || "Guest@example.com";
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const savedAvatar = localStorage.getItem("avatar");
    if (savedAvatar) setSelected(parseInt(savedAvatar, 10));
    setUserVerified(userVerified);
  }, [userVerified, setUserVerified]);

  const chooseAvatar = (id: number) => {
    setSelected(id);
    localStorage.setItem("avatar", id.toString());
  };

  const resetAvatar = () => {
    localStorage.removeItem("avatar");
    setSelected(null);
  };

  const verifyAccount = async () => {
    try {
      alert("Check your email for the verification link!");
      await account.createVerification("https://auexamverifyemail.netlify.app");
      pollVerification();
    } catch (error) {
      console.error("Error verifying account:", error);
      alert("Error verifying account");
    }
  };

  const pollVerification = async () => {
    const phases = [
      { duration: 10000, interval: 2000 },
      { duration: 10000, interval: 3000 },
      { duration: 10000, interval: 5000 },
    ];

    let verified = false;

    for (const phase of phases) {
      const start = Date.now();
      while (Date.now() - start < phase.duration) {
        try {
          const user = await account.get();
          if (user.emailVerification) {
            alert("Your account is now verified!");
            setUserVerified(true);
            verified = true;
            return;
          }
        } catch (err) {
          console.error("Verification check failed:", err);
        }
        await new Promise((resolve) => setTimeout(resolve, phase.interval));
      }
    }

    if (!verified) {
      alert("Verification not detected. Please refresh or try again.");
    }
  };

  const openEmail = () => {
    window.location.href = "mailto:auexamapp@gmail.com";
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "AU Exam App",
        text: "Check out the AU Exam App - built for Alliance University students to upload and manage their academic resources.",
        url: "https://auexamapp.netlify.app",
      });
    } catch (error) {
      console.error("Error sharing the app:", error);
    }
  };

  return (
    <div className=" bg-[#030014] min-h-screen flex flex-col items-center justify-center px-4 text-white">
      {!selected ? (
        <>
          <h2 className="text-lg mb-4">Choose your avatar</h2>
          <div className="flex gap-6 mb-6">
            <button onClick={() => chooseAvatar(1)}>
              <img
                src={images.AvatarBoy}
                alt="Boy Avatar"
                className="w-20 h-20 rounded-full border border-white"
              />
            </button>
            <button onClick={() => chooseAvatar(2)}>
              <img
                src={images.AvatarGirl}
                alt="Girl Avatar"
                className="w-20 h-20 rounded-full border border-white"
              />
            </button>
          </div>
        </>
      ) : (
        <div className="relative mb-5">
          <img
            src={selected === 1 ? images.AvatarBoy : images.AvatarGirl}
            alt="Selected Avatar"
            className="w-24 h-24 rounded-full"
          />
          {userVerified && (
            <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
              <span className="text-white text-xs font-bold">✔</span>
            </div>
          )}
        </div>
      )}

      <h1 className="text-xl mb-2 text-center">{username}</h1>
      <p className="mb-2 text-center">{userEmailDisplay}</p>

      <div className="flex gap-4 mt-3 mb-5">
        <button
          onClick={resetAvatar}
          className="border cursor-pointer border-white px-4 py-2 rounded text-white"
        >
          Reset Avatar
        </button>
        {!userVerified && (
          <button
            onClick={verifyAccount}
            className="border cursor-pointer border-white px-4 py-2 rounded text-white"
          >
            Verify Account
          </button>
        )}
      </div>

      <button
        onClick={signOut}
        className="bg-indigo-600 px-6 py-2 rounded text-white cursor-pointer font-semibold mb-4"
      >
        Sign Out
      </button>

      <button
        onClick={openEmail}
        className="bg-blue-700 px-6 py-2 rounded-lg cursor-pointer mb-4"
      >
        ⚙️ Contact Support
      </button>

      <button
        onClick={handleShare}
        className="bg-black px-6 border border-white cursor-pointer py-3 rounded-md"
      >
        <span className="text-white font-semibold">𖹭 Download App</span>
      </button>

      <p className="absolute bottom-0 left-0 right-0 text-center bg-[#030014] text-gray-400 text-xs">
        © {new Date().getFullYear()} AU Exam App. All rights reserved.
      </p>
      </div>
  );
}
