"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createOrUpdateUserProfile } from "@/services/userService";

const RegisterPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createOrUpdateUserProfile(userCredential.user.uid, email);
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
        {/* TopAppBar suppression as per "Destination" Rule for Transactional pages */}
        <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
          {/* Abstract Background Elements (Architectural Sanctuary Style) */}
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary-container/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-tertiary/5 rounded-full blur-[100px]"></div>
          <div className="z-10 w-full max-w-md">
            {/* Brand Logo Anchor */}
            <div className="flex justify-center mb-10">
              <div className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center shadow-lg shadow-primary/20">
                  <span
                    className="material-symbols-outlined text-white"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    architecture
                  </span>
                </div>
                <span className="text-2xl font-bold tracking-tight text-on-surface">
                  Gestionnaire de Tâches
                </span>
              </div>
            </div>
            {/* Card Container */}
            <div className="bg-surface-container-lowest p-10 rounded-[2rem] shadow-[0px_20px_40px_rgba(25,27,35,0.06)] border border-outline-variant/10">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-primary mb-2 tracking-tight">
                  Inscription
                </h1>
                <p className="text-on-surface-variant font-medium">
                  Rejoignez le Gestionnaire de Tâches aujourd'hui
                </p>
              </div>
              <form className="flex flex-col gap-5" onSubmit={handleRegister}>
                {/* Email Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface-variant ml-1">
                    Adresse e-mail
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                      mail
                    </span>
                    <input
                      className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-surface-tint/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline/60"
                      placeholder="nom@exemple.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>
                {/* Password Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface-variant ml-1">
                    Mot de passe
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                      lock
                    </span>
                    <input
                      className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-surface-tint/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline/60"
                      placeholder="••••••••"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                  </div>
                </div>
                {/* Confirm Password Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface-variant ml-1">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                      shield
                    </span>
                    <input
                      className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-surface-tint/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline/60"
                      placeholder="••••••••"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                  </div>
                </div>
                {/* Error Display */}
                {error && (
                  <div className="text-error text-center font-semibold mt-2">
                    {error}
                  </div>
                )}
                {/* Submit Button */}
                <button
                  className="w-full mt-4 bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-full font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
                  type="submit"
                >
                  S&apos;inscrire
                </button>
                <p className="text-center text-on-surface-variant text-sm mt-4">
                  Vous avez déjà un compte?{" "}
                  <Link
                    href="/login"
                    className="text-primary font-bold hover:underline ml-1"
                  >
                    Se connecter
                  </Link>
                </p>
              </form>
            </div>
            {/* Trust Indicator */}
            <div className="mt-8 flex justify-center items-center gap-6 opacity-40">
              <img
                alt="Trusted Partner 1"
                className="h-6 grayscale"
                data-alt="minimalist professional company logo in grayscale with geometric shapes"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxaIR6eZ-gCQvRXJgsh_rEDDWq7VwZK4JCCM4_mK5XyXUbpXFn98y23Tiw7uEQev8DBtuNybIdSsJcf3KFkCUq2gIz0_PpcMAPuOBlepf5PwEf3WdKCSODaToqoGHhsxAx2uuzJ4OyhlnRMA4QKwPEhqV9SioanJODikDkte7lNj5lM1Wt77V--xlKrmc9yeD1W2SwkCZxSmBHJ5Y1BWOBuBIAb2Vvqm07r6PLzl6eQ7Aecjx7M4REOYI6jNryiRmpYuV_oBAYJG8"
              />
              <img
                alt="Trusted Partner 2"
                className="h-6 grayscale"
                data-alt="clean corporate wordmark logo in grayscale with sans-serif typography"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBirADgUHS-_MIXggNpY0hBZgm3cdVVgu81Rxpg40dqomzkYnw7T4wOJz6ddmXX_aGgkVdn3baiqKcAekWBqQ7g0OUvX8enMD-vuSPab1sSErAb5E7Cg2YAcBgYIXU7QveoCxJhacy-VVxVwiVIWFvC_rjtYVr-iPoNya_t0t6u1ZrgFTb_iW07nl1iI6ksXfOV8NHlQWCo-V40PPeLAsQ_yVoACnr6jQa7NUqjaBSCjaw-vcNMkCoezSvasq48IH5_bLEW4TQ8MKE"
              />
              <img
                alt="Trusted Partner 3"
                className="h-6 grayscale"
                data-alt="abstract circular logo icon in grayscale representing connectivity and flow"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1TdQRj7g4AeI4te2FgmEw-1YY4FuMDlj09wgyncFJpIIGhd0MjBgS_pkTyNZbt-vq210HHyKqZZZ9KpdgXlgAsVgNqky3NHDXU0i5IvJF7Xw6IdZpyL0q0a07QIq5lNHx4Vd7bVxBQvLOEL8Vq5GqsJA66SIW_CLF0tYuupoFArat-OhkRqMxjU5UAu0e4xT9bmuvcMCnRXhMjGjvxjlj6PBmu3b-7sKewySKNEM_cWNpTXbDkE5aL-DQgqcRqNvX7eMy8AnCy0s"
              />
            </div>
          </div>
        </main>
        {/* Footer Component Integration */}
        <footer className="bg-[#faf8ff] dark:bg-slate-950 border-t border-[#c3c6d6]/20 py-12 px-8 mt-auto">
          <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto w-full">
            <div className="mb-6 md:mb-0">
              <p className="font-['Inter'] text-sm text-[#434654] dark:text-slate-400">
                © 2024 Executive Flow. The Architectural Sanctuary.
              </p>
            </div>
            <div className="flex gap-8">
              <a
                className="font-['Inter'] text-sm text-[#434654] dark:text-slate-400 hover:text-[#0052CC] transition-colors duration-200"
                href="#"
              >
                Privacy Policy
              </a>
              <a
                className="font-['Inter'] text-sm text-[#434654] dark:text-slate-400 hover:text-[#0052CC] transition-colors duration-200"
                href="#"
              >
                Terms of Service
              </a>
              <a
                className="font-['Inter'] text-sm text-[#434654] dark:text-slate-400 hover:text-[#0052CC] transition-colors duration-200"
                href="#"
              >
                Help Center
              </a>
            </div>
          </div>
        </footer>
      </div>
    );
  };

export default RegisterPage;