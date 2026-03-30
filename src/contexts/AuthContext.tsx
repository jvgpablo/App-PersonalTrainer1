"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile, signOut as authSignOut } from "@/services/auth.service";
import type { AuthState, AuthAction } from "@/types/auth.types";
import type { AppUser } from "@/types/user.types";

const initialState: AuthState = { firebaseUser: null, user: null, isLoading: true, isAuthenticated: false, error: null };

function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":  return { ...state, isLoading: action.payload };
    case "SET_USER":     return { ...state, firebaseUser: action.payload.firebaseUser, user: action.payload.user, isLoading: false, isAuthenticated: true, error: null };
    case "CLEAR_USER":   return { ...initialState, isLoading: false };
    case "SET_ERROR":    return { ...state, error: action.payload, isLoading: false };
    default:             return state;
  }
}

interface AuthContextValue extends AuthState {
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fb) => {
      if (!fb) { dispatch({ type: "CLEAR_USER" }); return; }
      dispatch({ type: "SET_LOADING", payload: true });
      const profile = await getUserProfile(fb.uid);
      if (!profile) { await authSignOut(); dispatch({ type: "CLEAR_USER" }); return; }
      dispatch({ type: "SET_USER", payload: { firebaseUser: fb, user: profile } });
    });
    return unsub;
  }, []);

  const signOut = useCallback(async () => { await authSignOut(); dispatch({ type: "CLEAR_USER" }); }, []);
  const refreshUser = useCallback(async () => {
    if (!state.firebaseUser) return;
    const profile = await getUserProfile(state.firebaseUser.uid);
    if (profile && state.firebaseUser) dispatch({ type: "SET_USER", payload: { firebaseUser: state.firebaseUser, user: profile } });
  }, [state.firebaseUser]);

  return <AuthContext.Provider value={{ ...state, signOut, refreshUser }}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be inside AuthProvider");
  return ctx;
}
