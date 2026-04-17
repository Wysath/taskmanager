"use client";
import { AuthProvider } from "@/contexts/AuthContext";
import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";

const SidebarNav = dynamic(() => import("../../components/SidebarNav"), { ssr: false });

export default function ProtectedLayout({ children }) {
  return (
    <AuthProvider>
      <SidebarNav />
      <main className="md:ml-72 flex-1">{children}</main>
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
