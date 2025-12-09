import { icons } from "../constants/icons";
import { images } from "../constants/images";
import { useNavigate } from "react-router-dom";

export default function AppDownload() {
  const router = useNavigate();
  return (
    <div className="min-h-screen bg-black text-[#333] font-sans">
      <header className="flex flex-wrap-reverse items-center justify-around bg-[#2c3e50] text-white py-8 px-4 text-center">
        <div>
          <h1
            onClick={() => router("/")}
            className="text-3xl cursor-pointer font-bold m-0"
          >
            AU Exam App
          </h1>
          <p className="mt-2 text-sm opacity-85">
            Submit and manage academic papers with ease
          </p>
        </div>
        <img
          onClick={() => router("/")}
          src={icons.logo}
          alt="AU Exam App Logo"
          className="w-[100px] mb-4 rounded-full cursor-pointer shadow-md"
        />
      </header>

      <main className="max-w-[700px] mx-auto my-8 p-8 bg-black rounded-xl shadow-md text-center">

        <div className="rounded-xl overflow-hidden shadow-md mt-4">
          <video
            autoPlay
            muted
            loop
            controls
            className="w-1/2 mx-auto rounded-xl"
            poster="/thumbnail.jpg"
          >
            <source src="/Au-Exam-App-video.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="flex mt-8 justify-center">
          <div className="bg-[#1a1a2e] p-6 rounded-xl shadow-lg w-fit text-center">
            <h3 className="text-lg font-semibold mb-3 text-white">
              Download Android App
            </h3>
            <img
              src={images.QR}
              alt="QR Code"
              className="h-48 w-48 bg-amber-50 mx-auto rounded-lg"
            />
            <p className="text-gray-400 text-xs mt-3">
              Scan with your phone camera
            </p>
          </div>
        </div>

        <p className="text-white text-justify text-[1.1rem] leading-relaxed my-8">
          The official mobile app for Alliance University students to upload
          academic papers, preview submissions, and contribute to the academic
          repository. Available for Android and iOS.
        </p>



        <div className="flex justify-center flex-wrap gap-4 mb-8">
          <a
            onClick={() => router("/")}
            className="px-6 py-3 text-white bg-[rgb(143,44,44)] content-center cursor-pointer rounded-lg text-base hover:scale-105 transition-transform"
          >
            Web Version
          </a>

          <a
            href="https://github.com/HansrajS1/Au-Exam-App/releases/latest/download/app-release.apk"
            className="px-6 py-3 text-white bg-[#6c63ff] cursor-pointer content-center rounded-lg text-base hover:scale-105 transition-transform"
          >
            Download for Android
          </a>
          <div className="px-6 py-3 text-white bg-[#28a745] rounded-lg text-base hover:scale-105 transition-transform">
            Download for iOS
            <p className="text-xs text-white mt-1">Coming soon</p>
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-sm text-white mt-8">
        &copy; 2025 AU Exam App. Built by Hans Raj
      </footer>
    </div>
  );
}
