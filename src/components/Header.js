"use client";


import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Home, ListChecks, User, LogIn, LogOut } from "lucide-react";

const Header = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-outline-variant/20 bg-surface/95 shadow-sm backdrop-blur">
      <nav
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Navigation principale"
      >
        {/* Nom de l'application */}
        <span className="text-xl font-bold tracking-tight text-on-surface font-headline">
          Gestionnaire de Tâches
        </span>
        {/* Menu de navigation dynamique selon l'état de connexion */}
        <div className="flex items-center gap-6 text-sm font-medium text-on-surface-variant font-body">
          <Link
            href="/"
            className="flex items-center gap-2 transition-colors hover:text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 rounded"
          >
            <Home size={18} aria-hidden="true" />
            Accueil
          </Link>
          <Link
            href="/taches"
            className="flex items-center gap-2 transition-colors hover:text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 rounded"
          >
            <ListChecks size={18} aria-hidden="true" />
            Tâches
          </Link>
          {/* Affichage conditionnel selon l'état de connexion */}
          {!loading && !user && (
            <Link
              href="/login"
              className="ml-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary transition-colors hover:bg-primary-container hover:text-on-primary-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2"
            >
              <LogIn size={18} aria-hidden="true" />
              Connexion
            </Link>
          )}
          {!loading && user && (
            <>
              <Link
                href="/profil"
                className="ml-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary transition-colors hover:bg-primary-container hover:text-on-primary-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2"
              >
                <User size={18} aria-hidden="true" />
                Profil
              </Link>
              <button
                onClick={handleLogout}
                className="ml-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                type="button"
              >
                <LogOut size={18} aria-hidden="true" />
                Déconnexion
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
