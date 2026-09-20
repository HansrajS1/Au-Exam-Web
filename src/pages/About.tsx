import { icons } from "../constants/icons";
import { images } from "../constants/images";
import { useNavigate } from "react-router-dom";

export default function About() {
  const router = useNavigate();

  const fontImport = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Inter:wght@400;500;600&display=swap');
      .ap-serif { font-family: 'Source Serif 4', Georgia, serif; }
      .ap-sans { font-family: 'Inter', system-ui, sans-serif; }
      .ap-link { color: #C9A76B; text-decoration: none; border-bottom: 1px solid rgba(201,167,107,0.35); transition: border-color .15s ease; }
      .ap-link:hover { border-color: #C9A76B; }
    `}</style>
  );

  const repos = [
    {
      name: "Au-Exam-Web",
      url: "https://github.com/hansrajS1/au-exam-web",
      desc: "Frontend React app for browsing and downloading papers.",
    },
    {
      name: "Au-Exam-Backend",
      url: "https://github.com/hansrajS1/au-exam-backend",
      desc: "Backend Express API for paper management.",
    },
    {
      name: "Au-Exam-App",
      url: "https://github.com/hansrajS1/au-exam-app",
      desc: "Android app built with React Native for mobile access.",
    },
  ];

  const contributors = [
    { name: "Hans Raj", url: "https://github.com/hansrajS1" },
    { name: "Deepak Kumar", url: "https://github.com/Deepakkr004" },
    { name: "Naveen Kumar", url: "https://github.com/0Naveen2" },
  ];

  const capabilities = [
    "Create an account and sign in securely",
    "Browse and search sample papers easily",
    "Access papers from all semesters",
    "View subject details and metadata",
    "Upload question papers in PDF format",
    "Download papers instantly in PDF format",
  ];

  return (
    <div className="ap-sans min-h-screen bg-[#0B1220] bg-[radial-gradient(circle_at_15%_0%,#141B2E,transparent_45%)] text-[#D7DAE3]">
      {fontImport}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-14">
          <img src={icons.logo} alt="Logo" className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h1 className="ap-serif text-[#F6F1E7] text-[34px] sm:text-[40px] leading-tight mb-3">
            About AU Exam Web
          </h1>
          <p className="text-[#8A90A6] text-[15px] leading-relaxed max-w-md mx-auto">
            A digital library of previous years' end-semester question papers,
            built for students, by students.
          </p>
        </div>

        {/* What you can do */}
        <section className="mb-12">
          <h2 className="ap-serif text-[#F6F1E7] text-xl mb-5">What you can do here</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {capabilities.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[#B9BDCC] text-sm leading-relaxed">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 bg-[#B08D57]" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <hr className="border-[#232B44] mb-12" />

        {/* Why use this */}
        <section className="mb-12">
          <p className="ap-serif text-[#EDE7D8] text-xl sm:text-2xl leading-snug italic">
            "No more endless searching — select your course, semester, and
            subject, and download the paper instantly."
          </p>
          <p className="text-[#8A90A6] text-sm mt-4 leading-relaxed">
            Fast, reliable, and built around how students actually look for
            past papers.
          </p>
        </section>

        <hr className="border-[#232B44] mb-12" />

        {/* Repositories */}
        <section className="mb-12">
          <h2 className="ap-serif text-[#F6F1E7] text-xl mb-5">Project repositories</h2>
          <div className="divide-y divide-[#232B44] border-t border-b border-[#232B44]">
            {repos.map((repo) => (
              <div key={repo.name} className="py-4 flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ap-link text-sm font-medium w-40 flex-shrink-0"
                >
                  {repo.name}
                </a>
                <p className="text-[#8A90A6] text-sm mt-1 sm:mt-0">{repo.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-[#5B6172] text-xs mt-4">Come contribute and make it better.</p>
        </section>

        <hr className="border-[#232B44] mb-12" />

        {/* Contributors */}
        <section className="mb-12">
          <h2 className="ap-serif text-[#F6F1E7] text-xl mb-5">Contributors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {contributors.map((c) => (
              <div key={c.name} className="border border-[#232B44] rounded-sm px-4 py-3.5">
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="ap-link text-sm font-medium">
                  {c.name}
                </a>
                <p className="text-[#8A90A6] text-xs mt-1.5 leading-relaxed">
                  BTech CSE Final Year Student at Alliance University, Bangalore
                </p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-[#232B44] mb-12" />

        {/* Get involved */}
        <section className="mb-14">
          <h2 className="ap-serif text-[#F6F1E7] text-xl mb-3">Get involved</h2>
          <p className="text-[#B9BDCC] text-sm leading-relaxed">
            We welcome contributions from everyone — reporting bugs, suggesting
            features, or submitting code. Your input is valuable.
          </p>
        </section>

        {/* Download + QR */}
        <section className="mb-14 flex flex-col sm:flex-row items-center gap-8 justify-between border border-[#232B44] rounded-sm px-6 py-7">
          <div className="text-center sm:text-left">
            <p className="ap-serif text-[#F6F1E7] text-lg mb-1">Android app is live</p>
            <p className="text-[#8A90A6] text-sm mb-4 max-w-xs">
              Get the mobile app for on-the-go access to your papers.
            </p>
            <button
              onClick={() => router("/app-download")}
              className="bg-[#B08D57] hover:bg-[#96754A] cursor-pointer transition-colors px-6 py-2.5 rounded-sm text-[#0B1220] text-sm font-semibold"
            >
              Download for Android
            </button>
          </div>
          <div className="bg-[#F6F1E7] p-4 rounded-sm text-center flex-shrink-0">
            <img src={images.QR} alt="QR Code" className="h-36 w-36 mx-auto" />
            <p className="text-[#6B6455] text-xs mt-2.5">Scan with your phone camera</p>
          </div>
        </section>

        {/* Contact */}
        <div className="text-center">
          <p className="text-[#B9BDCC] text-sm mb-6">
            Questions or feedback? Reach out at{" "}
            <a href="mailto:auexamapp@gmail.com" className="ap-link">
              auexamapp@gmail.com
            </a>
          </p>
          <div className="text-xs text-[#5B6172] space-y-1">
            <p>
              Made by{" "}
              <a href="https://github.com/hansrajS1" target="_blank" rel="noopener noreferrer" className="ap-link">
                Hans Raj
              </a>
            </p>
            <p>
              Open source on{" "}
              <a
                href="https://github.com/hansrajS1/au-exam-web"
                target="_blank"
                rel="noopener noreferrer"
                className="ap-link"
              >
                GitHub
              </a>
            </p>
          </div>
        </div>
      </div>

      <footer className="text-center border-t border-[#232B44] py-3 text-[#5B6172] text-xs">
        Made for students, free forever
      </footer>
    </div>
  );
}