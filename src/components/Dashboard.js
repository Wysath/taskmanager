// Tableau de bord statistiques pour les tâches
import React from "react";

const Dashboard = ({ tasks = [] }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  return (
    <div className="w-full mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Carte Total */}
      <div className="flex flex-col items-center justify-center rounded-xl bg-surface-container-high text-on-surface p-6 shadow-sm border border-outline-variant/30">
        <span className="text-3xl font-bold font-headline">{total}</span>
        <span className="mt-2 text-sm font-medium uppercase tracking-wide text-on-surface-variant">Total</span>
      </div>
      {/* Carte Complétées */}
      <div className="flex flex-col items-center justify-center rounded-xl bg-primary-container text-on-primary p-6 shadow-sm border border-outline-variant/30">
        <span className="text-3xl font-bold font-headline">{completed}</span>
        <span className="mt-2 text-sm font-medium uppercase tracking-wide text-on-primary-container">Complétées</span>
      </div>
      {/* Carte En attente */}
      <div className="flex flex-col items-center justify-center rounded-xl bg-secondary-container text-on-secondary-container p-6 shadow-sm border border-outline-variant/30">
        <span className="text-3xl font-bold font-headline">{pending}</span>
        <span className="mt-2 text-sm font-medium uppercase tracking-wide text-on-secondary-container">En attente</span>
      </div>
    </div>
  );
};

export default Dashboard;
