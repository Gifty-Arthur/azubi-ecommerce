"use client";

import React, { useState } from "react"; // NEW: Import useState
import { ArrowUpRight, X } from "lucide-react";
import { registerUser } from "@/lib/authApi";
interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  // NEW: State to hold form data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // If the modal is not open, don't render anything
  if (!isOpen) {
    return null;
  }

  // NEW: Function to handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const result = await registerUser({ name, email, password });
      setSuccess("Registration successful! You can now log in.");
      console.log("Success:", result);
      // You could automatically close the modal here after a delay
      // setTimeout(() => onClose(), 2000);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      console.error("Failure:", err);
    }
  };

  return (
    // Main container for the modal with a semi-transparent background
    <div
      onClick={onClose} // Close the modal if the background is clicked
      className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      {/* Modal content container */}
      <div
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>
        {/* Modal Header */}
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        {/* Registration Form */}
        {/* NEW: Attach the handleSubmit function */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            {/* NEW: Connect input to state */}
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

          {/* NEW: Display success or error messages */}
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
