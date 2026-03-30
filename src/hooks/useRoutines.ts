"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRoutinesByTrainer, getRoutinesByStudent, getActiveRoutineForStudent,
  getRoutineById, createRoutine, updateRoutine, activateRoutine, deleteRoutine
} from "@/services/routine.service";
import type { RoutineInput, RoutineUpdate } from "@/types/routine.types";

export const routineKeys = {
  all: ["routines"] as const,
  byTrainer: (tid: string) => ["routines", "trainer", tid] as const,
  byStudent: (sid: string, tid: string) => ["routines", "student", sid, tid] as const,
  active: (sid: string) => ["routines", "active", sid] as const,
  detail: (id: string) => ["routines", id] as const,
};

export function useTrainerRoutines(trainerId: string) {
  return useQuery({
    queryKey: routineKeys.byTrainer(trainerId),
    queryFn: () => getRoutinesByTrainer(trainerId),
    enabled: !!trainerId,
  });
}

export function useStudentRoutines(studentId: string, trainerId: string) {
  return useQuery({
    queryKey: routineKeys.byStudent(studentId, trainerId),
    queryFn: () => getRoutinesByStudent(studentId, trainerId),
    enabled: !!studentId && !!trainerId,
  });
}

export function useActiveRoutine(studentId: string) {
  return useQuery({
    queryKey: routineKeys.active(studentId),
    queryFn: () => getActiveRoutineForStudent(studentId),
    enabled: !!studentId,
  });
}

export function useRoutineDetail(id: string) {
  return useQuery({
    queryKey: routineKeys.detail(id),
    queryFn: () => getRoutineById(id),
    enabled: !!id,
  });
}

export function useCreateRoutine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: RoutineInput) => createRoutine(data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: routineKeys.byTrainer(vars.trainerId) });
      qc.invalidateQueries({ queryKey: routineKeys.byStudent(vars.studentId, vars.trainerId) });
    },
  });
}

export function useUpdateRoutine(trainerId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RoutineUpdate }) => updateRoutine(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: routineKeys.detail(vars.id) });
      qc.invalidateQueries({ queryKey: routineKeys.byTrainer(trainerId) });
    },
  });
}

export function useActivateRoutine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ routineId, studentId, trainerId }: { routineId: string; studentId: string; trainerId: string }) =>
      activateRoutine(routineId, studentId, trainerId),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: routineKeys.byStudent(vars.studentId, vars.trainerId) });
      qc.invalidateQueries({ queryKey: routineKeys.active(vars.studentId) });
    },
  });
}

export function useDeleteRoutine(trainerId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRoutine(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: routineKeys.byTrainer(trainerId) });
    },
  });
}
