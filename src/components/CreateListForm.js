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
      setError("Le nom de l'Escouade est obligatoire.");
      return;
    }
    setLoading(true);
    try {
      await onCreateList?.(name.trim());
      setName("");
    } catch (err) {
      setError(err.message || "Erreur lors de la création de l'Escouade.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-4 items-end"
      aria-label="Créer une nouvelle Escouade"
      autoComplete="off"
    >
      <div className="flex-1 w-full">
        <label htmlFor="list-name" className="block mb-2 text-[#c28e46] font-headline text-sm font-bold uppercase tracking-wider">
          Nom de l'Escouade
        </label>
        <input
          id="list-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Ex: Les Lames de Pierre, Les Éclairs Dorés..."
          className="h-12 w-full bg-[#2c2a26] border-2 border-[#504538] text-[#e3d5b8] px-4 placeholder-[#8a8171] focus:border-[#c28e46] focus:outline-none transition-colors font-body"
          required
          aria-required="true"
          aria-invalid={!!error}
          disabled={loading}
        />
        {error && <div className="text-[#ffb4ab] text-xs mt-2 font-medium" role="alert">{error}</div>}
      </div>
      <button
        type="submit"
        className="flex items-center gap-2 h-12 px-6 bg-[#c28e46] text-[#151310] font-headline font-bold uppercase tracking-widest hover:bg-[#e8b879] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        aria-label="Créer l'Escouade"
        disabled={loading}
      >
        <Plus size={18} aria-hidden="true" />
        {loading ? "Création..." : "Créer"}
      </button>
    </form>
  );
}
