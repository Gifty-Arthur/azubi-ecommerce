"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, X, Loader2 } from "lucide-react";
// 1. IMPORT the useAuth hook to get the correct supabase instance
import { useAuth } from "./Account/AuthContext";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void; // Function to open the login modal
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
}) => {
  // 2. GET the stable supabase client instance from our corrected AuthContext
  const { supabase } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Now 'supabase' is correctly defined and will work
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        // This adds the full_name to the user's metadata upon registration
        data: {
          full_name: fullName,
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Success! Please check your email to confirm your account.");
      // We don't need to call router.refresh() here, as the user needs to confirm their email first.
      // We can close the modal after a short delay.
      setTimeout(() => {
        onClose();
      }, 3000);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative animate-in fade-in-0 zoom-in-95"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full px-3 h-[50px] bg-[#E6EFF5] py-2 border border-gray-300 rounded-sm shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
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
          {success && (
            <p className="text-sm text-green-600 text-center">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[45px] bg-[#01589A] text-white font-semibold py-2 px-4 rounded-sm hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin} // Switch to the login modal
            type="button"
            className="inline-flex items-center gap-1 text-[#01589A] hover:underline"
          >
            <span>Login</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterModal;
