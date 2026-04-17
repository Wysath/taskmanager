"use client";

import { useMemo, useCallback, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { Home, ListChecks, Users, User, LogOut, Shield, Menu, X } from "lucide-react";

const SidebarNav = () => {
  const { user, loading, logOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = useMemo(
    () => [
      { href: "/", label: "Accueil", icon: Home },
      { href: "/taches", label: "Grand Livre des Quêtes", icon: ListChecks },
      { href: "/shared", label: "Gestion de l'Escouade", icon: Users },
      { href: "/profil", label: "Mon Profil", icon: User },
    ],
    []
  );

  const handleLogout = useCallback(async () => {
    try {
      await logOut();
      router.push("/login");
    } catch (err) {
      console.error("Erreur logout:", err);
    }
  }, [logOut, router]);

  const handleNavClick = useCallback((href, disabled) => {
    if (!disabled) {
      router.push(href);
    }
  }, [router]);

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  // Masque la barre latérale sur les pages d'authentification
  if (pathname === "/login" || pathname === "/signup") return null;

  const renderNavItems = (isMobile = false) => (
    <>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const isProtected = ["/taches", "/shared", "/profil"].includes(item.href);
        const isDisabled = isProtected && !user;
        const Icon = item.icon;

        return (
          <button
            key={item.href}
            onClick={() => {
              handleNavClick(item.href, isDisabled);
              if (isMobile) closeMobileMenu();
            }}
            className={`w-full flex items-center gap-4 py-4 px-6 active:scale-[0.99] transition-transform text-left border-none bg-none ${
              isDisabled
                ? "text-[#5a4f48] opacity-50 cursor-not-allowed pointer-events-none"
                : isActive
                ? "bg-[#2c2a26] text-[#c28e46] border-l-4 border-[#c28e46] cursor-pointer"
                : "text-[#8a8171] hover:bg-[#2c2a26] hover:text-[#e8e1dc] cursor-pointer"
            }`}
            title={isDisabled ? "Connectez-vous pour accéder" : undefined}
            disabled={isDisabled}
          >
            <Icon size={18} />
            <span className="font-['Work_Sans'] uppercase text-xs font-semibold tracking-wider">{item.label}</span>
          </button>
        );
      })}
      {user && (
        <button
          type="button"
          onClick={() => {
            handleLogout();
            if (isMobile) closeMobileMenu();
          }}
          className="w-full flex items-center gap-4 text-[#8a8171] py-4 px-6 hover:bg-[#2c2a26] hover:text-[#e8e1dc] active:scale-[0.99] transition-transform text-left border-none bg-none cursor-pointer"
          aria-label="Déconnexion"
        >
          <LogOut size={18} />
          <span className="font-['Work_Sans'] uppercase text-xs font-semibold tracking-wider">Déconnexion</span>
        </button>
      )}
    </>
  );

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden md:flex flex-col h-screen fixed left-0 top-0 bg-[#211f1c] w-72 rounded-none border-r-4 border-[#504538] z-40">
        <div className="p-6 border-b border-outline-variant/30 bg-[#151310]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary-container flex items-center justify-center">
              <Shield size={20} className="text-on-primary" />
            </div>
            <div>
              <h2 className="font-headline text-lg text-[#e8e1dc] leading-tight">MENU DU CAMPEMENT</h2>
              <p className="font-label text-[10px] tracking-widest text-muted/60 uppercase">
                Forbidden Lands Expedition
              </p>
            </div>
          </div>
        </div>
        <nav className="flex-1 mt-4">
          {renderNavItems(false)}
        </nav>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#211f1c] border-2 border-[#504538] rounded text-[#c28e46] hover:bg-[#2c2a26]"
        aria-label="Ouvrir menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Sidebar - Slides in from left */}
      <aside
        className={`md:hidden fixed left-0 top-0 h-screen w-72 bg-[#211f1c] border-r-4 border-[#504538] z-40 transition-transform transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-outline-variant/30 bg-[#151310] mt-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary-container flex items-center justify-center">
              <Shield size={20} className="text-on-primary" />
            </div>
            <div>
              <h2 className="font-headline text-lg text-[#e8e1dc] leading-tight">MENU DU CAMPEMENT</h2>
              <p className="font-label text-[10px] tracking-widest text-muted/60 uppercase">
                Forbidden Lands Expedition
              </p>
            </div>
          </div>
        </div>
        <nav className="flex-1 mt-4">
          {renderNavItems(true)}
        </nav>
      </aside>
    </>
  );
};

export default SidebarNav;
