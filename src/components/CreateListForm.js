"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export default function CreateListForm({ onCreateList }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Le nom de la liste est obligatoire.");
      return;
    }
    setLoading(true);
    try {
      await onCreateList?.(name.trim());
      setName("");
    } catch (err) {
      setError(err.message || "Erreur lors de la création de la liste.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-4 items-end bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 shadow-sm font-body"
      aria-label="Créer une nouvelle liste partagée"
      autoComplete="off"
    >
      <div className="flex-1 w-full">
        <label htmlFor="list-name" className="block mb-1 text-on-surface font-headline font-medium">
          Nom de la liste
        </label>
        <input
          id="list-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nom de la nouvelle liste..."
          className="h-12 w-full rounded-lg border border-outline-variant bg-surface-container-highest px-4 text-on-surface placeholder:text-outline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2"
          required
          aria-required="true"
          aria-invalid={!!error}
          disabled={loading}
        />
        {error && <div className="text-error text-sm mt-1 font-medium" role="alert">{error}</div>}
      </div>
      <button
        type="submit"
        className="flex items-center gap-2 h-12 px-6 rounded-full bg-primary text-on-primary font-semibold shadow-md hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        aria-label="Créer la liste"
        disabled={loading}
      >
        <Plus size={18} aria-hidden="true" />
        {loading ? "Création..." : "Créer"}
      </button>
    </form>
  );
}
