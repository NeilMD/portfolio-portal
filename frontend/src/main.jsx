import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login/Login";
import Signup from "./signup/Signup";
import Home from "./home/Home";
import EditProfile from "./profile/EditProfile";
import ProtectedLayout from "@/routes/ProtectedLayout";
import AuthProvider from "@/context/AuthProvider";

const root = document.getElementById("root");

createRoot(root).render(
  <Router>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes inside ProtectedLayout */}
        <Route element={<ProtectedLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile/edit" element={<EditProfile />} />
        </Route>
      </Routes>
    </AuthProvider>
  </Router>
);
