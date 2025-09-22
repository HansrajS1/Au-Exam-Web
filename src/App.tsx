import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import AddPaper from "./pages/AddPaper";
import EditPaper from "./pages/EditPaper";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Auth from "./pages/auth";
import Navbar from "./components/Navbar";
import RouterGuard from "./RouterGuard";

function AppRoutes() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/auth";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className={hideNavbar ? "" : "pt-15"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/add-paper" element={<AddPaper />} />
          <Route path="/edit-paper" element={<EditPaper />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
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
