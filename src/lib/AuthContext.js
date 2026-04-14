"use client"; // Obligatoire car on utilise des Hooks React

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { app } from "./firebase";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer dynamiquement l'instance d'auth à partir de l'app Firebase, 100% compatible avec les exports actuels
    const auth = getAuth(app);
    // Firebase écoute en permanence si quelqu'un se connecte ou se déconnecte
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Nettoyage quand le composant est détruit
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// 3. Un petit Hook personnalisé pour utiliser facilement l'auth dans nos autres fichiers
export const useAuth = () => useContext(AuthContext);