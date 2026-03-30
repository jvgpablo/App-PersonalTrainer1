"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useRoutineDetail, useUpdateRoutine } from "@/hooks/useRoutines";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Exercise, BodyArea } from "@/types/routine.types";

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

export default function EditRoutinePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { trainer } = useAuth();
  const { data: routine, isLoading } = useRoutineDetail(id);
  const updateMutation = useUpdateRoutine(trainer?.uid ?? "");

  const [title, setTitle]       = useState("");
  const [description, setDesc]  = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [error, setError]       = useState("");

  useEffect(() => {
    if (routine) {
      setTitle(routine.title);
      setDesc(routine.description ?? "");
      setExercises(routine.exercises);
    }
  }, [routine]);

  const updateExercise = (idx: number, field: keyof Exercise, value: string | number | boolean) => {
    setExercises(prev => prev.map((ex, i) => i === idx ? { ...ex, [field]: value } : ex));
  };

  const handleSave = async () => {
    if (!title.trim()) { setError("Ingresa el título."); return; }
    if (exercises.some(e => !e.name.trim())) { setError("Todos los ejercicios necesitan nombre."); return; }
    setError("");
    try {
      await updateMutation.mutateAsync({ id, data: { title, description: description || undefined, exercises } });
      router.back();
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (isLoading) return (
    <div className="px-4 pt-6 space-y-4">
      <Skeleton className="h-8 w-32 rounded-xl" />
      <Skeleton className="h-20 rounded-2xl" />
    </div>
  );

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      <motion.button onClick={() => router.back()} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-1.5 text-[#3d8c58] text-sm font-semibold hover:text-accent-primary transition-colors">
        ← Cancelar
      </motion.button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-white font-extrabold text-2xl">Editar rutina</h1>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="p-3 rounded-xl text-xs text-[#ff6b6b]"
            style={{ background: "rgba(255,59,59,0.1)", border: "1px solid rgba(255,59,59,0.3)" }}>
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-0">
        <Input label="Título" type="text" value={title} onChange={e => { setTitle(e.target.value); setError(""); }} />
        <Input label="Descripción (opcional)" type="text" value={description} onChange={e => setDesc(e.target.value)} />
      </div>

      <div>
        <p className="text-white font-bold text-sm mb-3">Ejercicios</p>
        <div className="space-y-3">
          {exercises.map((ex, idx) => (
            <div key={ex.id} className="rounded-2xl p-4 space-y-3"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-[#3d8c58] text-xs font-semibold uppercase">Ejercicio {idx + 1}</p>
              <Input label="Nombre" type="text" value={ex.name}
                onChange={e => updateExercise(idx, "name", e.target.value)} />

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
            </div>
          ))}
        </div>
      </div>

      <Button variant="primary" size="lg" fullWidth isLoading={updateMutation.isPending} onClick={handleSave}>
        Guardar cambios
      </Button>
    </div>
  );
}
