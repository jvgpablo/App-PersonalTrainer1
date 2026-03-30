import type { Timestamp } from "firebase/firestore";

export type BodyArea = "piernas"|"pecho"|"espalda"|"hombros"|"brazos"|"abdomen"|"cardio"|"fullbody";

export interface Exercise {
  id: string;
  name: string;
  bodyArea: BodyArea;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
  isBlockedByInjury?: boolean;
  blockedByInjuryId?: string;
}

export type ExerciseInput = Omit<Exercise, "id" | "isBlockedByInjury" | "blockedByInjuryId">;

export interface Routine {
  id: string;
  trainerId: string;
  studentId: string;
  title: string;
  description?: string;
  exercises: Exercise[];
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type RoutineInput  = Omit<Routine, "id" | "createdAt" | "updatedAt">;
export type RoutineUpdate = Partial<Omit<Routine, "id" | "trainerId" | "studentId" | "createdAt">>;
