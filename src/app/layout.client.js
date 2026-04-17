"use client";
import { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

// Lazy load SidebarNav - n'est pas critique au démarrage
const SidebarNav = dynamic(() => import("../components/SidebarNav"), { 
  ssr: false,
  loading: () => null, // Pas de loading state pour la sidebar
});

const LoadingShell = () => (
  <div className="ml-0 flex-1 animate-pulse">
    <div className="h-20 bg-surface-container-high/50" />
  </div>
);

export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <ServiceWorkerRegister />
      <Suspense fallback={null}>
        <SidebarNav />
      </Suspense>
      <main className="md:ml-72">
        {children}
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#24211d",
            color: "#e3d5b8",
            border: "2px solid #c28e46",
            borderRadius: "4px",
            fontSize: "14px",
          },
          error: {
            style: {
              borderColor: "#93000a",
            },
          },
          success: {
            style: {
              borderColor: "#4ade80",
            },
          },
        }}
      />
    </AuthProvider>
  );
}