"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Link from "next/link";
import { signIn } from "@/services/auth.service";
import { useAuthContext } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type BtnState = "idle" | "loading" | "success";

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthContext();

  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [error, setError]         = useState("");
  const [btnState, setBtnState]   = useState<BtnState>("idle");

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "admin")   router.replace("/admin");
      else if (user.role === "trainer") router.replace("/trainer");
      else router.replace("/student");
    }
  }, [isLoading, user]);

  const handleLogin = async () => {
    if (!email.trim() || !password) { setError("Ingresa tu correo y contraseña."); return; }
    setError("");
    setBtnState("loading");

    try {
      await signIn({ email, password });
      setBtnState("success");

      // Confetti 🎉
      confetti({
        particleCount: 100,
        spread: 70,
        colors: ["#00FF87", "#00CC6A", "#ffffff", "#00ffaa", "#b3ffe0"],
        origin: { y: 0.5 },
      });

      // Redirect after confetti (AuthContext listener handles the actual redirect)
      // Adding a short delay so confetti is visible
      setTimeout(() => {
        // router.replace will be triggered by the useEffect above when user loads
      }, 800);
    } catch (e: any) {
      setError(e.message);
      setBtnState("idle");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-brand-dark flex items-center justify-center px-5">

      {/* ── Grid de puntos sutil ──────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none"
           style={{
             backgroundImage: "radial-gradient(rgba(0,255,135,0.08) 1px, transparent 1px)",
             backgroundSize: "32px 32px",
             opacity: 0.4,
           }} />

      {/* ── Orb 3 (centro, estático) ─────────────────────────────────── */}
      <div className="absolute w-[360px] h-[360px] rounded-full pointer-events-none"
           style={{ background: "#0d9488", opacity: 0.05, filter: "blur(80px)", top: "25%", left: "50%", transform: "translate(-50%,-50%)" }} />

      {/* ── Orb 1 (top-right, animado) ───────────────────────────────── */}
      <motion.div
        className="absolute w-[280px] h-[280px] rounded-full pointer-events-none"
        style={{ background: "#00ff87", filter: "blur(70px)", top: -60, right: -60 }}
        animate={{ opacity: [0.08, 0.04, 0.08] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Orb 2 (bottom-left, animado) ─────────────────────────────── */}
      <motion.div
        className="absolute w-[240px] h-[240px] rounded-full pointer-events-none"
        style={{ background: "#00b359", filter: "blur(70px)", bottom: -40, left: -40 }}
        animate={{ opacity: [0.07, 0.03, 0.07] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* ── Card glassmorphism ────────────────────────────────────────── */}
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
        {/* ── Logo ────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center mb-7"
        >
          {/* Ring animado */}
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
            Progreso seguro, resultados garantizados
          </p>

          {/* Badge "Sistema activo" */}
          <div className="flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full"
               style={{ background: "rgba(0,255,135,0.08)", border: "1px solid rgba(0,255,135,0.15)" }}>
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-accent-primary"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="text-[10px] text-accent-primary font-semibold">Sistema activo</span>
          </div>
        </motion.div>

        {/* ── Divider ─────────────────────────────────────────────────── */}
        <div className="h-px bg-accent-primary/[0.08] mb-6" />

        {/* ── Título form ─────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-white font-bold text-lg mb-1">Acceso al sistema</h2>
          <p className="text-[#3d8c58] text-xs">Ingresa tus credenciales para continuar</p>
        </motion.div>

        {/* ── Error ───────────────────────────────────────────────────── */}
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

        {/* ── Inputs ──────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-5">
          <Input
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(""); }}
            autoComplete="email"
            onKeyDown={e => e.key === "Enter" && handleLogin()}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}>
          <Input
            label="Contraseña"
            type={showPw ? "text" : "password"}
            value={password}
            onChange={e => { setPassword(e.target.value); setError(""); }}
            autoComplete="current-password"
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            rightElement={
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="text-[11px] text-[#3d8c58] font-semibold hover:text-accent-primary transition-colors">
                {showPw ? "Ocultar" : "Ver"}
              </button>
            }
          />
        </motion.div>

        {/* ── Olvidé contraseña ────────────────────────────────────────── */}
        <div className="flex justify-end -mt-2 mb-5">
          <button className="text-[11px] text-[#3d8c58] font-semibold hover:text-accent-primary transition-colors">
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {/* ── Botón ───────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            isLoading={btnState === "loading"}
            onClick={handleLogin}
            className={btnState === "success" ? "!from-[#00ff87] !to-[#00ffaa]" : ""}
          >
            {btnState === "success" ? "¡Acceso concedido! ✓" : "Iniciar sesión"}
          </Button>
        </motion.div>

        {/* ── Link registro ────────────────────────────────────────────── */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="text-center mt-5 text-xs text-[#3d8c58]">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-accent-primary font-semibold hover:text-accent-secondary transition-colors">
            Regístrate
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
