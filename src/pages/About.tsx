import { icons } from "../constants/icons";
import { useNavigate } from "react-router-dom";

export default function About() {
  const router = useNavigate();
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[#030014] to-[#0a0a23] text-white px-4 py-1">
        <div className="max-w-3xl mx-auto text-center pb-16">
          <img
            src={icons.logo}
            alt="Logo"
            className="h-30 w-30 mx-auto mb-6 animate-pulse"
          />

          <h1 className="text-3xl font-extrabold mb-4 tracking-tight">
            About <span className="text-green-400">AU Exam Web</span>
          </h1>

          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Welcome to <span className="font-bold text-white">AU Exam Web</span>{" "}
            — your personal digital library for previous year’s end-semester
            question papers. Designed for students, by students.
          </p>

          <div className="bg-[#1a1a2e] rounded-xl p-6 mb-8 shadow-md">
            <h2 className="text-2xl font-semibold mb-4"> Features</h2>
            <ul className="text-gray-300 space-y-2 list-disc list-inside text-left">
              <li>Create an account and sign in securely.</li>
              <li>Browse and search sample papers easily.</li>
              <li>Access papers from all semesters.</li>
              <li>View subject details and metadata.</li>
              <li>Upload question papers in PDF format.</li>
              <li>Download papers instantly in PDF format.</li>
            </ul>
          </div>

          <div className="bg-[#1a1a2e] rounded-xl p-6 mb-8 shadow-md">
            <h2 className="text-2xl font-semibold mb-4"> Why Use This App?</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              No more endless searching. Just open the app, select your course,
              semester, and subject and download the papers instantly. It’s
              fast, reliable, and built for your academic success.
            </p>
          </div>

          <div className="bg-[#1a1a2e] rounded-xl p-6 mb-8 shadow-md">
            <h2 className="text-2xl font-semibold mb-4">
              Project Repositories
            </h2>
            <ul className="text-gray-300 space-y-2 list-disc list-inside text-left">
              <li>
                <a
                  href="https://github.com/hansrajS1/au-exam-web"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 "
                >
                  Au-Exam-Web
                </a>{" "}
                – Frontend React app for browsing and downloading papers
              </li>
              <li>
                <a
                  href="https://github.com/hansrajS1/au-exam-backend"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400"
                >
                  Au-Exam-Backend
                </a>{" "}
                – Backend Express API for paper management
              </li>
              <li>
                <a
                  href="https://github.com/hansrajS1/au-exam-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400"
                >
                  Au-Exam-App
                </a>{" "}
                – Android app built with React Native for mobile access
              </li>
            </ul>
            <p className="text-sm text-gray-400 mt-4">
              Come contribute and make it better!
            </p>
          </div>

          <div className="bg-[#1a1a2e] rounded-xl p-6 mb-8 shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Contributors</h2>
            <ul className="text-gray-300 space-y-2 list-disc list-inside text-left">
              <li>
                <a
                  href="https://github.com/hansrajS1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400"
                >
                  Hans Raj
                </a>{" "}
                - BTech CSE Final Year Student at Alliance University, Bangalore.
              </li>
              <li>
                <a
                  href="https://github.com/Deepakkr004"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400"
                >
                  Deepak Kumar
                </a>{" "}
                - BTech CSE Final Year Student at Alliance University, Bangalore.
              </li>
              <li>
                <a
                  href="https://github.com/0Naveen2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400"
                >
                  Naveen Kumar
                </a>{" "}
                - BTech CSE Final Year Student at Alliance University, Bangalore.
              </li>
            </ul>
          </div>

          <div className="bg-[#1a1a2e] rounded-xl p-6 mb-8 shadow-md">
            <h2 className="text-2xl font-semibold mb-4"> Get Involved</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              We welcome contributions from everyone! Whether it's reporting
              bugs, suggesting features, or submitting code, your input is
              valuable.
            </p>
          </div>

          <button
            onClick={() =>
              router("/app-download")
            }
            className="bg-green-500 hover:bg-green-600 cursor-pointer transition-colors px-6 py-2 rounded-full text-white font-semibold mb-6"
          >
            Android Download is Live!
          </button>

          <p className="text-gray-300 text-lg mb-4">
            Questions or feedback? Reach out at{" "}
            <a
              href="mailto:auexamapp@gmail.com"
              className="text-blue-400"
            >
              auexamapp@gmail.com 
            </a>
          </p>
          <div className="text-sm text-gray-500 space-y-1 ">
            <p>
              Made by{" "}
              <a
                href="https://github.com/hansrajS1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 "
              >
                Hans Raj
              </a>
            </p>
            <p>
              Open source on{" "}
              <a
                href="https://github.com/hansrajS1/au-exam-web"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                GitHub
              </a>
            </p>
          </div>
        </div>
      </div>

      <footer className="text-center bg-[#090821] relative bottom-0 left-0 right-0 text-gray-400 text-xs">
        Made for students, free forever
      </footer>
    </>
  );
}
