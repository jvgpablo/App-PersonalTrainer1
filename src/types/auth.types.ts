import type { User as FirebaseUser } from "firebase/auth";
import type { AppUser } from "./user.types";

export interface AuthState {
  firebaseUser: FirebaseUser | null;
  user: AppUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: { firebaseUser: FirebaseUser; user: AppUser } }
  | { type: "CLEAR_USER" }
  | { type: "SET_ERROR"; payload: string | null };

export interface LoginCredentials { email: string; password: string }
export interface StudentRegisterInput { displayName: string; email: string; password: string }
export interface TrainerRegisterInput { displayName: string; email: string; password: string; profile?: { age?: number; experience?: string; phone?: string } }

export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/user-not-found":        "No existe una cuenta con ese correo.",
  "auth/wrong-password":        "Contraseña incorrecta.",
  "auth/invalid-credential":    "Credenciales inválidas.",
  "auth/email-already-in-use":  "Ese correo ya está registrado.",
  "auth/weak-password":         "La contraseña debe tener al menos 6 caracteres.",
  "auth/invalid-email":         "Formato de correo inválido.",
  "auth/too-many-requests":     "Demasiados intentos. Intenta más tarde.",
  "auth/network-request-failed":"Error de conexión.",
};
