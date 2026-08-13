import type { HTMLAttributes, ReactNode } from "react";

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={`rounded-[28px] bg-[var(--color-card)] border-2 border-[#f1e0c4] shadow-[0_8px_0_#f1e0c4] ${className ?? ""}`}
      {...props}
    >
      {children}
    </div>
  );
}
