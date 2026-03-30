"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useInjuryDetail, useUpdateInjury, useAddComment } from "@/hooks/useInjuries";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import type { InjuryStatus } from "@/types/injury.types";

const STATUS_OPTIONS: { value: InjuryStatus; label: string }[] = [
  { value: "activa",           label: "Activa"          },
  { value: "en_recuperacion",  label: "En recuperación" },
  { value: "resuelta",         label: "Resuelta"        },
];

export default function InjuryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { trainer } = useAuth();
  const { data: injury, isLoading } = useInjuryDetail(id);
  const updateMutation = useUpdateInjury(trainer?.uid ?? "");
  const commentMutation = useAddComment(id);

  const [newStatus, setNewStatus] = useState<InjuryStatus | null>(null);
  const [notes, setNotes]         = useState("");
  const [commentText, setComment] = useState("");
  const [saving, setSaving]       = useState(false);

  const handleSaveStatus = async () => {
    if (!injury) return;
    setSaving(true);
    try {
      await updateMutation.mutateAsync({ id, data: { status: newStatus ?? injury.status, trainerNotes: notes || injury.trainerNotes } });
      setNewStatus(null);
    } finally {
      setSaving(false);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim() || !trainer) return;
    await commentMutation.mutateAsync({ authorId: trainer.uid, authorName: trainer.displayName, authorRole: "trainer", text: commentText.trim() });
    setComment("");
  };

  if (isLoading) return (
    <div className="px-4 pt-6 space-y-4">
      <Skeleton className="h-8 w-32 rounded-xl" />
      <Skeleton className="h-40 rounded-2xl" />
    </div>
  );

  if (!injury) return (
    <div className="flex flex-col items-center justify-center h-full py-20 px-4">
      <p className="text-white font-bold">Lesión no encontrada</p>
      <button onClick={() => router.back()} className="text-accent-primary text-sm mt-3">Volver</button>
    </div>
  );

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      <motion.button onClick={() => router.back()} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-1.5 text-[#3d8c58] text-sm font-semibold hover:text-accent-primary transition-colors">
        ← Lesiones
      </motion.button>

      {/* injury info */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 space-y-3"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-white font-extrabold text-xl capitalize">{injury.bodyPart.replace("_", " ")}</h1>
            <p className="text-[#3d8c58] text-xs mt-0.5">{injury.reportedAt?.toDate?.().toLocaleDateString("es-ES")}</p>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <Badge variant={injury.severity} />
            <Badge variant={injury.status} />
          </div>
        </div>
        <p className="text-[#aaa] text-sm">{injury.description}</p>
        {injury.blockedExercises.length > 0 && (
          <div>
            <p className="text-[#f87171] text-xs font-semibold mb-1">Ejercicios bloqueados:</p>
            <div className="flex flex-wrap gap-1.5">
              {injury.blockedExercises.map(e => (
                <span key={e} className="text-xs px-2 py-0.5 rounded-full text-[#f87171]"
                  style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)" }}>
                  {e}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* update status */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-4 space-y-3"
        style={{ background: "rgba(0,255,135,0.03)", border: "1px solid rgba(0,255,135,0.1)" }}>
        <p className="text-white font-bold text-sm">Actualizar estado</p>
        <div className="flex gap-2">
          {STATUS_OPTIONS.map(s => (
            <button key={s.value} onClick={() => setNewStatus(s.value)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: (newStatus ?? injury.status) === s.value ? "rgba(0,255,135,0.15)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${(newStatus ?? injury.status) === s.value ? "rgba(0,255,135,0.4)" : "rgba(255,255,255,0.08)"}`,
                color: (newStatus ?? injury.status) === s.value ? "#00FF87" : "#3d8c58",
              }}>
              {s.label}
            </button>
          ))}
        </div>
        <textarea value={notes || injury.trainerNotes || ""}
          onChange={e => setNotes(e.target.value)}
          placeholder="Notas del entrenador..."
          rows={3}
          className="w-full rounded-xl px-3 py-2 text-white text-sm outline-none resize-none placeholder-[#3d8c58]"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
        <Button variant="primary" size="sm" fullWidth isLoading={saving} onClick={handleSaveStatus}>
          Guardar cambios
        </Button>
      </motion.div>

      {/* comments */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <h2 className="text-white font-bold text-base mb-3">Comentarios ({injury.comments.length})</h2>
        {injury.comments.length === 0 ? (
          <p className="text-[#3d8c58] text-xs mb-3">Sin comentarios aún.</p>
        ) : (
          <div className="space-y-2 mb-3">
            {injury.comments.map(c => (
              <div key={c.id} className="rounded-xl p-3"
                style={{
                  background: c.authorRole === "trainer" ? "rgba(0,255,135,0.05)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${c.authorRole === "trainer" ? "rgba(0,255,135,0.12)" : "rgba(255,255,255,0.06)"}`,
                }}>
                <p className="text-xs font-bold" style={{ color: c.authorRole === "trainer" ? "#00FF87" : "#60a5fa" }}>
                  {c.authorName}
                </p>
                <p className="text-[#ccc] text-sm mt-0.5">{c.text}</p>
                <p className="text-[#3d8c58] text-[10px] mt-1">
                  {c.createdAt?.toDate?.().toLocaleDateString("es-ES")}
                </p>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input value={commentText} onChange={e => setComment(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleComment()}
            placeholder="Escribe un comentario..."
            className="flex-1 rounded-xl px-3 py-2 text-white text-sm outline-none placeholder-[#3d8c58]"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
          <Button variant="primary" size="sm" isLoading={commentMutation.isPending} onClick={handleComment}>
            Enviar
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
