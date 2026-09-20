import { icons } from "../constants/icons";
import { images } from "../constants/images";
import { useNavigate } from "react-router-dom";

export default function AppDownload() {
  const router = useNavigate();

  const fontImport = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Inter:wght@400;500;600&display=swap');
      .ap-serif { font-family: 'Source Serif 4', Georgia, serif; }
      .ap-sans { font-family: 'Inter', system-ui, sans-serif; }
    `}</style>
  );

  return (
    <div className="ap-sans min-h-screen bg-[#0B1220] bg-[radial-gradient(circle_at_85%_0%,#141B2E,transparent_45%)] text-[#D7DAE3]">
      {fontImport}

      <header className="border-b border-[#232B44]">
        <div className="max-w-[700px] mx-auto flex flex-wrap-reverse items-center justify-between gap-4 py-8 px-4 text-center sm:text-left">
          <div>
            <h1 onClick={() => router("/")} className="ap-serif text-[#F6F1E7] text-2xl cursor-pointer">
              AU Exam App
            </h1>
            <p className="mt-1.5 text-[#8A90A6] text-sm">Submit and manage academic papers with ease</p>
          </div>
          <img
            onClick={() => router("/")}
            src={icons.logo}
            alt="AU Exam App logo"
            className="w-14 h-14 rounded-full cursor-pointer border border-[#232B44] opacity-90"
          />
        </div>
      </header>

      <main className="max-w-[700px] mx-auto my-10 px-4 text-center">
        <div className="rounded-sm overflow-hidden border border-[#232B44] max-w-md mx-auto">
          <video autoPlay muted loop controls className="w-full block" poster="/thumbnail.jpg">
            <source
              src="https://auexamapp.netlify.app/assets/Au%20Exam%20App%20video.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        <div className="flex mt-10 justify-center">
          <div className="bg-[#F6F1E7] p-6 rounded-sm text-center">
            <p className="ap-serif text-[#171A21] text-lg mb-3">Download the Android app</p>
            <img src={images.QR} alt="QR Code" className="h-40 w-40 mx-auto" />
            <p className="text-[#6B6455] text-xs mt-3">Scan with your phone camera</p>
          </div>
        </div>

        <p className="text-[#B9BDCC] text-[15px] leading-relaxed my-10 max-w-md mx-auto text-left sm:text-center">
          The official mobile app for Alliance University students to upload
          academic papers, preview submissions, and contribute to the
          academic repository. Available for Android and iOS.
        </p>

        <div className="flex justify-center flex-wrap gap-3 mb-4">
          <button
            onClick={() => router("/")}
            className="px-6 py-3 text-[#D7DAE3] border border-[#2A3552] cursor-pointer rounded-sm text-sm font-medium hover:border-[#B08D57] hover:text-[#B08D57] transition-colors"
          >
            Web version
          </button>

          <a
            href="https://github.com/HansrajS1/Au-Exam-App/releases/latest/download/app-release.apk"
            className="px-6 py-6 text-[#0B1220] bg-[#B08D57] hover:bg-[#96754A] cursor-pointer rounded-sm text-sm font-semibold transition-colors"
          >
            Download for Android
          </a>

          <div className="px-6 py-3 text-[#5B6172] border border-[#232B44] rounded-sm text-sm font-medium cursor-not-allowed">
            Download for iOS
            <p className="text-xs mt-0.5">Coming soon</p>
          </div>
        </div>
      </main>

      <footer className="text-center border-t border-[#232B44] py-4 text-xs text-[#5B6172]">
        &copy; {new Date().getFullYear()} AU Exam App. Built by Hans Raj
      </footer>
    </div>
  );
}