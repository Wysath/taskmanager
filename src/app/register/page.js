"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { UserPlus } from "lucide-react";

const RegisterPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirection si l'utilisateur est déjà connecté
  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  // React state hooks
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Change handlers (memoized with useCallback for performance and clarity if passed down)
  const handleEmailChange = useCallback((e) => setEmail(e.target.value), []);
  const handlePasswordChange = useCallback((e) => setPassword(e.target.value), []);
  const handleConfirmPasswordChange = useCallback((e) => setConfirmPassword(e.target.value), []);

  // Register handler (memoized for potential children propagation, avoids unnecessary rerenders)
  const handleRegister = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      if (password !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas.");
        return;
      }
      setIsLoading(true);
      try {
        // Lazy-load Firebase modules to prevent blocking main thread on mobile
        const { createUserWithEmailAndPassword } = await import("@firebase/auth");
        const { auth } = await import("@/lib/firebase");
        const { createOrUpdateUserProfile } = await import("@/services/userService");

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await createOrUpdateUserProfile(userCredential.user.uid, email);
        router.push("/");
      } catch (err) {
        setError(err.message || "Erreur lors de l'inscription.");
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, confirmPassword, router]
  );

  // Memo: éléments de l'en-tête (évite la recréation sur chaque rendu)
  const headerContent = useMemo(
    () => (
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-12 h-12 bg-[#c28e46] flex items-center justify-center">
            <UserPlus size={24} className="text-[#151310]" />
          </div>
          <h1 className="font-headline text-3xl text-[#c28e46] uppercase tracking-widest">
            Inscription
          </h1>
        </div>
        <p className="text-[#8a8171] font-label text-sm uppercase tracking-widest">
          Créez votre compte - Monster Hunter
        </p>
      </div>
    ),
    []
  );

  return (
    <div className="ml-0 min-h-screen bg-[#151310] flex">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {headerContent}
          <div className="bg-[#211f1c] border-4 border-[#504538] p-8">
            <form className="space-y-4" onSubmit={handleRegister}>
              {error && (
                <div className="text-[#ffb4ab] text-sm font-medium bg-[#93000a]/20 p-3 border border-[#93000a]/50 rounded" role="alert">
                  {error}
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

              <div>
                <label htmlFor="confirm-password" className="block mb-2 text-[#c28e46] font-label text-xs uppercase font-semibold tracking-wider">
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#2c2a26] border-2 border-[#504538] text-[#e3d5b8] px-4 py-3 placeholder-[#8a8171] focus:border-[#c28e46] focus:outline-none transition-colors font-body"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || loading}
                className="w-full bg-[#c28e46] text-[#151310] py-3 font-headline font-bold uppercase tracking-widest hover:bg-[#e8b879] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
              >
                <UserPlus size={18} />
                {isLoading || loading ? "Inscription en cours..." : "S'inscrire"}
              </button>

              <div className="text-center text-sm text-[#8a8171] pt-2">
                Vous avez déjà un compte ?{' '}
                <Link href="/login" className="text-[#c28e46] font-semibold hover:text-[#e8b879] transition-colors">
                  Se connecter
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;