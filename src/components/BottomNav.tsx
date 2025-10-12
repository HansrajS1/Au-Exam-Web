import { NavLink, useLocation } from "react-router-dom";
import { icons } from "../constants/icons";
import { images } from "../constants/images";

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: icons.home },
    { path: "/add-paper", label: "Add Paper", icon: icons.add },
    { path: "/ask-ai", label: "Ask AI", icon: icons.ai },
    { path: "/about", label: "About", icon: icons.about },
    { path: "/profile", label: "Profile", icon: icons.person },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a2e] md:hidden justify-between min-h-[50px] flex items-center rounded-t-xl shadow-lg border border-[#2c2c3a]">
      {navItems.map(({ path, label, icon }) => {
        const isActive = location.pathname === path;

        return (
          <NavLink key={path} to={path} className="flex w-full items-center justify-center">
            {isActive ? (
              <div
                className="flex items-center justify-center rounded-full min-w-[120px] min-h-[50px] overflow-hidden"
                style={{
                  backgroundImage: `url(${images.highlight})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <img
                  src={icon}
                  alt={label}
                  className={`w-5 h-5 ${
                    label === "About" || label === "Profile" ? "filter invert brightness-200" : "text-black-400"
                  }`}
                />
                <span className="ml-3 text-base font-semibold text-black">{label}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <img
                  src={icon}
                  alt={label}
                  className={`w-5 h-5 ${
                    label === "About" || label === "Profile" ? "text-black-400" : "filter invert brightness-200"
                  }`}
                />
              </div>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
