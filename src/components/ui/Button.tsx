"use client";

import { motion } from "framer-motion";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variants = {
  primary:   "bg-gradient-to-r from-accent-primary to-accent-secondary text-background-primary font-bold shadow-btn hover:shadow-btn-hover",
  secondary: "bg-background-tertiary border border-border text-white hover:border-accent-primary/30",
  ghost:     "bg-transparent text-accent-primary hover:bg-accent-primary/10",
  danger:    "bg-accent-danger text-white hover:bg-red-600",
};
const sizes = {
  sm: "px-4 py-2 text-sm rounded-xl",
  md: "px-5 py-3 text-sm rounded-xl",
  lg: "px-6 py-4 text-base rounded-2xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", isLoading, fullWidth, children, className, disabled, ...props }, ref
) {
  return (
    <motion.button
      ref={ref as any}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer select-none",
        variants[variant], sizes[size],
        fullWidth && "w-full",
        (disabled || isLoading) && "opacity-50 pointer-events-none",
        className
      )}
      disabled={disabled || isLoading}
      {...(props as any)}
    >
      {isLoading && (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </motion.button>
  );
});
