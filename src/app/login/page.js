"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";

// Reprise stricte de la configuration du fichier src/lib/firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyCAYBr6dmlPjp0RxRo6FxoJCxltg1auhag",
  authDomain: "taskmanager-filrouge-57492.firebaseapp.com",
  projectId: "taskmanager-filrouge-57492",
  storageBucket: "taskmanager-filrouge-57492.firebasestorage.app",
  messagingSenderId: "529740290484",
  appId: "1:529740290484:web:7799656e332e2e7ada3ae1"
};

// Initialisation unique de Firebase côté client
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}
const auth = getAuth(app);

const LoginPage = () => {
  const router = useRouter();

  // État local pour l'email et gestion des erreurs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      router.push("/");
    } catch (error) {
      // Gère l'erreur si besoin (facultatif)
      console.error(error);
    }
  };

  // Gestion du bouton "Accéder à mon espace" (connexion email)
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // On utilise la vraie variable password ici !
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err) {
      setError("Connexion échouée. Vérifiez vos identifiants.");
    } finally {
      setLoading(false);
    }
  };

  // Nouveau handler pour la redirection "Créer un nouveau compte"
  const handleCreateAccount = (e) => {
    e.preventDefault();
    // Redirige vers la page d'inscription (ex: /register)
    router.push("/register");
  };

  return (
    <div className="bg-background font-body text-on-surface selection:bg-primary-fixed-dim selection:text-on-primary-fixed min-h-screen flex flex-col relative overflow-hidden">
      {/* Top Navigation Anchor (Non-Interactive / Branding Only for Login) */}
      <header className="fixed top-0 w-full z-50 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur-xl flex justify-between items-center px-8 py-4 w-full shadow-[0px_20px_40px_rgba(25,27,35,0.06)]">
        <div className="flex items-center gap-2">
          <span className="font-['Manrope'] text-lg font-bold tracking-tighter text-slate-900 dark:text-slate-50">
            Gestionnaire de Tâches
          </span>
        </div>
      </header>
      {/* Main Content Canvas */}
      <main className="flex-grow flex items-center justify-center px-6 pt-20 pb-12 relative">
        {/* Subtle Ambient Background Element */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-tertiary/5 rounded-full blur-[120px] pointer-events-none"></div>
        {/* Login Container */}
        <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-10 shadow-[0px_20px_40px_rgba(25,27,35,0.06)] relative z-10 transition-transform duration-500 hover:scale-[1.01]">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-fixed mb-6">
              <span className="material-symbols-outlined text-primary text-3xl" data-icon="task_alt">
                task_alt
              </span>
            </div>
            <h1 className="font-headline text-3xl font-extrabold text-primary tracking-tight mb-3">
              Connexion
            </h1>
            <p className="text-on-surface-variant font-medium">
              Connectez-vous pour organiser vos journées
            </p>
          </div>
          {/* Action Area */}
          <div className="space-y-6">
            {/* Google Authentication */}
            <button
              type="button"
              className="w-full bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-low transition-all duration-300 rounded-xl py-4 flex items-center justify-center gap-4 group shadow-sm active:scale-98"
              onClick={handleGoogleSignIn}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              <span className="font-label font-semibold text-on-surface">Connexion avec Google</span>
            </button>
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-outline-variant/30"></div>
              <span className="flex-shrink mx-4 text-on-surface-variant text-xs font-label uppercase tracking-widest">
                ou avec email
              </span>
              <div className="flex-grow border-t border-outline-variant/30"></div>
            </div>
            {/* Manual Login Form */}
            <form className="space-y-4" onSubmit={handleEmailLogin}>
              <div className="relative">
                <input
                  className="w-full px-5 py-4 bg-surface-container-high border-none rounded-xl text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-surface-tint focus:bg-surface transition-all duration-300 font-label text-sm"
                  placeholder="Adresse e-mail"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  aria-label="Email professionnel"
                />
              </div>
              {/* Champ Mot de passe ajouté */}
              <div className="relative">
                <input
                  className="w-full px-5 py-4 bg-surface-container-high border-none rounded-xl text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-surface-tint focus:bg-surface transition-all duration-300 font-label text-sm"
                  placeholder="Mot de passe"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  aria-label="Mot de passe"
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-full font-label font-bold tracking-tight hover:brightness-110 active:scale-98 transition-all duration-300 shadow-md"
                disabled={loading}
              >
                {loading ? "Connexion..." : "Connexion"}
              </button>
              {error && (
                <div className="text-xs text-red-500 mt-2">{error}</div>
              )}
            </form>
          </div>
          {/* Secondary Actions */}
          <div className="mt-10 text-center space-y-4">
            <p className="text-xs text-on-surface-variant font-medium">
              En continuant, vous acceptez nos{" "}
              <a className="text-primary hover:underline" href="#">
                Conditions d&apos;Utilisation
              </a>
              .
            </p>
            <div className="pt-6">
              <a
                className="text-sm font-semibold text-primary-container hover:text-primary transition-colors flex items-center justify-center gap-2"
                href="/register"
                onClick={handleCreateAccount}
              >
                Créer un nouveau compte
                <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">
                  arrow_forward
                </span>
              </a>
            </div>
          </div>
        </div>
        {/* Decorative Elements for "Architectural Sanctuary" feel */}
        <div className="hidden lg:block absolute left-12 bottom-12 max-w-[200px]">
          <p className="font-headline text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant/40 leading-relaxed">
            Precision in Workflow.<br />Silence in Design.
          </p>
        </div>
      </main>
      {/* Footer Cluster */}
      <footer className="w-full absolute bottom-8 flex flex-col md:flex-row justify-between items-center px-12 gap-4 w-full bg-transparent opacity-80 hover:opacity-100">
        <span className="font-['Inter'] text-xs uppercase tracking-widest text-slate-400">
          © 2024 The Executive Flow. Architectural Sanctuary.
        </span>
        <div className="flex gap-8">
          <a className="font-['Inter'] text-xs uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors" href="#">
            Privacy
          </a>
          <a className="font-['Inter'] text-xs uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors" href="#">
            Terms
          </a>
          <a className="font-['Inter'] text-xs uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors" href="#">
            Security
          </a>
        </div>
      </footer>
      <style>
        {`
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            line-height: 1;
            text-transform: none;
            letter-spacing: normal;
            word-wrap: normal;
            white-space: nowrap;
            direction: ltr;
          }
          .glass-shell {
            background: rgba(250, 248, 255, 0.7);
            backdrop-filter: blur(20px);
          }
        `}
      </style>
      {/* Note: Les liens vers Google Fonts/material-symbols doivent être gérés dans le layout _app.js ou le <Head> global */}
    </div>
  );
};

export default LoginPage;