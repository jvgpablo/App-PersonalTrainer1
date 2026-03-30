"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllTrainers, getUnassignedStudents, getStudentsByTrainer,
  assignStudentToTrainer, updateUserProfile
} from "@/services/user.service";
import type { AppUser } from "@/types/user.types";

export const userKeys = {
  trainers: ["users", "trainers"] as const,
  unassigned: ["users", "unassigned"] as const,
  byTrainer: (tid: string) => ["users", "students", tid] as const,
};

export function useAllTrainers() {
  return useQuery({
    queryKey: userKeys.trainers,
    queryFn: getAllTrainers,
  });
}

export function useUnassignedStudents() {
  return useQuery({
    queryKey: userKeys.unassigned,
    queryFn: getUnassignedStudents,
  });
}

export function useStudentsByTrainer(trainerId: string) {
  return useQuery({
    queryKey: userKeys.byTrainer(trainerId),
    queryFn: () => getStudentsByTrainer(trainerId),
    enabled: !!trainerId,
  });
}

export function useAssignStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ studentId, trainerId }: { studentId: string; trainerId: string }) =>
      assignStudentToTrainer(studentId, trainerId),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: userKeys.unassigned });
      qc.invalidateQueries({ queryKey: userKeys.byTrainer(vars.trainerId) });
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ uid, data }: { uid: string; data: Partial<Omit<AppUser, "uid" | "role" | "email" | "createdAt">> }) =>
      updateUserProfile(uid, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}
