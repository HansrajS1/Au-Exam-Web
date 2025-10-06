import { Routes, Route, useLocation } from "react-router-dom";
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
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import AppDownload from "./pages/AppDownload";


function AppRoutes() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";
  const isResetPasswordPage = location.pathname === "/reset-password";
  const isVerifyEmailPage = location.pathname === "/verify-email";
  const isAppDownloadPage = location.pathname === "/app-download";
  const isMobile = useIsMobile();

  return (
    <>
      {!isAuthPage && !isResetPasswordPage && !isVerifyEmailPage && !isAppDownloadPage && <Navbar />}
      <div className={!isAuthPage && !isMobile && !isResetPasswordPage && !isVerifyEmailPage && !isAppDownloadPage ? "pt-16" : ""}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/add-paper" element={<AddPaper />} />
          <Route path="/edit-paper" element={<EditPaper />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/app-download" element={<AppDownload />} />
        </Routes>
      </div>

      {!isAuthPage && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
      <RouterGuard>
        <AppRoutes />
      </RouterGuard>
  );
}
