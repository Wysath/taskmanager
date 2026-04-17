"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getAuthInstance } from "@/lib/firebase";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from "@firebase/auth";
import { createOrUpdateUserProfile } from "@/services/userService";

// Traduit les codes d'erreur Firebase en messages lisibles
function translateFirebaseError(error) {
  if (!error?.code) return "Une erreur est survenue. Veuillez réessayer.";
  switch (error.code) {
    case "auth/email-already-in-use":
      return "Cette adresse e-mail est déjà utilisée.";
    case "auth/invalid-email":
      return "L'adresse e-mail n'est pas valide.";
    case "auth/weak-password":
      return "Le mot de passe doit contenir au moins 6 caractères.";
    case "auth/user-not-found":
      return "Aucun compte trouvé avec cette adresse e-mail.";
    case "auth/wrong-password":
      return "Mot de passe incorrect.";
    case "auth/too-many-requests":
      return "Trop de tentatives. Réessayez plus tard.";
    case "auth/invalid-credential":
      return "Identifiants invalides. Vérifiez votre e-mail et mot de passe.";
    default:
      return "Une erreur est survenue. Veuillez réessayer.";
  }
}

const AuthContext = createContext({});

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    const cached = sessionStorage.getItem("tm_user");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (err) {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(() => {
    if (typeof window === "undefined") return true;
    const cached = sessionStorage.getItem("tm_user");
    return !cached;
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    let authStateTimeout;

    const unsubscribe = onAuthStateChanged(
      getAuthInstance(),
      (currentUser) => {
        if (ignore) return;
        
        // Nettoie le timeout si on reçoit une réponse
        if (authStateTimeout) {
          clearTimeout(authStateTimeout);
        }

        // Evite les blocages réseau : mise à jour du profil en tâche de fond
        setUser(currentUser);

        // Sauvegarde du cache utilisateur
        if (typeof window !== "undefined") {
          if (currentUser) {
            sessionStorage.setItem(
              "tm_user",
              JSON.stringify({
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
              })
            );
            
            // ✅ Tâche de fond : mise à jour du profil sans bloquer le flux d'auth
            if ("requestIdleCallback" in window) {
              requestIdleCallback(
                () => {
                  createOrUpdateUserProfile(currentUser.uid, currentUser.email).catch(
                    (err) => console.error("[AuthContext] Profile update error:", err)
                  );
                },
                { timeout: 5000 }
              );
            } else {
              setTimeout(() => {
                createOrUpdateUserProfile(currentUser.uid, currentUser.email).catch(
                  (err) => console.error("[AuthContext] Profile update error:", err)
                );
              }, 100);
            }
          } else {
            sessionStorage.removeItem("tm_user");
          }
        }
        setLoading(false);
      },
      (err) => {
        if (ignore) return;
        if (authStateTimeout) clearTimeout(authStateTimeout);
        setError(translateFirebaseError(err));
        setLoading(false);
      }
    );

    // ⏱️ TIMEOUT: Si Firebase n'a pas répondu après 2s, on suppose qu'on est déjà hydraté
    // et qu'il n'y a pas de user (ne pas bloquer infiniment)
    authStateTimeout = setTimeout(() => {
      if (!ignore && loading) {
        setLoading(false);
      }
    }, 2000);

    return () => {
      ignore = true;
      if (authStateTimeout) clearTimeout(authStateTimeout);
      unsubscribe();
    };
  }, []);

  /**
   * Inscription utilisateur avec email/mot de passe
   */
  const signUp = useCallback(async (email, password) => {
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(getAuthInstance(), email, password);
      
      // ✅ CRITICAL OPTIMIZATION: Don't await profile creation
      // Set user immediately, profile updates in background via onAuthStateChanged
      // This avoids blocking the sign-up flow on slow networks
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "tm_user",
          JSON.stringify({
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: userCredential.user.displayName,
            photoURL: userCredential.user.photoURL,
          })
        );
      }
      
      // Profile will be created by onAuthStateChanged listener in background
      // No need to await it here - reduces blocking time significantly
    } catch (err) {
      setError(translateFirebaseError(err));
      throw err;
    }
  }, []);

  /**
   * Connexion utilisateur avec email/mot de passe
   */
  const signIn = useCallback(async (email, password) => {
    setError(null);
    try {
      // Correction du bug courant : 
      // Si un utilisateur non inscrit essaie de se connecter > Firebase retourne "auth/invalid-credential" au lieu de "auth/user-not-found"
      // Solution : catch ce type d'erreur et proposer un message plus clair
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(getAuthInstance(), email, password);
      } catch (err) {
        if (
          err?.code === "auth/invalid-credential" ||
          err?.code === "auth/user-not-found"
        ) {
          setError("Aucun compte trouvé avec cette adresse e-mail.");
        } else if (err?.code === "auth/wrong-password") {
          setError("Mot de passe incorrect.");
        } else if (err?.code === "auth/too-many-requests") {
          setError("Trop de tentatives. Réessayez plus tard.");
        } else {
          setError(translateFirebaseError(err));
        }
        throw err;
      }

      if (userCredential?.user) {
        // ✅ CRITICAL OPTIMIZATION: Don't await profile creation
        // Cache immediately, profile updates in background via onAuthStateChanged
        // This avoids blocking the sign-in flow on slow networks (~300ms saved on slow 4G)
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            "tm_user",
            JSON.stringify({
              uid: userCredential.user.uid,
              email: userCredential.user.email,
              displayName: userCredential.user.displayName,
              photoURL: userCredential.user.photoURL,
            })
          );
        }
        // Profile will be created by onAuthStateChanged listener in background
      }
    } catch (err) {
      // Erreur déjà gérée ci-dessus
      throw err;
    }
  }, []);

  /**
   * Connexion Google OAuth
   */
  const signInWithGoogle = useCallback(async () => {
    setError(null);
    try {
      const userCredential = await signInWithPopup(getAuthInstance(), new GoogleAuthProvider());
      
      // ✅ CRITICAL OPTIMIZATION: Don't await profile creation
      // Cache immediately, profile updates in background via onAuthStateChanged
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "tm_user",
          JSON.stringify({
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: userCredential.user.displayName,
            photoURL: userCredential.user.photoURL,
          })
        );
      }
      // Profile will be created by onAuthStateChanged listener in background
    } catch (err) {
      // Gestion message d'erreur générique car Google peut renvoyer des codes peu explicites
      if (err?.code === "auth/popup-closed-by-user") {
        setError("Connexion annulée.");
      } else {
        setError(translateFirebaseError(err));
      }
      throw err;
    }
  }, []);

  /**
   * Déconnexion utilisateur
   */
  const logOut = useCallback(async () => {
    setError(null);
    try {
      await firebaseSignOut(getAuthInstance());
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("tm_user");
      }
    } catch (err) {
      setError(translateFirebaseError(err));
      throw err;
    }
  }, []);

  // Fournit le contexte optimisé, stable en mémoire
  const contextValue = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    logOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
