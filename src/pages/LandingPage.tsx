export default function LandingPage() {
  return (
    <div className="bg-black text-white font-sans">
      <header className="bg-[#2c3e50] text-white py-8 px-4 flex flex-wrap-reverse items-center justify-around">
        <div className="text-center">
          <h1 className="text-3xl font-bold">AU Exam App</h1>
          <p className="mt-2 text-sm opacity-85">
            Submit and manage academic papers with ease
          </p>
        </div>
        <img
          src="/assets/AppIcon.png"
          alt="AU Exam App Logo"
          className="w-24 rounded-full shadow-md mb-4"
        />
      </header>

      <main className="max-w-3xl mx-auto mt-8 px-4 py-6 bg-black rounded-xl shadow-md text-center">

        <div className="rounded-xl overflow-hidden shadow-lg mb-6">
          <video
            autoPlay
            muted
            loop
            controls
            className="w-full max-w-xl mx-auto rounded-xl"
          >
            <source src="/assets/Au Exam App video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <p className="text-lg leading-relaxed text-justify text-white mb-6">
          The official mobile app for Alliance University students to upload
          academic papers, preview submissions, and contribute to the academic
          repository. Available for Android and iOS.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <a
            href="/assets/AU Exam App-release.apk"
            className="bg-[#6c63ff] text-white px-6 py-3 rounded-lg text-base hover:scale-105 transition-transform"
          >
            Download for Android
          </a>
          <div className="flex flex-col items-center">
            <button className="bg-[#28a745] text-white px-6 py-3 rounded-lg text-base cursor-default">
              Download for iOS
            </button>
            <p className="text-xs text-white mt-1">Coming soon</p>
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-sm text-gray-400">
        &copy; {new Date().getFullYear()} AU Exam App. Built by Hans Raj
      </footer>
    </div>
  );
}
