"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useUpdateProfile } from "@/hooks/useUsers";
import { signOut } from "@/services/auth.service";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";

export default function StudentSettingsPage() {
  const router = useRouter();
  const { student, refreshUser } = useAuth();
  const updateMutation = useUpdateProfile();

  const [displayName, setDisplayName] = useState(student?.displayName ?? "");
  const [saving, setSaving]           = useState(false);
  const [success, setSuccess]         = useState(false);
  const [error, setError]             = useState("");

  const handleSave = async () => {
    if (!displayName.trim() || !student) return;
    setSaving(true);
    setError("");
    try {
      await updateMutation.mutateAsync({ uid: student.uid, data: { displayName: displayName.trim() } });
      await refreshUser?.();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
  };

  return (
    <div className="px-4 pt-6 pb-4 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[#3d8c58] text-xs font-semibold uppercase tracking-widest">Configuración</p>
        <h1 className="text-white font-extrabold text-2xl mt-0.5">Mi perfil</h1>
      </motion.div>

      {/* avatar & info */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex items-center gap-4 rounded-2xl p-5"
        style={{ background: "rgba(0,255,135,0.05)", border: "1px solid rgba(0,255,135,0.12)" }}>
        <Avatar name={student?.displayName ?? "?"} size="xl" />
        <div>
          <p className="text-white font-extrabold text-lg">{student?.displayName}</p>
          <p className="text-[#3d8c58] text-sm">{student?.email}</p>
          <span className="inline-flex items-center mt-1.5 text-[10px] font-semibold text-[#60a5fa] px-2 py-0.5 rounded-full"
            style={{ background: "rgba(96,165,250,0.1)" }}>
            Estudiante
          </span>
        </div>
      </motion.div>

      <div className="h-px bg-accent-primary/[0.08]" />

      {/* edit name */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <p className="text-white font-bold text-sm mb-3">Editar perfil</p>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="mb-3 p-3 rounded-xl text-xs text-[#ff6b6b]"
              style={{ background: "rgba(255,59,59,0.1)", border: "1px solid rgba(255,59,59,0.3)" }}>
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="mb-3 p-3 rounded-xl text-xs text-accent-primary"
              style={{ background: "rgba(0,255,135,0.08)", border: "1px solid rgba(0,255,135,0.25)" }}>
              ¡Perfil actualizado!
            </motion.div>
          )}
        </AnimatePresence>

        <Input label="Nombre completo" type="text" value={displayName}
          onChange={e => { setDisplayName(e.target.value); setError(""); }} />

        <div className="mt-2">
          <Button variant="primary" size="md" fullWidth isLoading={saving} onClick={handleSave}>
            Guardar cambios
          </Button>
        </div>
      </motion.div>

      <div className="h-px bg-white/[0.05]" />

      {/* trainer info */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
        <p className="text-white font-bold text-sm mb-3">Entrenador asignado</p>
        <div className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {student?.trainerId ? (
            <p className="text-[#3d8c58] text-sm">ID: <span className="text-white font-mono text-xs">{student.trainerId}</span></p>
          ) : (
            <p className="text-[#3d8c58] text-sm">Sin entrenador asignado aún</p>
          )}
        </div>
      </motion.div>

      {/* sign out */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        <Button variant="danger" size="lg" fullWidth onClick={handleSignOut}>
          Cerrar sesión
        </Button>
      </motion.div>
    </div>
  );
}
