"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from "firebase/auth";

// Traduction des erreurs Firebase en français
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
    case "auth/popup-closed-by-user":
      return "La fenêtre de connexion a été fermée.";
    case "auth/network-request-failed":
      return "Problème de connexion réseau.";
    default:
      return "Une erreur est survenue. Veuillez réessayer.";
  }
}

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    }, (err) => {
      setError(translateFirebaseError(err));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Inscription email/mot de passe
  const signUp = async (email, password) => {
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(translateFirebaseError(err));
      throw err;
    }
  };

  // Connexion email/mot de passe
  const signIn = async (email, password) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(translateFirebaseError(err));
      throw err;
    }
  };

  // Connexion Google
  const signInWithGoogle = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err) {
      setError(translateFirebaseError(err));
      throw err;
    }
  };

  // Déconnexion
  const signOut = async () => {
    setError(null);
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      setError(translateFirebaseError(err));
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, signUp, signIn, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
