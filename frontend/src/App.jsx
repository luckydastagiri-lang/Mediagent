import React from "react";
import MainApp from "./MainApp.jsx";
import Login from "./pages/Login.jsx";

export default function App() {
  const user = localStorage.getItem("user");

  // 🔐 If NOT logged in → show login page
  if (!user) {
    return <Login />;
  }

  // ✅ If logged in → show full app
  return <MainApp />;
}
