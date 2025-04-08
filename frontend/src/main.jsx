import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./login/Login";
import Signup from "./signup/Signup";
import Home from "./home/Home";
import EditProfile from "./profile/EditProfile";

const root = document.getElementById("root");

createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile/edit" element={<EditProfile />} />
    </Routes>
  </BrowserRouter>
);
