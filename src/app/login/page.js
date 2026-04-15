"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";

// Configuration Firebase via variables d'environnement
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialisation unique de Firebase côté client
let app;
if (!getApps().length) {
  import LoginForm from "../../components/LoginForm";

  export default function LoginPage() {
    return (
      <main className="min-h-screen flex items-center justify-center bg-zinc-50">
        <LoginForm />
      </main>
    );
  }
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