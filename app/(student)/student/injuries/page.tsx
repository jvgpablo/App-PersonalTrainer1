"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useMyInjuries } from "@/hooks/useInjuries";
import { useInjuryDetail, useAddComment } from "@/hooks/useInjuries";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

export default function StudentInjuriesPage() {
  const { student } = useAuth();
  const { data: injuries, isLoading } = useMyInjuries(student?.uid ?? "");

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      <div className="flex items-start justify-between">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[#3d8c58] text-xs font-semibold uppercase tracking-widest">Mis lesiones</p>
          <h1 className="text-white font-extrabold text-2xl mt-0.5">Lesiones</h1>
          <p className="text-[#3d8c58] text-sm mt-1">{injuries?.length ?? 0} registradas</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Link href="/student/injuries/report">
            <Button variant="primary" size="sm">+ Reportar</Button>
          </Link>
        </motion.div>
      </div>

      <div className="h-px bg-accent-primary/[0.08]" />

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>
      ) : injuries?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="text-5xl mb-4">✅</span>
          <p className="text-white font-bold text-base">Sin lesiones registradas</p>
          <p className="text-[#3d8c58] text-sm mt-1">¡Sigue cuidando tu cuerpo!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {injuries?.map((inj, i) => (
            <motion.div key={inj.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Link href={`/student/injuries/${inj.id}` as any}>
                <div className="rounded-2xl p-4"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-base capitalize">{inj.bodyPart.replace("_", " ")}</p>
                      <p className="text-[#3d8c58] text-xs mt-0.5 line-clamp-2">{inj.description}</p>
                      <p className="text-[#3d8c58] text-[10px] mt-2">
                        {inj.reportedAt?.toDate?.().toLocaleDateString("es-ES") ?? "—"}
                        {inj.comments.length > 0 && ` · ${inj.comments.length} comentario${inj.comments.length > 1 ? "s" : ""}`}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 items-end ml-3">
                      <Badge variant={inj.severity} />
                      <Badge variant={inj.status} />
                    </div>
                  </div>
                  {inj.trainerNotes && (
                    <div className="mt-3 pt-3 border-t border-white/[0.05]">
                      <p className="text-[10px] text-[#3d8c58] font-semibold uppercase">Nota del entrenador</p>
                      <p className="text-[#aaa] text-xs mt-0.5">{inj.trainerNotes}</p>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
