// Page d'accueil TaskManager, épurée et centrée

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black font-sans">
      {/* Titre principal */}
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 text-center">
        TaskManager
      </h1>
      {/* Sous-titre */}
      <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 text-center">
        Gérez vos tâches efficacement
      </p>
      {/* Bouton Commencer */}
      <a
        href="#"
        className="px-8 py-3 rounded-full bg-blue-600 text-white text-base font-medium shadow hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
        role="button"
        aria-label="Commencer l'utilisation de TaskManager"
      >
        Commencer
      </a>
    </main>
  );
}
