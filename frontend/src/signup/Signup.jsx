import { SignupForm } from "@/components/signup-form";
import React from "react";
import { Navbar } from "../sections/Navbar";
import { DialogOverlay } from "@radix-ui/react-dialog";

const Signup = () => {
  return (
    <div>
      <Navbar />
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default Signup;
