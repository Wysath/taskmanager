"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "@firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home,
  ListChecks,
  Share2,
  User,
  LogIn,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const Header = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Optimisé avec useCallback pour éviter les rerenders inutiles
  const handleLogout = useCallback(async () => {
    await signOut(auth);
    router.push("/login");
  }, [router]);
y
  // Tableau de navigation mémoïsé pour éviter de recalculer à chaque render
  const navItems = useMemo(
    () => [
      { href: "/", label: "Accueil", icon: Home },
      { href: "/taches", label: "Tâches", icon: ListChecks },
      { href: "/shared", label: "Partagé", icon: Share2 },
    ],
    []
  );

  // Gère l'ouverture/fermeture du menu mobile de façon stable
  const handleMobileMenuToggle = useCallback(() => {
    setMobileMenuOpen((open) => !open);
  }, []);

  const handleMobileMenuClose = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  // Génération des items d'authentification (desktop) avec early return pour clarté
  const authItems = useMemo(() => {
    if (loading) return null;
    if (user) {
      return (
        <>
          <Link href="/profil" className="header-nav-link">
            <User size={18} aria-hidden="true" />
            <span className="hidden sm:inline">Profil</span>
          </Link>
          <button
            onClick={handleLogout}
            className="header-nav-link-logout"
            type="button"
            aria-label="Déconnexion"
          >
            <LogOut size={18} aria-hidden="true" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </>
      );
    }
    return (
      <Link href="/login" className="header-nav-link-primary">
        <LogIn size={18} aria-hidden="true" />
        <span className="hidden sm:inline">Connexion</span>
      </Link>
    );
  }, [user, loading, handleLogout]);

  return (
    <header className="header bg">
      <div className="header-nav bg-primary">
        {/* Logo/Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-bold text-sm">TM</span>
          </div>
          <span className="header-brand hidden sm:block">
            Gestionnaire de Tâches
          </span>
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="header-nav-link">
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Auth Actions Desktop */}
        <div className="hidden md:flex items-center gap-2">
          {authItems}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={handleMobileMenuToggle}
          className="md:hidden p-2 rounded-lg hover:bg-surface-container transition-colors"
          aria-label="Menu"
          type="button"
        >
          {mobileMenuOpen ? (
            <X size={24} aria-hidden="true" />
          ) : (
            <Menu size={24} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-container-low border-t border-outline-variant/20">
          <nav className="flex flex-col p-4 gap-2">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="header-mobile-link"
                onClick={handleMobileMenuClose}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{label}</span>
              </Link>
            ))}
            <div className="border-t border-outline-variant/20 my-2" />
            {!loading && user && (
              <>
                <Link
                  href="/profil"
                  className="header-mobile-link"
                  onClick={handleMobileMenuClose}
                >
                  <User size={18} aria-hidden="true" />
                  <span>Profil</span>
                </Link>
                <button
                  onClick={async () => {
                    await handleLogout();
                    handleMobileMenuClose();
                  }}
                  className="header-mobile-link text-error hover:bg-error/10 justify-start"
                  type="button"
                  aria-label="Déconnexion"
                >
                  <LogOut size={18} aria-hidden="true" />
                  <span>Déconnexion</span>
                </button>
              </>
            )}
            {!loading && !user && (
              <Link
                href="/login"
                className="header-mobile-link bg-primary text-on-primary hover:bg-primary/90"
                onClick={handleMobileMenuClose}
              >
                <LogIn size={18} aria-hidden="true" />
                <span>Connexion</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
