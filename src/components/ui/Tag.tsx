import React from "react";

export default function Tag({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`px-3 py-1 bg-[#22c55e]/10 text-[#22c55e] rounded-full text-sm font-medium ${className}`}
    >
      {children}
    </span>
  );
}
