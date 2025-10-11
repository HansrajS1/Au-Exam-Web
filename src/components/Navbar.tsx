import { NavLink, useNavigate } from "react-router-dom";
import { icons } from "../constants/icons";
import { useIsMobile } from "../hook/useIsMobile";

export default function Navbar() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  if (isMobile) return null;

  return (
    <nav className="bg-[#0f0D23] text-white px-4 py-3 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-between items-center">
        <div onClick={() => navigate("/")} className="flex items-center cursor-pointer gap-2">
          <img src={icons.logo} alt="AU Exam App" className="w-12 h-12" />
          <span className="text-lg font-bold">AU Exam App</span>
        </div>

        <div className="flex gap-6 items-center">
          {["/", "/add-paper", "/ask-ai", "/about", "/profile"].map((path, i) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                isActive ? "text-green-400 font-semibold" : "hover:text-green-300"
              }
            >
              {["Home", "Add Paper", "Ask AI", "About", "Profile"][i]}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
