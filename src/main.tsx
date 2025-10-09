import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./lib/authcontext.tsx";
import { BrowserRouter } from "react-router-dom";

if (import.meta.env.VITE_MODE === "production") {
  window.addEventListener("unhandledrejection", (event) => event.preventDefault());
  window.addEventListener("error", (event) => event.preventDefault());
  console.log = () => {};
  console.warn = () => {};
}


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
