"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUnassignedStudents, useAllTrainers, useAssignStudent } from "@/hooks/useUsers";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AssignStudentPage() {
  const router = useRouter();
  const { data: students, isLoading: loadingStudents } = useUnassignedStudents();
  const { data: trainers, isLoading: loadingTrainers } = useAllTrainers();
  const assignMutation = useAssignStudent();

  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedTrainer, setSelectedTrainer] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleAssign = async () => {
    if (!selectedStudent || !selectedTrainer) {
      setError("Selecciona un estudiante y un entrenador.");
      return;
    }
    setError("");
    try {
      await assignMutation.mutateAsync({ studentId: selectedStudent, trainerId: selectedTrainer });
      setSuccess(true);
      setSelectedStudent(null);
      setSelectedTrainer(null);
      setTimeout(() => setSuccess(false), 2500);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="px-4 pt-6 pb-4">
      <motion.button onClick={() => router.back()} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-1.5 text-[#3d8c58] text-sm font-semibold mb-6 hover:text-accent-primary transition-colors">
        ← Volver
      </motion.button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[#3d8c58] text-xs font-semibold uppercase tracking-widest">Admin</p>
        <h1 className="text-white font-extrabold text-2xl mt-0.5">Asignar estudiante</h1>
        <p className="text-[#3d8c58] text-sm mt-1">Vincula un alumno con su entrenador</p>
      </motion.div>

      <div className="h-px bg-accent-primary/[0.08] my-5" />

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-4 p-3 rounded-xl text-xs text-[#ff6b6b]"
            style={{ background: "rgba(255,59,59,0.1)", border: "1px solid rgba(255,59,59,0.3)" }}>
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-4 p-3 rounded-xl text-xs text-accent-primary"
            style={{ background: "rgba(0,255,135,0.08)", border: "1px solid rgba(0,255,135,0.25)" }}>
            ¡Asignación realizada con éxito!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Students */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-5">
        <h2 className="text-white font-bold text-sm mb-3">
          Estudiantes sin entrenador
          <span className="text-[#3d8c58] font-normal ml-2">({students?.length ?? 0})</span>
        </h2>
        {loadingStudents ? (
          <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-14 rounded-2xl" />)}</div>
        ) : students?.length === 0 ? (
          <p className="text-[#3d8c58] text-sm p-4 rounded-2xl"
            style={{ background: "rgba(0,255,135,0.03)", border: "1px solid rgba(0,255,135,0.08)" }}>
            Todos los estudiantes tienen entrenador asignado.
          </p>
        ) : (
          <div className="space-y-2">
            {students?.map(s => (
              <button key={s.uid} onClick={() => setSelectedStudent(s.uid === selectedStudent ? null : s.uid)}
                className="w-full flex items-center gap-3 rounded-2xl p-3 transition-all text-left"
                style={{
                  background: selectedStudent === s.uid ? "rgba(0,255,135,0.1)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${selectedStudent === s.uid ? "rgba(0,255,135,0.35)" : "rgba(255,255,255,0.06)"}`,
                }}>
                <Avatar name={s.displayName} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{s.displayName}</p>
                  <p className="text-[#3d8c58] text-xs truncate">{s.email}</p>
                </div>
                {selectedStudent === s.uid && <span className="text-accent-primary text-lg">✓</span>}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Trainers */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6">
        <h2 className="text-white font-bold text-sm mb-3">Selecciona entrenador</h2>
        {loadingTrainers ? (
          <div className="space-y-2">{[1,2].map(i => <Skeleton key={i} className="h-14 rounded-2xl" />)}</div>
        ) : trainers?.length === 0 ? (
          <p className="text-[#3d8c58] text-sm">Sin entrenadores disponibles.</p>
        ) : (
          <div className="space-y-2">
            {trainers?.map(t => (
              <button key={t.uid} onClick={() => setSelectedTrainer(t.uid === selectedTrainer ? null : t.uid)}
                className="w-full flex items-center gap-3 rounded-2xl p-3 transition-all text-left"
                style={{
                  background: selectedTrainer === t.uid ? "rgba(0,255,135,0.1)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${selectedTrainer === t.uid ? "rgba(0,255,135,0.35)" : "rgba(255,255,255,0.06)"}`,
                }}>
                <Avatar name={t.displayName} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{t.displayName}</p>
                  <p className="text-[#3d8c58] text-xs">{t.studentIds.length} alumnos actuales</p>
                </div>
                {selectedTrainer === t.uid && <span className="text-accent-primary text-lg">✓</span>}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      <Button variant="primary" size="lg" fullWidth
        isLoading={assignMutation.isPending}
        onClick={handleAssign}
        className={!selectedStudent || !selectedTrainer ? "opacity-50" : ""}>
        Confirmar asignación
      </Button>
    </div>
  );
}
