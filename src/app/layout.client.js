"use client";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export default function RootLayoutClient({ children }) {
  return (
    <AuthProvider>
      <ServiceWorkerRegister />
      {children}
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