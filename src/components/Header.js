export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 bg-white/95 shadow-sm backdrop-blur">
      <nav
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Navigation principale"
      >
        {/* Nom de l'application */}
        <span className="text-xl font-bold tracking-tight text-zinc-900">
          TaskManager
        </span>

        {/* Menu de navigation fictif */}
        <div className="flex items-center gap-6 text-sm font-medium text-zinc-600">
          <a
            href="/"
            className="transition-colors hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded"
          >
            Accueil
          </a>
          <a
            href="/taches"
            className="transition-colors hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded"
          >
            Tâches
          </a>
        </div>
      </nav>
    </header>
  );
}
