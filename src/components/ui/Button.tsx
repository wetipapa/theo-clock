import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "soft" | "ghost";
type Size = "lg" | "md" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-[var(--color-sunset)] text-white shadow-[0_6px_0_var(--color-sunset-deep)] active:shadow-[0_2px_0_var(--color-sunset-deep)] active:translate-y-1 border-2 border-[var(--color-sunset-soft)]",
  secondary: "bg-[#8fd3e8] text-[#1f4a57] shadow-[0_6px_0_#4fa8c2] active:shadow-[0_2px_0_#4fa8c2] active:translate-y-1 border-2 border-[#bfe6f2]",
  soft: "bg-[var(--color-card)] text-[var(--color-ink)] shadow-[0_4px_0_var(--color-line-deep)] active:shadow-[0_1px_0_var(--color-line-deep)] active:translate-y-1 border-2 border-[var(--color-line)]",
  ghost: "bg-transparent text-[#8a6a4a] hover:bg-[#ffffff55]",
};

const SIZE_CLASSES: Record<Size, string> = {
  lg: "min-h-16 px-8 text-xl rounded-3xl gap-2.5",
  md: "min-h-14 px-6 text-lg rounded-2xl gap-2",
  sm: "min-h-11 px-4 text-sm rounded-xl gap-1.5",
};

export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center font-extrabold transition-transform duration-150 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
