"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const SignupForm = () => {
  const router = useRouter();
  const { user, signUp, error, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Redirection si l'utilisateur est déjà connecté
  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

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
      // La redirection se fera via l'useEffect quand user sera mis à jour
    } catch (err) {
      setFormError(error || "Erreur lors de l'inscription.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="form-card"
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
          className="input-lg"
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
          className="input-lg"
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
          className="input-lg"
        />
      </div>
      <button
        type="submit"
        disabled={formLoading || loading}
        className="btn-form"
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
