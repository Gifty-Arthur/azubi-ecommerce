"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, X } from "lucide-react";
import { supabase } from "../lib/supabaseClient"; // Corrected import path

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void; // Function to open the register modal
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); // 1. Re-add success state

  const router = useRouter();

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    // Call the Supabase signIn function
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      // 2. Set the success message
      setSuccess("Registration successful! ");

      setTimeout(() => {
        onClose();
        router.push("/");
      }, 2000); // 2000 milliseconds = 2 seconds
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 h-[50px] bg-[#E6EFF5] py-2 border border-gray-300 rounded-sm shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 h-[50px] bg-[#E6EFF5] py-2 border border-gray-300 rounded-sm shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full h-[45px] bg-[#01589A] text-white font-semibold py-2 px-4 rounded-sm hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          New customer?{" "}
          <button
            onClick={onSwitchToRegister} // Switch to the register modal
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
