"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient"; // Corrected import path

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); // 1. Re-add success state
  const router = useRouter();

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null); // Reset success on new submission

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      // 2. Set the success message
      setSuccess("Registration successful! ");

      // 3. Wait 2 seconds, then close the modal and redirect
      setTimeout(() => {
        onClose();
        router.push("/login");
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
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 h-[50px] bg-[#E6EFF5] py-2 border border-gray-300 rounded-sm shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email address *"
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
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 h-[50px] bg-[#E6EFF5] py-2 border border-gray-300 rounded-sm shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* 4. Conditionally render the success message */}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <button
            type="submit"
            className="w-full h-[45px] bg-[#01589A] text-white font-semibold py-2 px-4 rounded-sm hover:bg-blue-700 transition-colors"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <button
            type="button"
            className="inline-flex items-center gap-1 text-[#01589A] hover:underline"
          >
            <span>Login here</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterModal;
