"use client";

import React, { useState } from "react";
import RegisterModal from "./RegisterModal";
import LoginModal from "./LoginModal";
import { LogIn, User } from "lucide-react";

const AuthModals = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Function to open the register modal and close the login one
  const openRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  // Function to open the login modal and close the register one
  const openLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="font-semibold text-black hover:text-blue-600 transition-colors"
        >
          <LogIn className="inline-block w-5 h-5 mr-2 -mt-1" />
          Login
        </button>
        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="text-black font-semibold px-4 py-2 transition-colors hover:text-blue-600"
        >
          <User className="inline-block w-5 h-5 mr-1 -mt-1" />
          Register
        </button>
      </div>

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={openLogin} // Pass function to switch to login
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={openRegister} // Pass function to switch to register
      />
    </>
  );
};

export default AuthModals;
