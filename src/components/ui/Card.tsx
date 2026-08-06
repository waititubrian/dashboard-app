import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-gray-700 bg-gray-900 p-6 ${className}`}
    >
      {children}
    </div>
  );
}
