"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn } from "lucide-react";

const LoginForm = () => {
  const router = useRouter();
  const { user, signIn, signInWithGoogle, error, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Redirection si l'utilisateur est déjà connecté
  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  // Synchroniser l'erreur du contexte avec le formulaire
  useEffect(() => {
    if (error && !formError) {
      setFormError(error);
    }
  }, [error, formError]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setFormError("");
      setFormLoading(true);
      try {
        await signIn(email, password);
        // Réussi : le useEffect se chargera de la redirection
      } catch (err) {
        // Afficher l'erreur du contexte (déjà définie par signIn)
        setFormError(error || "Erreur lors de la connexion.");
      } finally {
        setFormLoading(false);
      }
    },
    [signIn, email, password, error]
  );

  const handleGoogle = useCallback(
    async () => {
      setFormError("");
      setFormLoading(true);
      try {
        await signInWithGoogle();
        // Réussi : le useEffect se chargera de la redirection
      } catch (err) {
        // Afficher l'erreur du contexte (déjà définie par signInWithGoogle)
        setFormError(error || "Erreur lors de la connexion Google.");
      } finally {
        setFormLoading(false);
      }
    },
    [signInWithGoogle, error]
  );

  const handleEmailChange = useCallback((e) => setEmail(e.target.value), []);
  const handlePasswordChange = useCallback((e) => setPassword(e.target.value), []);

  const isLoading = formLoading || loading;
  const displayError = formError || error;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      aria-label="Formulaire de connexion"
      autoComplete="off"
    >
      {displayError && (
        <div className="text-[#ffb4ab] text-sm font-medium bg-[#93000a]/20 p-3 border border-[#93000a]/50 rounded" role="alert">
          {displayError}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block mb-2 text-[#c28e46] font-label text-xs uppercase font-semibold tracking-wider">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="hunter@example.com"
          required
          className="w-full bg-[#2c2a26] border-2 border-[#504538] text-[#e3d5b8] px-4 py-3 placeholder-[#8a8171] focus:border-[#c28e46] focus:outline-none transition-colors font-body"
        />
      </div>

      <div>
        <label htmlFor="password" className="block mb-2 text-[#c28e46] font-label text-xs uppercase font-semibold tracking-wider">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="••••••••"
          required
          className="w-full bg-[#2c2a26] border-2 border-[#504538] text-[#e3d5b8] px-4 py-3 placeholder-[#8a8171] focus:border-[#c28e46] focus:outline-none transition-colors font-body"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#c28e46] text-[#151310] py-3 font-headline font-bold uppercase tracking-widest hover:bg-[#e8b879] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
      >
        <LogIn size={18} />
        {isLoading ? "Connexion..." : "Se connecter"}
      </button>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={isLoading}
        className="w-full bg-[#2c2a26] text-[#e8e1dc] border-2 border-[#c28e46] py-3 font-headline font-bold uppercase tracking-widest hover:bg-[#3a3835] disabled:opacity-60 transition-colors"
      >
        Google
      </button>

      <div className="text-center text-sm text-[#8a8171] pt-2">
        Pas de compte ?{' '}
        <Link href="/register" className="text-[#c28e46] font-semibold hover:text-[#e8b879] transition-colors">
          S'inscrire
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
