"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const SignupForm = () => {
  const { signUp, error, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (password !== confirmPassword) {
      setFormError("Les mots de passe ne correspondent pas.");
      return;
    }
    setFormLoading(true);
    try {
      await signUp(email, password);
    } catch (err) {
      setFormError(error || "Erreur lors de l'inscription.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto p-8 bg-surface-container-lowest rounded-xl shadow-md flex flex-col gap-6"
      aria-label="Formulaire d'inscription"
      autoComplete="off"
    >
      {(formError || error) && (
        <div className="text-red-600 text-sm font-medium" role="alert">
          {formError || error}
        </div>
      )}
      <div>
        <label htmlFor="email" className="block mb-1 text-on-surface font-medium">
          Adresse e-mail
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Votre e-mail"
          required
          aria-required="true"
          aria-invalid={!!(formError || error)}
          className="w-full h-12 rounded-lg border border-outline-variant bg-surface-container-highest px-4 text-on-surface placeholder:text-outline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2"
        />
      </div>
      <div>
        <label htmlFor="password" className="block mb-1 text-on-surface font-medium">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Votre mot de passe"
          required
          aria-required="true"
          aria-invalid={!!(formError || error)}
          className="w-full h-12 rounded-lg border border-outline-variant bg-surface-container-highest px-4 text-on-surface placeholder:text-outline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2"
        />
      </div>
      <div>
        <label htmlFor="confirm-password" className="block mb-1 text-on-surface font-medium">
          Confirmer le mot de passe
        </label>
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="Confirmez le mot de passe"
          required
          aria-required="true"
          aria-invalid={!!(formError || error)}
          className="w-full h-12 rounded-lg border border-outline-variant bg-surface-container-highest px-4 text-on-surface placeholder:text-outline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2"
        />
      </div>
      <button
        type="submit"
        disabled={formLoading || loading}
        className="h-12 rounded-lg bg-primary text-on-primary font-semibold tracking-wide shadow-md transition-all hover:bg-primary-container hover:text-on-primary-container disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {formLoading || loading ? "Inscription..." : "S'inscrire"}
      </button>
      <div className="text-center text-sm mt-2">
        Déjà un compte ?{' '}
        <Link href="/login" className="text-primary underline hover:text-primary-container">
          Se connecter
        </Link>
      </div>
    </form>
  );
};

export default SignupForm;
