import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Routine, RoutineInput, RoutineUpdate } from "@/types/routine.types";

export async function getRoutinesByStudent(studentId: string, trainerId: string): Promise<Routine[]> {
  const snap = await getDocs(query(collection(db, "routines"), where("studentId", "==", studentId), where("trainerId", "==", trainerId)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Routine));
}

export async function getRoutinesByTrainer(trainerId: string): Promise<Routine[]> {
  const snap = await getDocs(query(collection(db, "routines"), where("trainerId", "==", trainerId)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Routine));
}

export async function getRoutineById(id: string): Promise<Routine | null> {
  const snap = await getDoc(doc(db, "routines", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } as Routine : null;
}

export async function getActiveRoutineForStudent(studentId: string): Promise<Routine | null> {
  const snap = await getDocs(query(collection(db, "routines"), where("studentId", "==", studentId), where("isActive", "==", true)));
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Routine;
}

export async function createRoutine(data: RoutineInput): Promise<string> {
  const ref = await addDoc(collection(db, "routines"), { ...data, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
  return ref.id;
}

export async function updateRoutine(id: string, data: RoutineUpdate): Promise<void> {
  await updateDoc(doc(db, "routines", id), { ...data, updatedAt: Timestamp.now() });
}

export async function activateRoutine(routineId: string, studentId: string, trainerId: string): Promise<void> {
  const existing = await getRoutinesByStudent(studentId, trainerId);
  await Promise.all(existing.filter(r => r.id !== routineId && r.isActive).map(r => updateDoc(doc(db, "routines", r.id), { isActive: false, updatedAt: Timestamp.now() })));
  await updateDoc(doc(db, "routines", routineId), { isActive: true, updatedAt: Timestamp.now() });
}

export async function deleteRoutine(id: string): Promise<void> {
  await deleteDoc(doc(db, "routines", id));
}
