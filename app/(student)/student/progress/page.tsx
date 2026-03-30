"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { useStudentProgress, useRecordProgress } from "@/hooks/useProgress";
import { WeightLineChart, WeeklySessionsChart } from "@/components/charts/ProgressChart";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ProgressPage() {
  const { student } = useAuth();
  const { data, isLoading } = useStudentProgress(student?.uid ?? "");
  const recordMutation = useRecordProgress(student?.uid ?? "");

  const [showForm, setShowForm] = useState(false);
  const [weight, setWeight]     = useState("");
  const [notes, setNotes]       = useState("");
  const [goals, setGoals]       = useState("1");
  const [saving, setSaving]     = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");

  const handleRecord = async () => {
    if (!student) return;
    setSaving(true);
    setError("");
    try {
      await recordMutation.mutateAsync({
        studentId: student.uid,
        date: Timestamp.now(),
        weight: weight ? parseFloat(weight) : undefined,
        notes: notes || undefined,
        metrics: { goalsAchieved: parseInt(goals) || 1, attendanceStreak: 1 },
      });
      setSuccess(true);
      setShowForm(false);
      setWeight("");
      setNotes("");
      setGoals("1");
      setTimeout(() => setSuccess(false), 2000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-4 pt-6 pb-4 space-y-6">
      <div className="flex items-start justify-between">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[#3d8c58] text-xs font-semibold uppercase tracking-widest">Estudiante</p>
          <h1 className="text-white font-extrabold text-2xl mt-0.5">Mi progreso</h1>
          <p className="text-[#3d8c58] text-sm mt-1">{data?.entries.length ?? 0} registros totales</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Button variant="primary" size="sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancelar" : "+ Registrar"}
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-3 rounded-xl text-xs text-accent-primary"
            style={{ background: "rgba(0,255,135,0.08)", border: "1px solid rgba(0,255,135,0.25)" }}>
            ¡Progreso registrado!
          </motion.div>
        )}
        {showForm && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl p-4 space-y-3"
              style={{ background: "rgba(0,255,135,0.04)", border: "1px solid rgba(0,255,135,0.15)" }}>
              <p className="text-white font-bold text-sm">Nuevo registro</p>
              {error && (
                <p className="text-[#ff6b6b] text-xs">{error}</p>
              )}
              <Input label="Peso actual (kg)" type="number" value={weight}
                onChange={e => setWeight(e.target.value)} />
              <div>
                <p className="text-[#3d8c58] text-xs mb-1.5">Metas alcanzadas hoy</p>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setGoals(String(n))}
                      className="w-10 h-10 rounded-xl font-bold text-sm transition-all"
                      style={{
                        background: goals === String(n) ? "rgba(0,255,135,0.2)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${goals === String(n) ? "rgba(0,255,135,0.5)" : "rgba(255,255,255,0.08)"}`,
                        color: goals === String(n) ? "#00FF87" : "#3d8c58",
                      }}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <Input label="Notas (opcional)" type="text" value={notes}
                onChange={e => setNotes(e.target.value)} />
              <Button variant="primary" size="md" fullWidth isLoading={saving} onClick={handleRecord}>
                Guardar registro
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* weight chart */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <h2 className="text-white font-bold text-base mb-3">Evolución de peso</h2>
        <div className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <WeightLineChart data={data?.chartData ?? []} isLoading={isLoading} />
          )}
        </div>
      </motion.div>

      {/* weekly chart */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
        <h2 className="text-white font-bold text-base mb-3">Sesiones semanales</h2>
        <div className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {isLoading ? (
            <Skeleton className="h-36 w-full" />
          ) : (
            <WeeklySessionsChart data={data?.weeklyData ?? []} isLoading={isLoading} />
          )}
        </div>
      </motion.div>

      {/* history */}
      {data && data.entries.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          <h2 className="text-white font-bold text-base mb-3">Historial</h2>
          <div className="space-y-2">
            {data.entries.slice(0, 10).map((entry, i) => (
              <motion.div key={entry.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 rounded-2xl p-3"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(0,255,135,0.08)" }}>
                  <span className="text-accent-primary text-xs font-bold">
                    {entry.date?.toDate?.().getDate() ?? "?"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold">
                    {entry.date?.toDate?.().toLocaleDateString("es-ES") ?? "Sin fecha"}
                  </p>
                  {entry.notes && <p className="text-[#3d8c58] text-xs truncate">{entry.notes}</p>}
                </div>
                <div className="text-right">
                  {entry.weight && <p className="text-white text-sm font-bold">{entry.weight} kg</p>}
                  <p className="text-accent-primary text-[10px]">+{entry.metrics.goalsAchieved} metas</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
