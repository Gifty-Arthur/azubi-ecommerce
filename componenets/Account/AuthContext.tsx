// components/Account/AuthContext.tsx
"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
// 1. Import the SupabaseClient type and your new createClient function
import { createClient } from "@/lib/supabaseClient";
import { Session, User, SupabaseClient } from "@supabase/supabase-js";

// Define the shape of the context, including the supabase client
interface AuthContextType {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  supabase: SupabaseClient; // The client instance
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // 2. Use useState with an explicit type to create and store the client instance ONCE.
  // The function inside useState ensures createClient() is only called on the initial render.
  const [supabase] = useState<SupabaseClient>(() => createClient());

  // State for session and user details
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Helper function to update all auth-related states from a session object
    const updateAuthStates = (newSession: Session | null) => {
      setSession(newSession);
      const newUser = newSession?.user ?? null;
      setUser(newUser);
      // Check for the admin flag in user_metadata
      setIsAdmin(newUser?.user_metadata?.is_admin === true);
      setLoading(false);
    };

    // Immediately fetch the current session to set the initial state
    supabase.auth.getSession().then(({ data: { session } }) => {
      updateAuthStates(session);
    });

    // Set up a listener for any changes in authentication state (e.g., login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        updateAuthStates(session);
      }
    );

    // Clean up the listener when the component unmounts to prevent memory leaks
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]); // Add 'supabase' to the dependency array of useEffect

  // Provide the stable supabase client and auth state to the rest of the app
  const value = { session, user, isAdmin, loading, supabase };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to easily access the auth context from any component
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
