import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import AddPaper from "./pages/AddPaper";
import EditPaper from "./pages/EditPaper";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Auth from "./pages/auth";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import RouterGuard from "./RouterGuard";
import { useIsMobile } from "./hook/useIsMobile";

function AppRoutes() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";
  const isMobile = useIsMobile();

  return (
    <>
      {!isAuthPage && <Navbar />}
      <div className={!isAuthPage && !isMobile ? "pt-16" : ""}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/add-paper" element={<AddPaper />} />
          <Route path="/edit-paper" element={<EditPaper />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>

      {!isAuthPage && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <RouterGuard>
        <AppRoutes />
      </RouterGuard>
    </BrowserRouter>
  );
}
