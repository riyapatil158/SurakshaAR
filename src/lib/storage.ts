// Client-side offline-first storage for worker state.
// Uses localStorage with a namespaced key. Provides sync simulation.

import type { WorkerRecord } from "./demo-data";
import type { CompetencyScores } from "./assessment";

const LS_KEY = "surakshaar.state.v1";

export type WorkerSession = {
  worker: WorkerRecord;
  lang: "en" | "hi" | "san";
  progress: Record<string, { bestScore: number; attempts: number; competencies: CompetencyScores; lastAttemptAt: string }>;
  certificates: { code: string; moduleId: string; score: number; issueDate: string; status: "valid" | "expiring" | "expired" }[];
  lastSync: string | null;
  online: boolean;
  pendingSyncCount: number;
};

export function loadSession(): WorkerSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as WorkerSession;
  } catch {
    return null;
  }
}

export function saveSession(s: WorkerSession): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(s));
  } catch {
    // ignore quota errors
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LS_KEY);
}

export function generateVerificationCode(): string {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const digits = "0123456789";
  const prefix = "SA";
  let code = "";
  for (let i = 0; i < 4; i++)
    code += digits[Math.floor(Math.random() * digits.length)];
  for (let i = 0; i < 2; i++)
    code += letters[Math.floor(Math.random() * letters.length)];
  code += digits[Math.floor(Math.random() * digits.length)];
  return `${prefix}-${code}`;
}
