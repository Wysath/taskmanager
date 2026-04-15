"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "@/components/UserMenu";

// Barre de navigation principale
const Navigation = () => {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Mes tâches" },
    { href: "/shared", label: "Listes partagées" },
  ];

  return (
    <nav className="w-full bg-surface-container-high border-b border-outline-variant/10 shadow-sm">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <div className="flex gap-2 sm:gap-4">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2
                  ${isActive
                    ? "bg-primary text-on-primary shadow font-semibold"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"}
                `}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <UserMenu />
      </div>
    </nav>
  );
};

export default Navigation;
