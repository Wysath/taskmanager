// Tableau de bord statistiques pour les tâches
import React from "react";

const Dashboard = ({ tasks = [] }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  return (
    <div className="w-full mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Carte Total */}
      <div className="flex flex-col items-center justify-center rounded-xl bg-blue-100 text-blue-900 p-6 shadow-sm">
        <span className="text-3xl font-bold">{total}</span>
        <span className="mt-2 text-sm font-medium uppercase tracking-wide">Total</span>
      </div>
      {/* Carte Complétées */}
      <div className="flex flex-col items-center justify-center rounded-xl bg-green-100 text-green-900 p-6 shadow-sm">
        <span className="text-3xl font-bold">{completed}</span>
        <span className="mt-2 text-sm font-medium uppercase tracking-wide">Complétées</span>
      </div>
      {/* Carte En attente */}
      <div className="flex flex-col items-center justify-center rounded-xl bg-orange-100 text-orange-900 p-6 shadow-sm">
        <span className="text-3xl font-bold">{pending}</span>
        <span className="mt-2 text-sm font-medium uppercase tracking-wide">En attente</span>
      </div>
    </div>
  );
};

export default Dashboard;
