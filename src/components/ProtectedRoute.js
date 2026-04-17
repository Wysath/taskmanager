"use client";

import { useEffect, useRef, useState } from "react";
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
  const [isClient, setIsClient] = useState(false);

  // Marquer qu'on est côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Rediriger si pas connecté
  useEffect(() => {
    if (!isClient) return;
    if (loading) return; // Attendre la fin du chargement
    if (redirectedRef.current) return; // Déjà redirigé
    
    if (!user) {
      // Pas connecté → rediriger vers login
      redirectedRef.current = true;
      router.replace("/login");
    }
  }, [isClient, loading, user, router]);

  // Ne pas afficher pendant le chargement ou la redirection
  if (!isClient || loading) {
    return null;
  }

  // Pas connecté → redirection en cours, ne pas afficher
  if (!user && redirectedRef.current) {
    return null;
  }

  // Connecté → afficher le contenu
  return <div suppressHydrationWarning>{children}</div>;
}

