"use client";

import LoginForm from "../../components/LoginForm";
import { Swords } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="ml-0 
    min-h-screen bg-[#151310] flex">
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-12 h-12 bg-[#c28e46] flex items-center justify-center">
                <Swords size={24} className="text-[#151310]" />
              </div>
              <h1 className="font-headline text-3xl text-[#c28e46] uppercase tracking-widest">Connexion</h1>
            </div>
            <p className="text-[#8a8171] font-label text-sm uppercase tracking-widest">Gestionnaire de Tâches - Monster Hunter</p>
          </div>

          {/* Form card */}
          <div className="bg-[#211f1c] border-4 border-[#504538] p-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}