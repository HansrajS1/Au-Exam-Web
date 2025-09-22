import { useState } from "react";
import { NavLink} from "react-router-dom";
import { icons } from "../constants/icons";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  function router(path: string): void {
    navigate(path);
  }
  return (
    <nav className="bg-[#0f0D23] text-white px-6 py-4 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-between items-center">

        <div onClick={() => router("/")} className="flex items-center cursor-pointer gap-2">
          <img src={icons.logo} alt="AU Exam App"  className="w-8 h-8" />
          <span className="text-lg font-bold">AU Exam App</span>
        </div>

        <div className="hidden md:flex gap-6 items-center">
          {["/", "/add-paper", "/about", "/profile"].map((path, i) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                isActive ? "text-green-400 font-semibold" : "hover:text-green-300"
              }
            >
              {["Home", "Add Paper", "About", "Profile"][i]}
            </NavLink>
          ))}
        </div>

        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4">
          {["/", "/add-paper", "/about", "/profile"].map((path, i) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                isActive ? "text-green-400 font-semibold" : "hover:text-green-300"
              }
            >
              {["Home", "Add Paper", "About", "Profile"][i]}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
