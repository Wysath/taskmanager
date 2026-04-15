"use client";

import { useAuth } from "@/contexts/AuthContext";

const UserMenu = () => {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-4 p-4 bg-surface-container-high rounded-xl shadow-sm border border-outline-variant/20">
      <span className="text-on-surface-variant text-sm font-medium" aria-label="Adresse e-mail">
        {user.email}
      </span>
      <button
        type="button"
        onClick={signOut}
        className="px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold text-sm shadow hover:bg-primary-container hover:text-on-primary-container transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2"
      >
        Se déconnecter
      </button>
    </div>
  );
};

export default UserMenu;
