"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Wrapper pour protéger les routes authentifiées
 * Redirige vers /login si pas connecté (en background, après hydration)
 * 
 * NOTE: Avec output: 'export' (static export), le serveur pré-rend sans auth.
 * Le client hydrate avec auth context.
 * suppressHydrationWarning permet ce mismatch intentionnel.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const redirectedRef = useRef(false);

  // Rediriger APRÈS hydration si pas connecté (une seule fois)
  useEffect(() => {
    if (!loading && !user && !redirectedRef.current) {
      redirectedRef.current = true;
      router.replace("/login");
    }
  }, [loading, user, router]);

  // ✅ IMPORTANT: Toujours rendre le contenu (même si pas connecté à la build)
  // Pour éviter hydration mismatch avec server pre-render
  // suppressHydrationWarning accepte le mismatch intentionnel
  return (
    <div suppressHydrationWarning>
      {children}
    </div>
  );
}

