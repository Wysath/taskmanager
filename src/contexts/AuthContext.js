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
import { createOrUpdateUserProfile } from "@/services/userService";

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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && currentUser.email) {
        // Crée/met à jour le profil Firestore pour l'utilisateur connecté
        try {
          await createOrUpdateUserProfile(currentUser.uid, currentUser.email);
        } catch (err) {
          console.error("[AuthContext] Erreur création profil:", err);
        }
      }
      setUser(currentUser);
      setLoading(false);
    }, (err) => {
      setError(translateFirebaseError(err));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createOrUpdateUserProfile(userCredential.user.uid, email);
    } catch (err) {
      setError(translateFirebaseError(err));
      throw err;
    }
  };

  const signIn = async (email, password) => {
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Crée/met à jour le profil lors du login
      await createOrUpdateUserProfile(userCredential.user.uid, userCredential.user.email);
    } catch (err) {
      setError(translateFirebaseError(err));
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    try {
      const userCredential = await signInWithPopup(auth, new GoogleAuthProvider());
      // Crée/met à jour le profil pour Google Auth
      await createOrUpdateUserProfile(userCredential.user.uid, userCredential.user.email);
    } catch (err) {
      setError(translateFirebaseError(err));
      throw err;
    }
  };

  const logOut = async () => {
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
      value={{ user, loading, error, signUp, signIn, signInWithGoogle, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
