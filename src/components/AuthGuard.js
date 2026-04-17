"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const AuthGuard = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const redirectToLogin = useCallback(() => {
    router.replace("/login");
  }, [router]);

  useEffect(() => {
    if (!loading && !user) {
      redirectToLogin();
    }
  }, [loading, user, redirectToLogin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-on-surface-variant text-lg font-medium animate-pulse">
          Chargement...
        </span>
      </div>
    );
  }

  if (!user) return null;

  return children;
};

export default AuthGuard;
