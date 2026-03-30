import { cn } from "@/lib/utils";
import type { InjurySeverity, InjuryStatus } from "@/types/injury.types";

type Variant = InjurySeverity | InjuryStatus | "active" | "inactive" | "info";

const cfg: Record<Variant, { bg: string; text: string; label: string }> = {
  leve:           { bg: "rgba(255,184,0,0.12)",  text: "#FFB800", label: "Leve" },
  moderada:       { bg: "rgba(255,107,53,0.12)", text: "#FF6B35", label: "Moderada" },
  grave:          { bg: "rgba(255,59,59,0.12)",  text: "#FF3B3B", label: "Grave" },
  activa:         { bg: "rgba(255,59,59,0.12)",  text: "#FF3B3B", label: "Activa" },
  en_recuperacion:{ bg: "rgba(255,184,0,0.12)",  text: "#FFB800", label: "En recuperación" },
  resuelta:       { bg: "rgba(0,255,135,0.12)",  text: "#00FF87", label: "Resuelta" },
  active:         { bg: "rgba(0,255,135,0.12)",  text: "#00FF87", label: "Activa" },
  inactive:       { bg: "rgba(82,82,91,0.2)",    text: "#52525B", label: "Inactiva" },
  info:           { bg: "rgba(59,130,246,0.15)", text: "#3B82F6", label: "Info" },
};

export function Badge({ variant, label, size = "md" }: { variant: Variant; label?: string; size?: "sm" | "md" }) {
  const c = cfg[variant];
  return (
    <span
      className={cn("inline-flex items-center rounded-full font-semibold", size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs")}
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {label ?? c.label}
    </span>
  );
}
