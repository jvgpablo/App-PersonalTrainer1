import type { Timestamp } from "firebase/firestore";

export type UserRole = "admin" | "trainer" | "student";

export interface BaseUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Student extends BaseUser {
  role: "student";
  trainerId: string | null;
  activeRoutineId?: string;
}

export interface Trainer extends BaseUser {
  role: "trainer";
  studentIds: string[];
  profile?: { age?: number; experience?: string; phone?: string };
}

export interface Admin extends BaseUser {
  role: "admin";
}

export type AppUser = Student | Trainer | Admin;

export const isStudent = (u: AppUser): u is Student => u.role === "student";
export const isTrainer = (u: AppUser): u is Trainer => u.role === "trainer";
export const isAdmin   = (u: AppUser): u is Admin   => u.role === "admin";
