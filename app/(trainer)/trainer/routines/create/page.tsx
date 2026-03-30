"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useStudentsByTrainer } from "@/hooks/useUsers";
import { useCreateRoutine } from "@/hooks/useRoutines";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { ExerciseInput, BodyArea } from "@/types/routine.types";

const BODY_AREAS: { value: BodyArea; label: string }[] = [
  { value: "piernas",  label: "Piernas"  },
  { value: "pecho",    label: "Pecho"    },
  { value: "espalda",  label: "Espalda"  },
  { value: "hombros",  label: "Hombros"  },
  { value: "brazos",   label: "Brazos"   },
  { value: "abdomen",  label: "Abdomen"  },
  { value: "cardio",   label: "Cardio"   },
  { value: "fullbody", label: "Full Body" },
];

const emptyExercise = (): ExerciseInput => ({ name: "", bodyArea: "pecho", sets: 3, reps: 10 });

export default function CreateRoutinePage() {
  const router = useRouter();
  const params = useSearchParams();
  const { trainer } = useAuth();
  const { data: students } = useStudentsByTrainer(trainer?.uid ?? "");
  const createMutation = useCreateRoutine();

  const preselectedStudent = params.get("studentId") ?? "";

  const [title, setTitle]         = useState("");
  const [description, setDesc]    = useState("");
  const [studentId, setStudentId] = useState(preselectedStudent);
  const [exercises, setExercises] = useState<ExerciseInput[]>([emptyExercise()]);
  const [error, setError]         = useState("");

  const updateExercise = (idx: number, field: keyof ExerciseInput, value: string | number) => {
    setExercises(prev => prev.map((ex, i) => i === idx ? { ...ex, [field]: value } : ex));
  };
  const addExercise = () => setExercises(prev => [...prev, emptyExercise()]);
  const removeExercise = (idx: number) => setExercises(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    if (!title.trim())   { setError("Ingresa el título de la rutina."); return; }
    if (!studentId)      { setError("Selecciona un estudiante."); return; }
    if (exercises.some(e => !e.name.trim())) { setError("Todos los ejercicios necesitan un nombre."); return; }
    setError("");
    try {
      await createMutation.mutateAsync({
        title,
        description: description || undefined,
        trainerId: trainer!.uid,
        studentId,
        isActive: false,
        exercises: exercises.map((ex, i) => ({ ...ex, id: `ex_${i}_${Date.now()}` })),
      });
      router.replace(`/trainer/students/${studentId}`);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      <motion.button onClick={() => router.back()} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-1.5 text-[#3d8c58] text-sm font-semibold hover:text-accent-primary transition-colors">
        ← Volver
      </motion.button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[#3d8c58] text-xs font-semibold uppercase tracking-widest">Entrenador</p>
        <h1 className="text-white font-extrabold text-2xl mt-0.5">Nueva rutina</h1>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-3 rounded-xl text-xs text-[#ff6b6b]"
            style={{ background: "rgba(255,59,59,0.1)", border: "1px solid rgba(255,59,59,0.3)" }}>
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-0">
        <Input label="Título de la rutina" type="text" value={title}
          onChange={e => { setTitle(e.target.value); setError(""); }} />
        <Input label="Descripción (opcional)" type="text" value={description}
          onChange={e => setDesc(e.target.value)} />
      </motion.div>

      {/* student selector */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <p className="text-white text-sm font-semibold mb-2">Estudiante</p>
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,255,135,0.15)" }}>
          <select value={studentId} onChange={e => setStudentId(e.target.value)}
            className="w-full bg-transparent text-white text-sm px-4 py-3 outline-none appearance-none"
            style={{ background: "rgba(8,22,12,0.8)" }}>
            <option value="" style={{ background: "#0a0a0a" }}>-- Seleccionar alumno --</option>
            {students?.map(s => (
              <option key={s.uid} value={s.uid} style={{ background: "#0a0a0a" }}>{s.displayName}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* exercises */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-white font-bold text-sm">Ejercicios ({exercises.length})</p>
          <button onClick={addExercise} className="text-accent-primary text-sm font-semibold hover:text-accent-secondary transition-colors">
            + Añadir
          </button>
        </div>

        <div className="space-y-3">
          {exercises.map((ex, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-4 space-y-3"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center justify-between">
                <p className="text-[#3d8c58] text-xs font-semibold uppercase">Ejercicio {idx + 1}</p>
                {exercises.length > 1 && (
                  <button onClick={() => removeExercise(idx)} className="text-[#f87171] text-xs font-semibold">Eliminar</button>
                )}
              </div>

              <Input label="Nombre del ejercicio" type="text" value={ex.name}
                onChange={e => updateExercise(idx, "name", e.target.value)} />

              {/* body area */}
              <div>
                <p className="text-[#3d8c58] text-xs mb-2">Zona corporal</p>
                <div className="flex flex-wrap gap-1.5">
                  {BODY_AREAS.map(a => (
                    <button key={a.value} onClick={() => updateExercise(idx, "bodyArea", a.value)}
                      className="text-xs px-2.5 py-1 rounded-full font-semibold transition-all"
                      style={{
                        background: ex.bodyArea === a.value ? "rgba(0,255,135,0.2)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${ex.bodyArea === a.value ? "rgba(0,255,135,0.5)" : "rgba(255,255,255,0.08)"}`,
                        color: ex.bodyArea === a.value ? "#00FF87" : "#3d8c58",
                      }}>
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-[#3d8c58] text-xs mb-1">Series</p>
                  <input type="number" min={1} value={ex.sets}
                    onChange={e => updateExercise(idx, "sets", +e.target.value)}
                    className="w-full rounded-xl px-3 py-2 text-white text-sm text-center outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
                </div>
                <div>
                  <p className="text-[#3d8c58] text-xs mb-1">Reps</p>
                  <input type="number" min={1} value={ex.reps}
                    onChange={e => updateExercise(idx, "reps", +e.target.value)}
                    className="w-full rounded-xl px-3 py-2 text-white text-sm text-center outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
                </div>
                <div>
                  <p className="text-[#3d8c58] text-xs mb-1">Peso (kg)</p>
                  <input type="number" min={0} value={ex.weight ?? ""}
                    onChange={e => updateExercise(idx, "weight", e.target.value ? +e.target.value : 0)}
                    placeholder="—"
                    className="w-full rounded-xl px-3 py-2 text-white text-sm text-center outline-none placeholder-[#3d8c58]"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <Button variant="primary" size="lg" fullWidth isLoading={createMutation.isPending} onClick={handleSubmit}>
        Crear rutina
      </Button>
    </div>
  );
}
