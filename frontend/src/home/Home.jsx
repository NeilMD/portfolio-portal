import { WavyBackground } from "@/components/ui/wavy-background";
import React from "react";
import { Navbar } from "../sections/Navbar";
import HeroSectionOne from "@/components/ui/hero-section-demo-1";

const Home = () => {
  return (
    <div>
      <Navbar />
      <HeroSectionOne />
      <section className="min-h-screen bg-gray-300"></section>
    </div>
  );
};

export default Home;
