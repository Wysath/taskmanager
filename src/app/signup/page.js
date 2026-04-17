
"use client";

import { useMemo } from "react";
import SignupForm from "../../components/SignupForm";
import { UserPlus } from "lucide-react";

export default function SignupPage() {
  // Memo: éléments de l'en-tête (évite la recréation sur chaque rendu)
  const headerContent = useMemo(
    () => (
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-12 h-12 bg-[#c28e46] flex items-center justify-center">
            <UserPlus size={24} className="text-[#151310]" />
          </div>
          <h1 className="font-headline text-3xl text-[#c28e46] uppercase tracking-widest">
            Inscription
          </h1>
        </div>
        <p className="text-[#8a8171] font-label text-sm uppercase tracking-widest">
          Créez votre compte - Monster Hunter
        </p>
      </div>
    ),
    []
  );

  return (
    <div className="ml-0 min-h-screen bg-[#151310] flex">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {headerContent}
          <div className="bg-[#211f1c] border-4 border-[#504538] p-8">
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
}
