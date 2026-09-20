import { images } from "../constants/images";
import { account } from "../lib/appwrite";
import { useAuth } from "../lib/authcontext";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ImagePlus, LifeBuoy, LogOut, RotateCcw, ShieldCheck } from "lucide-react";

type AvatarChoice = "1" | "2" | "custom" | null;

const AVATAR_KEY = "avatar";
const AVATAR_IMAGE_KEY = "avatarImage";
const AVATAR_SIZE = 320;

export default function Profile() {
  const router = useNavigate();

  const { signOut, userEmail, userName, userVerified, setUserVerified } = useAuth();
  const username = userName ? userName.charAt(0).toUpperCase() + userName.slice(1) : "Guest";
  const userEmailDisplay = userEmail || "Guest@example.com";

  const [avatarChoice, setAvatarChoice] = useState<AvatarChoice>(null);
  const [customAvatarSrc, setCustomAvatarSrc] = useState<string | null>(null);
  const [verifymsg, setVerifyMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const FRONTEND_URL = import.meta.env.VITE_BASE_URL_FRONTEND || "http://localhost:5173";

  const fontImport = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Inter:wght@400;500;600&display=swap');
      .ap-serif { font-family: 'Source Serif 4', Georgia, serif; }
      .ap-sans { font-family: 'Inter', system-ui, sans-serif; }
    `}</style>
  );

  useEffect(() => {
    const saved = localStorage.getItem(AVATAR_KEY) as AvatarChoice;
    if (saved === "1" || saved === "2") {
      setAvatarChoice(saved);
    } else if (saved === "custom") {
      const savedImage = localStorage.getItem(AVATAR_IMAGE_KEY);
      if (savedImage) {
        setAvatarChoice("custom");
        setCustomAvatarSrc(savedImage);
      }
    }
    setUserVerified(userVerified);
  }, [userVerified, setUserVerified]);

  const chooseAvatar = (id: "1" | "2") => {
    setAvatarChoice(id);
    setCustomAvatarSrc(null);
    localStorage.setItem(AVATAR_KEY, id);
    localStorage.removeItem(AVATAR_IMAGE_KEY);
  };

  const resetAvatar = () => {
    localStorage.removeItem(AVATAR_KEY);
    localStorage.removeItem(AVATAR_IMAGE_KEY);
    setAvatarChoice(null);
    setCustomAvatarSrc(null);
  };

  // Reads the chosen file, crops it to a square, downsizes it, and stores it
  // as a PNG data URL in localStorage so it survives reloads on this device.
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setVerifyMsg("Please choose an image file.");
      return;
    }

    setIsUploading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Could not read the file."));
        reader.readAsDataURL(file);
      });

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Could not load the image."));
        img.src = dataUrl;
      });

      const side = Math.min(img.naturalWidth, img.naturalHeight);
      const sx = (img.naturalWidth - side) / 2;
      const sy = (img.naturalHeight - side) / 2;

      const canvas = document.createElement("canvas");
      canvas.width = AVATAR_SIZE;
      canvas.height = AVATAR_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas is not supported in this browser.");
      ctx.drawImage(img, sx, sy, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE);

      const croppedDataUrl = canvas.toDataURL("image/png");

      localStorage.setItem(AVATAR_KEY, "custom");
      localStorage.setItem(AVATAR_IMAGE_KEY, croppedDataUrl);
      setAvatarChoice("custom");
      setCustomAvatarSrc(croppedDataUrl);
    } catch (error) {
      console.error("Failed to save uploaded avatar:", error);
      setVerifyMsg("Couldn't save that photo. Please try a smaller image.");
    } finally {
      setIsUploading(false);
    }
  };

  const verifyAccount = async () => {
    try {
      setVerifyMsg("Check your email for the verification link!");
      await account.createVerification(`${FRONTEND_URL}/verify-email`);
      pollVerification();
    } catch (error) {
      console.error("Error verifying account:", error);
      setVerifyMsg("Error verifying account");
    }
  };

  const pollVerification = async () => {
    const phases = [
      { duration: 10000, interval: 2000 },
      { duration: 10000, interval: 3000 },
      { duration: 10000, interval: 5000 },
      { duration: 10000, interval: 7000 },
      { duration: 10000, interval: 8000 },
    ];

    let verified = false;

    for (const phase of phases) {
      const start = Date.now();
      while (Date.now() - start < phase.duration) {
        try {
          const user = await account.get();
          if (user.emailVerification) {
            setVerifyMsg(null);
            setVerifyMsg("Your account is now verified!");
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
      setVerifyMsg("Verification not detected. Please refresh or try again.");
    }
  };

  const openEmail = () => {
    window.location.href = "mailto:auexamapp@gmail.com";
  };

  const avatarSrc =
    avatarChoice === "custom" ? customAvatarSrc : avatarChoice === "1" ? images.AvatarBoy : images.AvatarGirl;

  return (
    <div className="ap-sans bg-[#0B1220] bg-[radial-gradient(circle_at_80%_10%,#141B2E,transparent_45%)] min-h-screen flex flex-col items-center justify-center px-4 py-16 text-[#D7DAE3] relative">
      {fontImport}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      <div className="w-full max-w-sm bg-[#F6F1E7] border-l-4 border-[#B08D57] rounded-sm shadow-[0_25px_60px_-20px_rgba(0,0,0,0.65)] px-8 py-9 flex flex-col items-center">
        {!avatarChoice ? (
          <>
            <h2 className="ap-serif text-[#171A21] text-xl mb-5">Choose your avatar</h2>
            <div className="flex gap-5 mb-2 items-center">
              <button onClick={() => chooseAvatar("1")} className="group">
                <img
                  src={images.AvatarBoy}
                  alt="Boy avatar"
                  className="w-20 h-20 rounded-full border-2 border-[#DCD1B8] group-hover:border-[#B08D57] transition-colors"
                />
              </button>
              <button onClick={() => chooseAvatar("2")} className="group">
                <img
                  src={images.AvatarGirl}
                  alt="Girl avatar"
                  className="w-20 h-20 rounded-full border-2 border-[#DCD1B8] group-hover:border-[#B08D57] transition-colors"
                />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="group w-20 h-20 rounded-full border-2 border-dashed border-[#C7BA98] flex items-center justify-center hover:border-[#B08D57] transition-colors disabled:opacity-50"
              >
                <ImagePlus className="h-6 w-6 text-[#A79E88] group-hover:text-[#B08D57] transition-colors" />
              </button>
            </div>
            <p className="text-[#A79E88] text-xs mt-2">{isUploading ? "Uploading…" : "Or upload your own photo"}</p>
          </>
        ) : (
          <div className="relative mb-5">
            <img
              src={avatarSrc ?? undefined}
              alt="Selected avatar"
              className="w-24 h-24 rounded-full border-2 border-[#DCD1B8] object-cover"
            />
            {userVerified && (
              <div className="absolute -top-1 -right-1 bg-[#B08D57] rounded-full p-1 border-2 border-[#F6F1E7]">
                <Check className="h-3 w-3 text-[#0B1220]" strokeWidth={3} />
              </div>
            )}
          </div>
        )}

        <h1 className="ap-serif text-[#171A21] text-xl mt-1 text-center">{username}</h1>
        <p className="text-[#6B6455] text-sm mb-6 text-center">{userEmailDisplay}</p>

        {avatarChoice && (
          <div className="flex flex-wrap justify-center gap-2.5 mb-5">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-1.5 border border-[#C7BA98] text-[#4A4636] text-xs font-medium px-3.5 py-2 rounded-sm hover:border-[#B08D57] hover:text-[#8C6F3F] transition-colors disabled:opacity-50"
            >
              <ImagePlus className="h-3.5 w-3.5" />
              {isUploading ? "Uploading…" : "Upload photo"}
            </button>
            <button
              onClick={resetAvatar}
              className="flex items-center gap-1.5 border border-[#C7BA98] text-[#4A4636] text-xs font-medium px-3.5 py-2 rounded-sm hover:border-[#B08D57] hover:text-[#8C6F3F] transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset avatar
            </button>
            {!userVerified && (
              <button
                onClick={verifyAccount}
                className="flex items-center gap-1.5 border border-[#C7BA98] text-[#4A4636] text-xs font-medium px-3.5 py-2 rounded-sm hover:border-[#B08D57] hover:text-[#8C6F3F] transition-colors"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Verify account
              </button>
            )}
          </div>
        )}

        {verifymsg && (
          <div className="w-full border-l-4 border-[#B08D57] bg-[#B08D57]/10 text-[#8C6F3F] text-xs rounded-sm px-3.5 py-2.5 mb-5">
            {verifymsg}
          </div>
        )}

        <div className="w-full border-t border-[#DCD1B8] pt-5 flex flex-col gap-2.5">
          <button
            onClick={signOut}
            className="flex items-center justify-center gap-2 bg-[#0B1220] hover:bg-[#1C2740] transition-colors text-[#F6F1E7] text-sm font-medium py-2.5 rounded-sm"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>

          <button
            onClick={openEmail}
            className="flex items-center justify-center gap-2 border border-[#C7BA98] text-[#4A4636] hover:border-[#B08D57] hover:text-[#8C6F3F] transition-colors text-sm font-medium py-2.5 rounded-sm"
          >
            <LifeBuoy className="h-4 w-4" />
            Contact support
          </button>

          <button
            onClick={() => router("/app-download")}
            className="flex items-center justify-center gap-2 border border-[#B08D57] text-[#8C6F3F] hover:bg-[#B08D57] hover:text-[#F6F1E7] transition-colors text-sm font-medium py-2.5 rounded-sm"
          >
            Download app
          </button>
        </div>
      </div>

      <p className="absolute bottom-0 left-0 right-0 text-center py-2 text-[#5B6172] text-xs">
        © {new Date().getFullYear()} AU Exam App. All rights reserved.
      </p>
    </div>
  );
}