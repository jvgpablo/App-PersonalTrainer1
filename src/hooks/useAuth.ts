"use client";
import { useAuthContext } from "@/contexts/AuthContext";
import { isStudent, isTrainer, isAdmin } from "@/types/user.types";

export function useAuth() {
  const ctx = useAuthContext();
  return {
    ...ctx,
    get student() { return ctx.user && isStudent(ctx.user) ? ctx.user : null; },
    get trainer() { return ctx.user && isTrainer(ctx.user) ? ctx.user : null; },
    get admin()   { return ctx.user && isAdmin(ctx.user)   ? ctx.user : null; },
    isStudent: ctx.user ? isStudent(ctx.user) : false,
    isTrainer: ctx.user ? isTrainer(ctx.user) : false,
    isAdmin:   ctx.user ? isAdmin(ctx.user)   : false,
    role: ctx.user?.role ?? null,
  };
}
