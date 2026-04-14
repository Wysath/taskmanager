"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const ProfilePage = () => {
  const { user } = useAuth();
  const router = useRouter();

  // Redirection si pas connecté
  useEffect(() => {
    if (user === undefined) return; // attendre chargement initial
    if (!user) router.push("/login");
  }, [user, router]);

  // Gestion du logout
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  // Pendant chargement / redirection
  if (user === undefined) {
    return (
      <main className="min-h-screen p-8 flex flex-col items-center justify-center relative overflow-hidden bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container">
        <div className="text-lg text-on-surface-variant">Chargement…</div>
      </main>
    );
  }

  // ⚛️ Utilisateur non connecté : invite à se connecter
  if (!user) {
    return (
      <main className="min-h-screen p-8 flex flex-col items-center justify-center relative overflow-hidden bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container">
        <div className="bg-surface-container-lowest max-w-lg w-full mx-auto rounded-[2rem] shadow-[0px_20px_40px_rgba(25,27,35,0.06)] p-12 text-center relative z-10 transition-all duration-300">
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-4">Bienvenue !</h1>
          <p className="text-on-surface-variant mb-8">
            Pour accéder à votre profil, veuillez vous connecter à votre compte.
          </p>
          <button
            className="group flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90 rounded-xl py-4 font-bold transition-all duration-200 active:scale-95 w-full"
            type="button"
            onClick={() => router.push("/login")}
          >
            <span className="sr-only">Se connecter</span>
            <span>Connexion</span>
          </button>
        </div>
      </main>
    );
  }

  const displayName = user.displayName || "Utilisateur";
  const email = user.email || "";
  const avatarUrl = user.photoURL || null;

  return (
    <div className="bg-background min-h-screen text-on-surface selection:bg-primary-container selection:text-on-primary-container flex flex-col min-h-screen">
      {/* Shell Suppression applied: Focused task journey (User Profile) hides global navigation */}
      <main className="min-h-screen p-8 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Architectural Elements (Subtle tonal shifts instead of lines) */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-surface-container-low rounded-bl-full -z-10 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-surface-container-highest rounded-tr-full -z-10 opacity-30"></div>
        {/* Profile Card */}
        <div className="bg-surface-container-lowest max-w-lg w-full mx-auto rounded-[2rem] shadow-[0px_20px_40px_rgba(25,27,35,0.06)] p-12 text-center relative z-10 transition-all duration-300">
          {/* Avatar Container */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="w-full h-full bg-surface-container rounded-full flex items-center justify-center overflow-hidden border-4 border-surface-container-lowest shadow-sm">
              {avatarUrl ? (
                <img
                  alt={displayName}
                  className="w-full h-full object-cover"
                  src={avatarUrl}
                  referrerPolicy="no-referrer"
                />
              ) : (
                // Cercle gris de fallback si pas de photo
                <div className="w-full h-full flex items-center justify-center bg-surface-container text-3xl text-on-surface-variant">{displayName[0]}</div>
              )}
            </div>
            {/* Status indicator */}
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-primary border-4 border-surface-container-lowest rounded-full"></div>
          </div>
          {/* User Info Hierarchy */}
          <div className="space-y-2 mb-10">
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">{displayName}</h1>
            <p className="text-on-surface-variant font-medium tracking-wide">{email}</p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold tracking-wider">Compte standard</span>
            </div>
          </div>
          {/* Dashboard Stats Preview (Bento-style micro grid) */}
          <div className="grid grid-cols-2 gap-3 mb-10">
            <div className="bg-surface-container-low p-4 rounded-2xl text-left">
              <span className="text-xs font-bold text-on-surface-variant block mb-1">TÂCHES TERMINÉES</span>
              <span className="text-xl font-bold text-primary">128</span>
            </div>
            <div className="bg-surface-container-low p-4 rounded-2xl text-left">
              <span className="text-xs font-bold text-on-surface-variant block mb-1">STREAK</span>
              <span className="text-xl font-bold text-tertiary">14 Days</span>
            </div>
          </div>
          {/* Buttons Stack */}
          <div className="flex flex-col gap-4">
            <button
              className="group flex items-center justify-center gap-2 border-outline-variant/30 border text-on-surface hover:bg-surface-container-low rounded-xl py-4 font-bold transition-all duration-200 active:scale-95"
              type="button"
              onClick={() => router.push("/")}
            >
              <span className="material-symbols-outlined text-xl" aria-label="Retour aux tâches" data-icon="arrow_back">
                arrow_back
              </span>
              <span>Retour aux tâches</span>
            </button>
            <button
              className="group flex items-center justify-center gap-2 bg-error-container/40 text-on-error-container hover:bg-error-container/60 rounded-xl py-4 font-bold transition-all duration-200 active:scale-95"
              type="button"
              onClick={handleLogout}
            >
              <span className="material-symbols-outlined text-xl" aria-label="Se déconnecter" data-icon="logout">
                logout
              </span>
              <span>Se déconnecter</span>
            </button>
          </div>
          {/* Secondary Utility Links */}
          <div className="mt-8 pt-8 border-t border-outline-variant/10 flex justify-center gap-6">
            <a className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#">
              Privacy
            </a>
            <a className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#">
              Settings
            </a>
            <a className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#">
              Help
            </a>
          </div>
        </div>
      </main>
      {/* Footer from Shared Components JSON */}
      <footer className="w-full py-12 mt-auto bg-slate-50 dark:bg-slate-950 font-inter text-sm tracking-wide flex flex-col md:flex-row justify-between items-center px-8 border-t border-slate-200/20">
        <div className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4 md:mb-0">TaskManager</div>
        <div className="text-slate-500 dark:text-slate-400 mb-4 md:mb-0">© 2024 TaskManager. Designed for Clarity.</div>
        <div className="flex gap-8">
          <a className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" href="#">
            Terms of Service
          </a>
          <a className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" href="#">
            Help Center
          </a>
        </div>
      </footer>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body { font-family: 'Inter', sans-serif; }
        h1, h2, h3 { font-family: 'Manrope', sans-serif; }
      `}</style>
    </div>
  );
};

export default ProfilePage;