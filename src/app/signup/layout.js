"use client";
import { AuthProvider } from "@/contexts/AuthContext";

export default function SignupLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
