"use client";
import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { loadSession, saveSession, clearSession, WorkerSession, generateVerificationCode } from "@/lib/storage";
import { DEMO_WORKERS, WorkerRecord } from "@/lib/demo-data";
import { CompetencyScores } from "@/lib/assessment";
import { Lang } from "@/lib/i18n";

type SessionContextType = {
  session: WorkerSession | null;
  setLang: (l: Lang) => void;
  selectWorker: (w: WorkerRecord) => void;
  updateProgress: (moduleId: string, score: number, comps: CompetencyScores) => void;
  addCertificate: (moduleId: string, score: number, comps: CompetencyScores) => string;
  logout: () => void;
  setOnline: (v: boolean) => void;
};

const Ctx = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<WorkerSession | null>(null);

  useEffect(() => {
    const s = loadSession();
    setSession(s);
  }, []);

  const persist = (s: WorkerSession) => {
    setSession(s);
    saveSession(s);
  };

  const setLang = (lang: Lang) => {
    const base =
      session ??
      ({
        worker: DEMO_WORKERS[0],
        lang,
        progress: {},
        certificates: [],
        lastSync: null,
        online: true,
        pendingSyncCount: 0,
      } as WorkerSession);
    persist({ ...base, lang });
  };

  const selectWorker = (w: WorkerRecord) => {
    const lang = (session?.lang ?? w.language ?? "en") as Lang;
    persist({
      worker: w,
      lang,
      progress: {},
      certificates: w.certificates.map((c) => ({
        code: c.code,
        moduleId: c.moduleId,
        score: c.score,
        issueDate: c.issueDate,
        status: c.status,
      })),
      lastSync: new Date().toISOString(),
      online: navigator.onLine,
      pendingSyncCount: 0,
    });
  };

  const updateProgress = (moduleId: string, score: number, comps: CompetencyScores) => {
    if (!session) return;
    const prev = session.progress[moduleId];
    const best = Math.max(prev?.bestScore ?? 0, score);
    const next: WorkerSession = {
      ...session,
      progress: {
        ...session.progress,
        [moduleId]: {
          bestScore: best,
          attempts: (prev?.attempts ?? 0) + 1,
          competencies: comps,
          lastAttemptAt: new Date().toISOString(),
        },
      },
      pendingSyncCount: session.pendingSyncCount + 1,
    };
    persist(next);
  };

  const addCertificate = (moduleId: string, score: number, comps: CompetencyScores): string => {
    if (!session) return "";
    const code = generateVerificationCode();
    const issueDate = new Date().toISOString(); // exact moment of issue = today
    const newCert = {
      code,
      moduleId: moduleId as WorkerRecord["certificates"][number]["moduleId"],
      score,
      issueDate,
      status: "valid" as const,
    };
    const completed = session.worker.modulesCompleted.includes(moduleId as never)
      ? session.worker.modulesCompleted
      : [...session.worker.modulesCompleted, moduleId as WorkerRecord["modulesCompleted"][number]];
    const next: WorkerSession = {
      ...session,
      worker: {
        ...session.worker,
        certificates: [newCert, ...session.worker.certificates],
        modulesCompleted: completed,
        lastTrainingAt: issueDate,
      },
      certificates: [newCert, ...session.certificates],
      pendingSyncCount: session.pendingSyncCount + 1,
    };
    persist(next);

    // Register the certificate on the server so the public QR verification page can find it
    fetch("/api/certificates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        moduleId,
        score,
        issueDate,
        competencies: comps,
        worker: {
          id: session.worker.id,
          name: session.worker.name,
          industry: session.worker.industry,
          experience: session.worker.experience,
          language: session.lang,
          gender: session.worker.gender,
          ageGroup: session.worker.ageGroup,
          safetyScore: session.worker.safetyScore,
        },
      }),
    }).catch(() => {
      // stays stored locally if the network request fails
    });

    return code;
  };

  const logout = () => {
    clearSession();
    setSession(null);
  };

  const setOnline = (v: boolean) => {
    if (!session) return;
    persist({ ...session, online: v, pendingSyncCount: v ? 0 : session.pendingSyncCount });
  };

  return (
    <Ctx.Provider
      value={{ session, setLang, selectWorker, updateProgress, addCertificate, logout, setOnline }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useSession() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSession must be used within SessionProvider");
  return c;
}

export function useLang() {
  const { session, setLang } = useSession();
  const lang = (session?.lang ?? "en") as Lang;
  return { lang, setLang };
}
