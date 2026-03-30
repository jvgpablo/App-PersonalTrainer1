import { collection, getDocs, addDoc, query, where, orderBy, limit, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ProgressEntry, ProgressInput, ChartDataPoint, WeeklyProgressData } from "@/types/progress.types";

export async function getProgressByStudent(studentId: string): Promise<ProgressEntry[]> {
  const snap = await getDocs(query(collection(db, "progress"), where("studentId", "==", studentId), orderBy("createdAt", "desc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ProgressEntry));
}

export async function getRecentProgress(studentId: string, limitCount = 10): Promise<ProgressEntry[]> {
  const snap = await getDocs(query(collection(db, "progress"), where("studentId", "==", studentId), orderBy("createdAt", "desc"), limit(limitCount)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ProgressEntry));
}

export async function recordProgress(input: ProgressInput): Promise<string> {
  const ref = await addDoc(collection(db, "progress"), { ...input, createdAt: Timestamp.now() });
  return ref.id;
}

export function toWeightChartData(entries: ProgressEntry[]): ChartDataPoint[] {
  return entries
    .filter((e): e is ProgressEntry & { date: Timestamp; weight: number } => e.date !== null && typeof e.weight === "number")
    .map(e => ({ x: `${e.date.toDate().getDate()}/${e.date.toDate().getMonth() + 1}`, y: e.weight }))
    .reverse();
}

export function toWeeklyData(entries: ProgressEntry[]): WeeklyProgressData[] {
  const map = new Map<string, { sessions: number; goals: number; weights: number[] }>();
  for (const e of entries) {
    if (!e.date) continue;
    const d = e.date.toDate();
    const start = new Date(d.getFullYear(), 0, 1);
    const week = `W${String(Math.ceil(((d.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7)).padStart(2, "0")}`;
    const cur = map.get(week) ?? { sessions: 0, goals: 0, weights: [] };
    cur.sessions++;
    cur.goals += e.metrics.goalsAchieved;
    if (typeof e.weight === "number") cur.weights.push(e.weight);
    map.set(week, cur);
  }
  return Array.from(map.entries()).map(([week, d]) => ({
    week,
    totalSessions: d.sessions,
    totalGoals: d.goals,
    avgWeight: d.weights.length > 0 ? d.weights.reduce((a, b) => a + b, 0) / d.weights.length : undefined,
  }));
}
