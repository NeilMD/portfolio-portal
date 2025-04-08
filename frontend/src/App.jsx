import { useState } from "react";
import { Navbar } from "./sections/Navbar";
import HeroSectionOne from "@/components/ui/hero-section-demo-1";

function App() {
  return (
    <div>
      <Navbar />
      <HeroSectionOne />
      <section className="min-h-screen bg-gray-300"></section>
    </div>
  );
}

export default App;
