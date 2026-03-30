"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { registerStudent } from "@/services/auth.service";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Step = "idle" | "loading" | "success";

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [confirm, setConfirm]         = useState("");
  const [showPw, setShowPw]           = useState(false);
  const [error, setError]             = useState("");
  const [step, setStep]               = useState<Step>("idle");

  const handleRegister = async () => {
    if (!displayName.trim()) { setError("Ingresa tu nombre completo."); return; }
    if (!email.trim())       { setError("Ingresa tu correo."); return; }
    if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres."); return; }
    if (password !== confirm){ setError("Las contraseñas no coinciden."); return; }
    setError("");
    setStep("loading");
    try {
      await registerStudent({ displayName, email, password });
      setStep("success");
      setTimeout(() => router.replace("/student"), 900);
    } catch (e: any) {
      setError(e.message);
      setStep("idle");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-brand-dark flex items-center justify-center px-5 py-10">
      {/* dot grid */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ backgroundImage: "radial-gradient(rgba(0,255,135,0.08) 1px, transparent 1px)", backgroundSize: "32px 32px", opacity: 0.4 }} />

      {/* orbs */}
      <motion.div className="absolute w-[280px] h-[280px] rounded-full pointer-events-none"
        style={{ background: "#00ff87", filter: "blur(70px)", top: -60, right: -60 }}
        animate={{ opacity: [0.08, 0.04, 0.08] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute w-[240px] h-[240px] rounded-full pointer-events-none"
        style={{ background: "#00b359", filter: "blur(70px)", bottom: -40, left: -40 }}
        animate={{ opacity: [0.07, 0.03, 0.07] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />

      {/* card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, type: "spring", damping: 20 }}
        className="relative w-full max-w-sm z-10"
        style={{
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          background: "rgba(8, 22, 12, 0.75)",
          border: "1px solid rgba(0, 255, 135, 0.12)",
          borderRadius: 20,
          padding: 36,
          boxShadow: "0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* logo */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center mb-7">
          <motion.div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
            style={{ border: "2px solid rgba(0,255,135,0.3)" }}
            animate={{ boxShadow: ["0 0 8px rgba(0,255,135,0.3)", "0 0 22px rgba(0,255,135,0.6)", "0 0 8px rgba(0,255,135,0.3)"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-accent-primary font-black text-2xl">ZX</span>
          </motion.div>
          <h1 className="text-white font-extrabold text-xl tracking-[0.2em]">ZENX</h1>
          <p className="text-[9px] text-[#3a7a52] tracking-[0.2em] uppercase text-center mt-0.5">
            Crea tu cuenta gratuita
          </p>
        </motion.div>

        <div className="h-px bg-accent-primary/[0.08] mb-6" />

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-white font-bold text-lg mb-1">Nuevo estudiante</h2>
          <p className="text-[#3d8c58] text-xs">Ingresa tus datos para comenzar</p>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-4 p-3 rounded-xl text-xs text-[#ff6b6b]"
              style={{ background: "rgba(255,59,59,0.1)", border: "1px solid rgba(255,59,59,0.3)" }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-5 space-y-0">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Input label="Nombre completo" type="text" value={displayName}
              onChange={e => { setDisplayName(e.target.value); setError(""); }}
              autoComplete="name" onKeyDown={e => e.key === "Enter" && handleRegister()} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Input label="Correo electrónico" type="email" value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              autoComplete="email" onKeyDown={e => e.key === "Enter" && handleRegister()} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Input label="Contraseña" type={showPw ? "text" : "password"} value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              autoComplete="new-password" onKeyDown={e => e.key === "Enter" && handleRegister()}
              rightElement={
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="text-[11px] text-[#3d8c58] font-semibold hover:text-accent-primary transition-colors">
                  {showPw ? "Ocultar" : "Ver"}
                </button>
              } />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Input label="Confirmar contraseña" type={showPw ? "text" : "password"} value={confirm}
              onChange={e => { setConfirm(e.target.value); setError(""); }}
              autoComplete="new-password" onKeyDown={e => e.key === "Enter" && handleRegister()} />
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-6">
          <Button variant="primary" size="lg" fullWidth isLoading={step === "loading"} onClick={handleRegister}
            className={step === "success" ? "!from-[#00ff87] !to-[#00ffaa]" : ""}>
            {step === "success" ? "¡Cuenta creada! ✓" : "Crear cuenta"}
          </Button>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="text-center mt-5 text-xs text-[#3d8c58]">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-accent-primary font-semibold hover:text-accent-secondary transition-colors">
            Inicia sesión
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
