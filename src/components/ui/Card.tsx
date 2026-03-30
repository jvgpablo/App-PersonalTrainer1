"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  pressable?: boolean;
  onClick?: () => void;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddings = { none: "", sm: "p-3", md: "p-4", lg: "p-5" };

export function Card({ children, className, pressable, onClick, padding = "md" }: CardProps) {
  const base = cn(
    "bg-background-secondary border border-border rounded-2xl",
    paddings[padding],
    pressable && "cursor-pointer",
    className
  );

  if (pressable) {
    return (
      <motion.div
        className={base}
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
        whileHover={{ borderColor: "rgba(0,255,135,0.2)" }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={base}>{children}</div>;
}
