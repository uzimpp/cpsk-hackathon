import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`bg-[#22c55e] text-white rounded-lg px-6 py-2 font-semibold hover:bg-green-600 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
