import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddPaper from "./pages/AddPaper";
import EditPaper from "./pages/EditPaper";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Auth from "./pages/auth";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="bg-[#030014] absolute w-full top-16 min-h-[84vh] pb-10">
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/add-paper" element={<AddPaper />} />
        <Route path="/edit-paper" element={<EditPaper />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      </div>
    </BrowserRouter>
  );
}
