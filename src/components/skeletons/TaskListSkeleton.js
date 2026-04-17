"use client";

export default function TaskListSkeleton({ count = 5 }) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="h-12 bg-surface-container-high rounded animate-pulse"
        />
      ))}
    </div>
  );
}
