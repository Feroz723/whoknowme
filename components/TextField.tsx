import { InputHTMLAttributes, forwardRef } from "react";

export const TextField = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }
>(({ label, error, className = "", id, ...props }, ref) => {
  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={id}
          className="block text-[12px] font-medium text-text-muted mb-1.5"
        >
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        id={id}
        className={`w-full min-h-[44px] rounded-lg bg-surface-raised border px-3.5 text-[14.5px] text-text placeholder:text-text-muted/60 outline-none transition-colors ${
          error ? "border-error" : "border-border focus:border-accent-soft"
        } ${className}`}
        {...props}
      />
      {error ? (
        <p className="mt-1 text-[12px] text-error">{error}</p>
      ) : null}
    </div>
  );
});
TextField.displayName = "TextField";
