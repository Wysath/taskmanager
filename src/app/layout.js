import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import "@/styles/unified.css";
import SidebarNav from "../components/SidebarNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

import { AuthProvider } from "@/contexts/AuthContext";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Gestionnaire de Tâches",
  description: "Gestionnaire de tâches collaboratif en temps réel avec Firebase et Next.js",
};


export default function RootLayout({ children }) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-on-surface">
        <AuthProvider>
          <SidebarNav />
          <main className="ml-72 flex-1">
            {children}
          </main>
        </AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#24211d",
              color: "#e3d5b8",
              border: "2px solid #c28e46",
              borderRadius: "4px",
              fontFamily: "inherit",
              fontSize: "14px",
            },
            success: {
              style: {
                borderColor: "#4ade80",
              },
            },
            error: {
              style: {
                borderColor: "#93000a",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
