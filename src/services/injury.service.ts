import { collection, doc, getDocs, getDoc, addDoc, updateDoc, query, where, Timestamp, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Injury, InjuryInput, InjuryUpdate, InjuryComment } from "@/types/injury.types";

export async function getInjuriesByTrainer(trainerId: string): Promise<Injury[]> {
  const snap = await getDocs(query(collection(db, "injuries"), where("trainerId", "==", trainerId)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Injury));
}

export async function getInjuriesByStudent(studentId: string, trainerId: string): Promise<Injury[]> {
  const snap = await getDocs(query(collection(db, "injuries"), where("studentId", "==", studentId), where("trainerId", "==", trainerId)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Injury));
}

export async function getMyInjuries(studentId: string): Promise<Injury[]> {
  const snap = await getDocs(query(collection(db, "injuries"), where("studentId", "==", studentId)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Injury));
}

export async function getInjuryById(id: string): Promise<Injury | null> {
  const snap = await getDoc(doc(db, "injuries", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } as Injury : null;
}

export async function reportInjury(input: InjuryInput): Promise<string> {
  const ref = await addDoc(collection(db, "injuries"), { ...input, status: "activa", comments: [], reportedAt: Timestamp.now(), updatedAt: Timestamp.now() });
  return ref.id;
}

export async function updateInjury(id: string, data: InjuryUpdate): Promise<void> {
  await updateDoc(doc(db, "injuries", id), { ...data, updatedAt: Timestamp.now() });
}

export async function addComment(injuryId: string, comment: Omit<InjuryComment, "id" | "createdAt">): Promise<void> {
  const newComment: InjuryComment = { id: `${Date.now()}_${Math.random().toString(36).slice(2,7)}`, ...comment, createdAt: Timestamp.now() };
  await updateDoc(doc(db, "injuries", injuryId), { comments: arrayUnion(newComment), updatedAt: Timestamp.now() });
}
