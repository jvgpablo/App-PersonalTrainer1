import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as fbSignOut, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { AppUser, Student, Trainer } from "@/types/user.types";
import { AUTH_ERROR_MESSAGES } from "@/types/auth.types";
import type { LoginCredentials, StudentRegisterInput, TrainerRegisterInput } from "@/types/auth.types";

export async function signIn({ email, password }: LoginCredentials) {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    return user;
  } catch (e: any) {
    throw new Error(AUTH_ERROR_MESSAGES[e.code] ?? "Error al iniciar sesión.");
  }
}

export async function signOut() { await fbSignOut(auth); }

export async function registerStudent(input: StudentRegisterInput): Promise<Student> {
  try {
    const { user: fb } = await createUserWithEmailAndPassword(auth, input.email.trim().toLowerCase(), input.password);
    const now = Timestamp.now();
    const data: Student = { uid: fb.uid, email: fb.email!, displayName: input.displayName.trim(), role: "student", trainerId: null, createdAt: now, updatedAt: now };
    await setDoc(doc(db, "users", fb.uid), data);
    return data;
  } catch (e: any) {
    throw new Error(AUTH_ERROR_MESSAGES[e.code] ?? "Error al registrarte.");
  }
}

export async function registerTrainer(input: TrainerRegisterInput): Promise<Trainer> {
  try {
    const { user: fb } = await createUserWithEmailAndPassword(auth, input.email.trim().toLowerCase(), input.password);
    const now = Timestamp.now();
    const data: Trainer = { uid: fb.uid, email: fb.email!, displayName: input.displayName.trim(), role: "trainer", studentIds: [], ...(input.profile ? { profile: input.profile } : {}), createdAt: now, updatedAt: now };
    await setDoc(doc(db, "users", fb.uid), data);
    return data;
  } catch (e: any) {
    throw new Error(AUTH_ERROR_MESSAGES[e.code] ?? "Error al registrar entrenador.");
  }
}

export async function getUserProfile(uid: string): Promise<AppUser | null> {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? (snap.data() as AppUser) : null;
  } catch { return null; }
}

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email.trim().toLowerCase());
  } catch (e: any) {
    throw new Error(AUTH_ERROR_MESSAGES[e.code] ?? "Error enviando el email.");
  }
}
