"use client";
import { AuthProvider } from "@/contexts/AuthContext";

export default function RegisterLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
