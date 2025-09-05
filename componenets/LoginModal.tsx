"use client";

import { ArrowUpRight, X } from "lucide-react";
import React from "react";

// The props this component will accept
interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      onClick={onClose} // Close the modal if the background is clicked
      className="fixed inset-0  bg-opacity-50 backdrop-blur-sm  z-50 flex items-center justify-center"
    >
      {/* Modal content container */}
      <div
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative"
      >
        {/* Close button */}
        <div className="flex flex-row items-center justify-between">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
          {/* Modal Header */}
          <h2 className="text-[24px] text-black  text-center mb-6 -mt-2">
            Login
          </h2>
        </div>

        {/* Registration Form */}
        <form className="space-y-4">
          <div>
            {" "}
            <input
              type="email"
              placeholder="Email address *"
              className="mt-1 block w-full px-3 h-[50px]  bg-[#E6EFF5] py-2 border border-gray-300 rounded-sm shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-blackd"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password *"
              className="mt-1 block w-full px-3 h-[50px] bg-[#E6EFF5] py-2 border border-gray-300 rounded-sm shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
            />
          </div>
          <button
            type="submit"
            className="w-full h-[50px] bg-[#01589A] text-white font-semibold py-2 px-4 rounded-sm hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </form>

        {/* Link to Login */}
        <p className="text-center text-sm text-gray-600 mt-4">
          New customer?{" "}
          <button
            type="button"
            className="inline-flex items-center gap-1 text-[#01589A] hover:underline"
          >
            <span>Create your account</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
