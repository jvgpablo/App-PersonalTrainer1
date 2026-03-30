"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useReportInjury } from "@/hooks/useInjuries";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { BodyPart, InjurySeverity } from "@/types/injury.types";

const BODY_PARTS: { value: BodyPart; label: string; icon: string }[] = [
  { value: "rodilla",      label: "Rodilla",       icon: "🦵" },
  { value: "tobillo",      label: "Tobillo",        icon: "🦶" },
  { value: "hombro",       label: "Hombro",         icon: "💪" },
  { value: "codo",         label: "Codo",           icon: "💪" },
  { value: "muñeca",       label: "Muñeca",         icon: "✋" },
  { value: "espalda_baja", label: "Espalda baja",   icon: "🔙" },
  { value: "espalda_alta", label: "Espalda alta",   icon: "🔛" },
  { value: "cuello",       label: "Cuello",         icon: "🗣️" },
  { value: "cadera",       label: "Cadera",         icon: "🦴" },
  { value: "muslo",        label: "Muslo",          icon: "🦵" },
  { value: "gemelo",       label: "Gemelo",         icon: "🦵" },
  { value: "otro",         label: "Otro",           icon: "❓" },
];

const SEVERITIES: { value: InjurySeverity; label: string; desc: string; color: string }[] = [
  { value: "leve",     label: "Leve",     desc: "Molestia menor, puedes entrenar con precaución", color: "#FFB800" },
  { value: "moderada", label: "Moderada", desc: "Dolor notable, requiere modificar ejercicios",    color: "#FF6B35" },
  { value: "grave",    label: "Grave",    desc: "Dolor fuerte, debes parar el entrenamiento",     color: "#FF3B3B" },
];

export default function ReportInjuryPage() {
  const router = useRouter();
  const { student } = useAuth();
  const reportMutation = useReportInjury();

  const [bodyPart, setBodyPart]   = useState<BodyPart | null>(null);
  const [severity, setSeverity]   = useState<InjurySeverity | null>(null);
  const [description, setDesc]    = useState("");
  const [blocked, setBlocked]     = useState("");
  const [error, setError]         = useState("");

  const handleSubmit = async () => {
    if (!student?.trainerId) { setError("No tienes entrenador asignado. Contacta al administrador."); return; }
    if (!bodyPart)   { setError("Selecciona la zona afectada."); return; }
    if (!severity)   { setError("Selecciona la gravedad."); return; }
    if (!description.trim()) { setError("Describe la lesión."); return; }
    setError("");
    try {
      await reportMutation.mutateAsync({
        studentId: student.uid,
        trainerId: student.trainerId,
        bodyPart,
        severity,
        description: description.trim(),
        blockedExercises: blocked ? blocked.split(",").map(s => s.trim()).filter(Boolean) : [],
      });
      router.replace("/student/injuries");
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
        <p className="text-[#3d8c58] text-xs font-semibold uppercase tracking-widest">Nueva lesión</p>
        <h1 className="text-white font-extrabold text-2xl mt-0.5">Reportar lesión</h1>
        <p className="text-[#3d8c58] text-sm mt-1">Informa a tu entrenador sobre tu lesión</p>
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

      {/* body part */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <p className="text-white font-bold text-sm mb-3">Zona afectada</p>
        <div className="grid grid-cols-3 gap-2">
          {BODY_PARTS.map(bp => (
            <button key={bp.value} onClick={() => setBodyPart(bp.value)}
              className="rounded-2xl p-3 text-center transition-all"
              style={{
                background: bodyPart === bp.value ? "rgba(0,255,135,0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${bodyPart === bp.value ? "rgba(0,255,135,0.4)" : "rgba(255,255,255,0.06)"}`,
              }}>
              <span className="text-xl block mb-1">{bp.icon}</span>
              <p className="text-xs font-semibold" style={{ color: bodyPart === bp.value ? "#00FF87" : "#3d8c58" }}>
                {bp.label}
              </p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* severity */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <p className="text-white font-bold text-sm mb-3">Gravedad</p>
        <div className="space-y-2">
          {SEVERITIES.map(s => (
            <button key={s.value} onClick={() => setSeverity(s.value)}
              className="w-full rounded-2xl p-4 text-left transition-all flex items-start gap-3"
              style={{
                background: severity === s.value ? `${s.color}15` : "rgba(255,255,255,0.03)",
                border: `1px solid ${severity === s.value ? `${s.color}50` : "rgba(255,255,255,0.06)"}`,
              }}>
              <div className="w-3 h-3 rounded-full mt-0.5 flex-shrink-0" style={{ background: s.color }} />
              <div>
                <p className="font-bold text-sm" style={{ color: severity === s.value ? s.color : "#fff" }}>{s.label}</p>
                <p className="text-[#3d8c58] text-xs mt-0.5">{s.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* description & blocked exercises */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-0">
        <Input label="Describe la lesión" type="text" value={description}
          onChange={e => { setDesc(e.target.value); setError(""); }} />
        <Input label="Ejercicios bloqueados (separar con coma)" type="text" value={blocked}
          onChange={e => setBlocked(e.target.value)} />
      </motion.div>

      <Button variant="primary" size="lg" fullWidth isLoading={reportMutation.isPending} onClick={handleSubmit}>
        Reportar lesión
      </Button>
    </div>
  );
}
