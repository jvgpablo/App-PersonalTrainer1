"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, rightElement, className, value, onChange, onFocus, onBlur, ...props }, ref
) {
  const [focused, setFocused] = useState(false);
  const hasValue = !!value || value === 0;
  const floated = focused || hasValue;

  return (
    <div className={cn("relative mb-4", className)}>
      <div
        className={cn(
          "relative rounded-xl border transition-all duration-200",
          error ? "border-accent-danger shadow-[0_0_0_2px_rgba(255,59,59,0.15)]" :
          focused ? "border-accent-primary shadow-[0_0_0_2px_rgba(0,255,135,0.1)]" :
          "border-border"
        )}
        style={{ background: "rgba(0,255,135,0.03)" }}
      >
        {/* Floating label */}
        <motion.label
          animate={{ top: floated ? "6px" : "50%", translateY: floated ? "0%" : "-50%", fontSize: floated ? "10px" : "14px" }}
          transition={{ type: "tween", duration: 0.15 }}
          className={cn("absolute left-4 pointer-events-none font-medium z-10", error ? "text-accent-danger" : focused ? "text-accent-primary" : "text-text-muted")}
          style={{ letterSpacing: floated ? "1px" : "0", textTransform: floated ? "uppercase" : "none" }}
        >
          {label}
        </motion.label>

        <div className="flex items-center">
          <input
            ref={ref}
            value={value}
            onChange={onChange}
            onFocus={e => { setFocused(true); onFocus?.(e); }}
            onBlur={e => { setFocused(false); onBlur?.(e); }}
            className="w-full bg-transparent pt-6 pb-2 px-4 text-sm text-white placeholder-transparent outline-none"
            style={{ color: "#e0ffe8" }}
            {...props}
          />
          {rightElement && <div className="pr-3">{rightElement}</div>}
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="text-accent-danger text-[11px] mt-1 ml-1 font-medium">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});
