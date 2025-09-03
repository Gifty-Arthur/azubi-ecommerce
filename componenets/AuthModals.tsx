"use client";

import React, { useState } from "react";
import RegisterModal from "./RegisterModal";
import LoginModal from "./LoginModal";
import { LogIn, User } from "lucide-react";

// We'll add the LoginModal here later

const AuthModals = () => {
  // State to control the visibility of the register modal
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // You can add state for the login modal here later
  // const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="font-semibold text-black  hover:text-blue-600 transition-colors"
        >
          <LogIn className="inline-block w-5 h-5 mr-3 -mt-1" />
          Login
        </button>
        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className=" text-black font-semibold px-4 py-2 transition-colors hover:text-blue-600 "
        >
          <User className="inline-block w-5 h-5 mr-2 -mt-1" />
          Register
        </button>
      </div>

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)} // This function is passed down to the modal to close itself
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)} // This function is passed down to the modal to close itself
      />
    </>
  );
};

export default AuthModals;
