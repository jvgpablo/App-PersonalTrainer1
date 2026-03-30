import type { Timestamp } from "firebase/firestore";

export type InjurySeverity = "leve" | "moderada" | "grave";
export type InjuryStatus   = "activa" | "en_recuperacion" | "resuelta";
export type BodyPart = "rodilla"|"tobillo"|"hombro"|"codo"|"muñeca"|"espalda_baja"|"espalda_alta"|"cuello"|"cadera"|"muslo"|"gemelo"|"otro";

export interface InjuryComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: "student" | "trainer";
  text: string;
  createdAt: Timestamp;
}

export interface Injury {
  id: string;
  studentId: string;
  trainerId: string;
  bodyPart: BodyPart;
  description: string;
  severity: InjurySeverity;
  status: InjuryStatus;
  reportedAt: Timestamp;
  updatedAt: Timestamp;
  blockedExercises: string[];
  comments: InjuryComment[];
  trainerNotes?: string;
}

export type InjuryInput  = Omit<Injury, "id"|"reportedAt"|"updatedAt"|"comments"|"status">;
export type InjuryUpdate = Partial<Omit<Injury, "id"|"studentId"|"trainerId"|"reportedAt">>;
