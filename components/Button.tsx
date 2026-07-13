import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-[#6d28d9] disabled:bg-[#4c3a75] disabled:text-[#a9a0c9]",
  secondary:
    "bg-transparent border border-border text-text hover:border-accent-soft disabled:opacity-40",
  ghost:
    "bg-transparent text-text-muted hover:text-text disabled:opacity-40",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>(({ variant = "primary", className = "", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`min-h-[44px] px-5 rounded-xl font-semibold text-[15px] transition-colors disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    />
  );
});
Button.displayName = "Button";
