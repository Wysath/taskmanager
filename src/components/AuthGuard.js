"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const AuthGuard = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-on-surface-variant text-lg font-medium animate-pulse">Chargement...</span>
      </div>
    );
  }

  if (!user) {
    // On ne retourne rien, la redirection s'effectue
    return null;
  }

  return children;
};

export default AuthGuard;
