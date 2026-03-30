import { collection, doc, getDocs, updateDoc, query, where, Timestamp, writeBatch, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Trainer, Student, AppUser } from "@/types/user.types";

export async function getAllTrainers(): Promise<Trainer[]> {
  const snap = await getDocs(query(collection(db, "users"), where("role", "==", "trainer")));
  return snap.docs.map(d => d.data() as Trainer);
}

export async function getUnassignedStudents(): Promise<Student[]> {
  const snap = await getDocs(query(collection(db, "users"), where("role", "==", "student"), where("trainerId", "==", null)));
  return snap.docs.map(d => d.data() as Student);
}

export async function getStudentsByTrainer(trainerId: string): Promise<Student[]> {
  const snap = await getDocs(query(collection(db, "users"), where("role", "==", "student"), where("trainerId", "==", trainerId)));
  return snap.docs.map(d => d.data() as Student);
}

export async function assignStudentToTrainer(studentId: string, trainerId: string): Promise<void> {
  const batch = writeBatch(db);
  const now = Timestamp.now();
  batch.update(doc(db, "users", studentId), { trainerId, updatedAt: now });
  batch.update(doc(db, "users", trainerId), { studentIds: arrayUnion(studentId), updatedAt: now });
  await batch.commit();
}

export async function updateUserProfile(uid: string, data: Partial<Omit<AppUser, "uid" | "role" | "email" | "createdAt">>): Promise<void> {
  await updateDoc(doc(db, "users", uid), { ...data, updatedAt: Timestamp.now() });
}
