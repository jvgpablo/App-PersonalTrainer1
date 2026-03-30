import type { Timestamp } from "firebase/firestore";

export interface ProgressEntry {
  id: string;
  studentId: string;
  date: Timestamp | null;
  weight?: number;
  completedRoutineId?: string;
  notes?: string;
  metrics: { goalsAchieved: number; attendanceStreak: number };
  createdAt: Timestamp;
}

export type ProgressInput = Omit<ProgressEntry, "id" | "createdAt">;

export interface ChartDataPoint { x: string; y: number }
export interface WeeklyProgressData {
  week: string;
  totalSessions: number;
  avgWeight?: number;
  totalGoals: number;
}
