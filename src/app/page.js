"use client";
import ClientLayout from "./layout.client";
import { useAuth } from "@/contexts/AuthContext";
import {
  ListChecks,
  Users,
  Shield,
  Zap,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <ClientLayout>
      <HomeContent />
    </ClientLayout>
  );
}

function HomeContent() {
  const { user, loading } = useAuth();

  // Contenu pour utilisateurs non connectés
  if (!loading && !user) {
    return (
      <div className="min-h-screen flex flex-col bg-surface text-on-surface">
        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-2xl w-full text-center space-y-8 sm:space-y-12">
            {/* Logo/Title */}
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary/20 rounded-lg mb-6">
                <Shield size={32} className="text-primary sm:w-10 sm:h-10" />
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-headline font-bold tracking-tight">
                GRAND LIVRE DES QUÊTES
              </h1>
              
              <p className="text-lg sm:text-2xl text-on-surface-variant font-body">
                Gérez vos missions, maîtrisez vos objectifs
              </p>
            </div>

            {/* Features Overview */}
            <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed max-w-xl mx-auto">
              Organisez vos quêtes, définissez les priorités et collaborez avec votre escouade pour accomplir vos missions dans les Forbidden Lands.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-8 py-3 sm:py-4 font-headline font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors rounded-lg border border-primary"
              >
                <span>Connexion</span>
              </Link>
              
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-surface-container text-on-surface px-8 py-3 sm:py-4 font-headline font-bold uppercase tracking-widest hover:bg-surface-container-high transition-colors rounded-lg border border-outline-variant"
              >
                <span>S'inscrire</span>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-outline-variant/20">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <ListChecks size={24} className="text-primary" />
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant">Quêtes illimitées</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Zap size={24} className="text-primary" />
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant">Temps Réel</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Users size={24} className="text-primary" />
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant">Escouade Collaborative</p>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Footer */}
        <footer className="bg-surface-container border-t border-outline-variant/20 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-on-surface-variant">© 2026 Grand Livre des Quêtes. Tous droits réservés.</p>
            <div className="flex gap-6 text-on-surface-variant">
              <span className="hover:text-primary transition-colors cursor-pointer">Confidentialité</span>
              <span className="hover:text-primary transition-colors cursor-pointer">Conditions</span>
              <span className="hover:text-primary transition-colors cursor-pointer">Contact</span>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Affichage du chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <span className="text-on-surface-variant text-lg font-medium animate-pulse">
          Chargement...
        </span>
      </div>
    );
  }

  // Contenu pour utilisateurs connectés
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-2xl w-full text-center space-y-8 sm:space-y-12">
          {/* Logo/Title */}
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary/20 rounded-lg mb-6">
              <Shield size={32} className="text-primary sm:w-10 sm:h-10" />
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-headline font-bold tracking-tight">
              GRAND LIVRE DES QUÊTES
            </h1>
            
            <p className="text-lg sm:text-2xl text-on-surface-variant font-body">
              Accueil du Campement
            </p>
          </div>

          {/* Description */}
          <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed max-w-xl mx-auto">
            Bienvenue <span className="text-primary font-semibold">{user?.displayName || user?.email || "Chasseur"}</span>. 
            Gérez vos quêtes, organisez votre escouade et accomplissez vos missions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/taches"
              className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-8 py-3 sm:py-4 font-headline font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors rounded-lg border border-primary"
            >
              <ListChecks size={20} />
              <span>Grand Livre des Quêtes</span>
            </Link>
            
            <Link
              href="/shared"
              className="inline-flex items-center justify-center gap-2 bg-surface-container text-on-surface px-8 py-3 sm:py-4 font-headline font-bold uppercase tracking-widest hover:bg-surface-container-high transition-colors rounded-lg border border-outline-variant"
            >
              <Users size={20} />
              <span>Gestion de l'Escouade</span>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-outline-variant/20">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <ListChecks size={24} className="text-primary" />
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant">Quêtes illimitées</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Zap size={24} className="text-primary" />
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant">Synchronisation Temps Réel</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Users size={24} className="text-primary" />
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant">Équipes Collaboratives</p>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="bg-surface-container border-t border-outline-variant/20 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-on-surface-variant">© 2026 Grand Livre des Quêtes. Tous droits réservés.</p>
          <div className="flex gap-6 text-on-surface-variant">
            <span className="hover:text-primary transition-colors cursor-pointer">Confidentialité</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Conditions</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
