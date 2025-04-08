import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { LoginForm } from "@/components/login-form";
import { Navbar } from "./sections/Navbar";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Navbar />
        </div>
      </div>
    </>
  );
}

export default App;
