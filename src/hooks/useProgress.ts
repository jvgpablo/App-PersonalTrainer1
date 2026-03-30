"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProgressByStudent, getRecentProgress, recordProgress,
  toWeightChartData, toWeeklyData
} from "@/services/progress.service";
import type { ProgressInput } from "@/types/progress.types";

export const progressKeys = {
  all: ["progress"] as const,
  byStudent: (sid: string) => ["progress", sid] as const,
  recent: (sid: string) => ["progress", "recent", sid] as const,
};

export function useStudentProgress(studentId: string) {
  return useQuery({
    queryKey: progressKeys.byStudent(studentId),
    queryFn: () => getProgressByStudent(studentId),
    enabled: !!studentId,
    select: (entries) => ({
      entries,
      chartData: toWeightChartData(entries),
      weeklyData: toWeeklyData(entries),
    }),
  });
}

export function useRecentProgress(studentId: string, limit = 10) {
  return useQuery({
    queryKey: progressKeys.recent(studentId),
    queryFn: () => getRecentProgress(studentId, limit),
    enabled: !!studentId,
  });
}

export function useRecordProgress(studentId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ProgressInput) => recordProgress(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: progressKeys.byStudent(studentId) });
      qc.invalidateQueries({ queryKey: progressKeys.recent(studentId) });
    },
  });
}
