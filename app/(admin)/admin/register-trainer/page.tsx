"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { registerTrainer } from "@/services/auth.service";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Step = "idle" | "loading" | "success";

export default function RegisterTrainerPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [showPw, setShowPw]           = useState(false);
  const [experience, setExperience]   = useState("");
  const [phone, setPhone]             = useState("");
  const [error, setError]             = useState("");
  const [step, setStep]               = useState<Step>("idle");

  const handleSubmit = async () => {
    if (!displayName.trim()) { setError("Ingresa el nombre del entrenador."); return; }
    if (!email.trim())       { setError("Ingresa el correo."); return; }
    if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres."); return; }
    setError("");
    setStep("loading");
    try {
      await registerTrainer({
        displayName,
        email,
        password,
        profile: { experience: experience || undefined, phone: phone || undefined },
      });
      setStep("success");
      setTimeout(() => router.replace("/admin"), 1000);
    } catch (e: any) {
      setError(e.message);
      setStep("idle");
    }
  };

  return (
    <div className="px-4 pt-6 pb-4">
      {/* back */}
      <motion.button onClick={() => router.back()} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-1.5 text-[#3d8c58] text-sm font-semibold mb-6 hover:text-accent-primary transition-colors">
        ← Volver
      </motion.button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[#3d8c58] text-xs font-semibold uppercase tracking-widest">Admin</p>
        <h1 className="text-white font-extrabold text-2xl mt-0.5">Nuevo entrenador</h1>
        <p className="text-[#3d8c58] text-sm mt-1">Crea la cuenta de un trainer</p>
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
      </AnimatePresence>

      <div className="space-y-0">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Input label="Nombre completo" type="text" value={displayName}
            onChange={e => { setDisplayName(e.target.value); setError(""); }} autoComplete="name" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Input label="Correo electrónico" type="email" value={email}
            onChange={e => { setEmail(e.target.value); setError(""); }} autoComplete="email" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Input label="Contraseña" type={showPw ? "text" : "password"} value={password}
            onChange={e => { setPassword(e.target.value); setError(""); }} autoComplete="new-password"
            rightElement={
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="text-[11px] text-[#3d8c58] font-semibold hover:text-accent-primary transition-colors">
                {showPw ? "Ocultar" : "Ver"}
              </button>
            } />
        </motion.div>

        <div className="h-px bg-white/[0.05] my-4" />
        <p className="text-[#3d8c58] text-xs font-semibold uppercase tracking-widest mb-3">Perfil (opcional)</p>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Input label="Años de experiencia" type="text" value={experience}
            onChange={e => { setExperience(e.target.value); }} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Input label="Teléfono de contacto" type="tel" value={phone}
            onChange={e => { setPhone(e.target.value); }} />
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6">
        <Button variant="primary" size="lg" fullWidth isLoading={step === "loading"} onClick={handleSubmit}
          className={step === "success" ? "!from-[#00ff87] !to-[#00ffaa]" : ""}>
          {step === "success" ? "¡Entrenador registrado! ✓" : "Crear entrenador"}
        </Button>
      </motion.div>
    </div>
  );
}
