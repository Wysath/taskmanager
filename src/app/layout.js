import { Geist, Geist_Mono } from "next/font/google";
import "./critical.css";
import "./globals.css";

const geistSans = Geist({ 
  variable: "--font-geist-sans", 
  subsets: ["latin"],
});
const geistMono = Geist_Mono({ 
  variable: "--font-geist-mono", 
  subsets: ["latin"],
});

export const metadata = {
  title: "Task Manager - Monster Hunter",
  description: "Gestionnaire de tâches collaboratif",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {/* Preconnect aux services tiers critiques (réduit la latence) */}
        <link rel="preconnect" href="https://identitytoolkit.googleapis.com" />
        <link rel="preconnect" href="https://taskmanager-filrouge-57492.firebaseapp.com" />
        
        {/* DNS prefetch pour les autres domaines (sans preconnect) */}
        <link rel="dns-prefetch" href="https://apis.google.com" />
        <link rel="dns-prefetch" href="https://www.googleapis.com" />

        {/* Meta tags pour performance */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#151310" />
      </head>
      <body className="min-h-full flex flex-col bg-surface text-on-surface">
        {children}
      </body>
    </html>
  );
}