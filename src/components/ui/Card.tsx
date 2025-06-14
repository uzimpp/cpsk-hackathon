import React from "react";

export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#22c55e] shadow p-6 ${className}`}
    >
      {children}
    </div>
  );
}
