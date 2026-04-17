"use client";

export default function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-24 bg-surface-container-high rounded animate-pulse" />
      ))}
    </div>
  );
}
