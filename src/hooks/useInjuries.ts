"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInjuriesByTrainer, getInjuriesByStudent, getMyInjuries,
  getInjuryById, reportInjury, updateInjury, addComment
} from "@/services/injury.service";
import type { InjuryInput, InjuryUpdate, InjuryComment } from "@/types/injury.types";

export const injuryKeys = {
  all: ["injuries"] as const,
  byTrainer: (tid: string) => ["injuries", "trainer", tid] as const,
  byStudent: (sid: string, tid: string) => ["injuries", "student", sid, tid] as const,
  mine: (sid: string) => ["injuries", "mine", sid] as const,
  detail: (id: string) => ["injuries", id] as const,
};

export function useTrainerInjuries(trainerId: string) {
  return useQuery({
    queryKey: injuryKeys.byTrainer(trainerId),
    queryFn: () => getInjuriesByTrainer(trainerId),
    enabled: !!trainerId,
  });
}

export function useStudentInjuries(studentId: string, trainerId: string) {
  return useQuery({
    queryKey: injuryKeys.byStudent(studentId, trainerId),
    queryFn: () => getInjuriesByStudent(studentId, trainerId),
    enabled: !!studentId && !!trainerId,
  });
}

export function useMyInjuries(studentId: string) {
  return useQuery({
    queryKey: injuryKeys.mine(studentId),
    queryFn: () => getMyInjuries(studentId),
    enabled: !!studentId,
  });
}

export function useInjuryDetail(id: string) {
  return useQuery({
    queryKey: injuryKeys.detail(id),
    queryFn: () => getInjuryById(id),
    enabled: !!id,
  });
}

export function useReportInjury() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: InjuryInput) => reportInjury(data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: injuryKeys.mine(vars.studentId) });
      qc.invalidateQueries({ queryKey: injuryKeys.byTrainer(vars.trainerId) });
    },
  });
}

export function useUpdateInjury(trainerId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: InjuryUpdate }) => updateInjury(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: injuryKeys.detail(vars.id) });
      qc.invalidateQueries({ queryKey: injuryKeys.byTrainer(trainerId) });
    },
  });
}

export function useAddComment(injuryId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (comment: Omit<InjuryComment, "id" | "createdAt">) => addComment(injuryId, comment),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: injuryKeys.detail(injuryId) });
    },
  });
}
