"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { Home, ListChecks, Users, User, LogOut, Shield } from "lucide-react";

const SidebarNav = () => {
  const { user, loading, logOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logOut();
      router.push("/login");
    } catch (err) {
      console.error("Erreur logout:", err);
    }
  };

  const navItems = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/taches", label: "Grand Livre des Quêtes", icon: ListChecks },
    { href: "/shared", label: "Gestion de l'Escouade", icon: Users },
    { href: "/profil", label: "Mon Profil", icon: User },
  ];

  // Ne pas afficher le sidebar sur les pages de login/signup
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  // Ne pas afficher le sidebar si l'utilisateur n'est pas connecté
  if (!loading && !user) {
    return null;
  }

  return (
    <aside className="flex flex-col h-screen fixed left-0 top-0 bg-[#211f1c] w-72 rounded-none border-r-4 border-[#504538] z-40">
      <div className="p-6 border-b border-outline-variant/30 bg-[#151310]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary-container flex items-center justify-center">
            <Shield size={20} className="text-on-primary" />
          </div>
          <div>
            <h2 className="font-headline text-lg text-[#e8e1dc] leading-tight">MENU DU CAMPEMENT</h2>
            <p className="font-label text-[10px] tracking-widest text-muted/60 uppercase">Forbidden Lands Expedition</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 py-4 px-6 active:scale-[0.99] transition-transform ${
                isActive
                  ? "bg-[#2c2a26] text-[#c28e46] border-l-4 border-[#c28e46]"
                  : "text-[#8a8171] hover:bg-[#2c2a26] hover:text-[#e8e1dc]"
              }`}
            >
              <Icon size={18} />
              <span className="font-['Work_Sans'] uppercase text-xs font-semibold tracking-wider">{item.label}</span>
            </a>
          );
        })}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 text-[#8a8171] py-4 px-6 hover:bg-[#2c2a26] hover:text-[#e8e1dc] active:scale-[0.99] transition-transform text-left"
        >
          <LogOut size={18} />
          <span className="font-['Work_Sans'] uppercase text-xs font-semibold tracking-wider">Déconnexion</span>
        </button>
      </nav>
    </aside>
  );
};

export default SidebarNav;
