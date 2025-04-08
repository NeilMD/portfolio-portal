import { SignupForm } from "@/components/signup-form";
import React from "react";

const Signup = () => {
  return (
    <>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SignupForm />
        </div>
      </div>
    </>
  );
};

export default Signup;
