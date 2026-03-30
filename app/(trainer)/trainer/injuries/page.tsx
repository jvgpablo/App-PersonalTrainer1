"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useTrainerInjuries } from "@/hooks/useInjuries";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import type { InjuryStatus } from "@/types/injury.types";

const STATUS_FILTERS: { value: InjuryStatus | "all"; label: string }[] = [
  { value: "all",            label: "Todas"         },
  { value: "activa",         label: "Activas"       },
  { value: "en_recuperacion",label: "Recuperación"  },
  { value: "resuelta",       label: "Resueltas"     },
];

export default function TrainerInjuriesPage() {
  const { trainer } = useAuth();
  const { data: injuries, isLoading } = useTrainerInjuries(trainer?.uid ?? "");
  const [filter, setFilter] = useState<InjuryStatus | "all">("all");

  const filtered = injuries?.filter(i => filter === "all" || i.status === filter) ?? [];

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[#3d8c58] text-xs font-semibold uppercase tracking-widest">Entrenador</p>
        <h1 className="text-white font-extrabold text-2xl mt-0.5">Lesiones</h1>
        <p className="text-[#3d8c58] text-sm mt-1">{injuries?.length ?? 0} total</p>
      </motion.div>

      {/* filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {STATUS_FILTERS.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              background: filter === f.value ? "rgba(0,255,135,0.15)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${filter === f.value ? "rgba(0,255,135,0.4)" : "rgba(255,255,255,0.08)"}`,
              color: filter === f.value ? "#00FF87" : "#3d8c58",
            }}>
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="text-5xl mb-4">🩹</span>
          <p className="text-white font-bold text-base">Sin lesiones</p>
          <p className="text-[#3d8c58] text-sm mt-1">
            {filter === "all" ? "Tus alumnos están sin lesiones registradas" : "Sin lesiones con este estado"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((inj, i) => (
            <motion.div key={inj.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/trainer/injuries/${inj.id}` as any}>
                <div className="rounded-2xl p-4"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm capitalize">{inj.bodyPart.replace("_", " ")}</p>
                      <p className="text-[#3d8c58] text-xs mt-0.5 line-clamp-2">{inj.description}</p>
                      <p className="text-[#3d8c58] text-[10px] mt-1.5">
                        {inj.reportedAt?.toDate?.().toLocaleDateString("es-ES") ?? "—"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 items-end ml-3">
                      <Badge variant={inj.severity} />
                      <Badge variant={inj.status} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
