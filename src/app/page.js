import AuthGuard from "../components/AuthGuard";
"use client";

import { useState } from "react";
import {
  Archive,
  Bell,
  Calendar,
  CheckSquare,
  Circle,
  Filter,
  GitBranch,
  Home as HomeIcon,
  ListChecks,
  User,
  Settings,
  Search,
} from "lucide-react";
import Link from "next/link";
import AddTaskForm from "../components/AddTaskForm";
import TaskList from "../components/TaskList";
import SearchBar from "../components/SearchBar";
import Dashboard from "../components/Dashboard";

const initialTaskItems = [
  {
    id: 1,
    title: "Revue de projet",
    description: "Préparer la synthèse pour la réunion de 14:00",
    priority: "haute",
    completed: false,
  },
  {
    id: 2,
    title: "Appel client",
    description: "Point de suivi avec Jean Dupont",
    priority: "moyenne",
    completed: false,
  },
  {
    id: 3,
    title: "Préparation présentation",
    description: "Finaliser les slides du comité",
    priority: "basse",
    completed: false,
  },
];

// Rappel : la balise <html lang="fr"> est à intégrer dans le fichier racine _document.js ou layout.js de Next.js pour application globale.

export default function Home() {
  // ...tous les hooks et logique inchangés...
  // (on ne touche pas à la logique, on wrappe juste le rendu)
  // ...
  return (
    <AuthGuard>
      {/* tout le JSX existant de la page ici */}
      <main className="min-h-screen bg-surface text-on-surface md:flex" tabIndex={-1}>
        {/* Barre laterale desktop */}
        {/* ...reste du code inchangé... */}
      </main>
    </AuthGuard>
  );
}
