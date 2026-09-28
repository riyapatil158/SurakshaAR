"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DEMO_WORKERS } from "@/lib/demo-data";
import { useSession, useLang } from "@/components/SessionProvider";
import { t } from "@/lib/i18n";
import { User, Shield, ChevronRight, Search, LogIn } from "lucide-react";

export function LoginClient() {
  const { selectWorker } = useSession();
  const { lang } = useLang();
  const router = useRouter();
  const [mode, setMode] = useState<"worker" | "admin">("worker");
  const [query, setQuery] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const filtered = DEMO_WORKERS.filter((w) =>
    (w.name.toLowerCase() + " " + w.id.toLowerCase() + " " + w.industry.toLowerCase()).includes(
      query.toLowerCase()
    )
  );

  const pickWorker = (id: string) => {
    const w = DEMO_WORKERS.find((x) => x.id === id);
    if (!w) return;
    selectWorker(w);
    router.push("/worker");
  };

  const adminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      router.push("/admin");
    } else {
      setError("Invalid credentials. Try admin / admin123");
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode("worker")}
          className={`btn ${mode === "worker" ? "btn-primary" : "btn-secondary"}`}
        >
          <User className="h-4 w-4" /> {t(lang, "login.demo")}
        </button>
        <button
          onClick={() => setMode("admin")}
          className={`btn ${mode === "admin" ? "btn-primary" : "btn-secondary"}`}
        >
          <Shield className="h-4 w-4" /> {t(lang, "login.admin")}
        </button>
      </div>

      {mode === "worker" ? (
        <div className="card p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h1 className="text-2xl font-bold text-white">{t(lang, "login.title")}</h1>
              <p className="text-surface-300 text-sm mt-1">{t(lang, "login.subtitle")}</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search workers…"
                className="pl-9 pr-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-sm text-white focus:border-brand-500 focus:outline-none w-full sm:w-64"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
            {filtered.map((w) => (
              <button
                key={w.id}
                onClick={() => pickWorker(w.id)}
                className="card card-hover p-4 text-left flex items-center gap-3"
              >
                <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold ${
                  w.gender === "Female" ? "bg-pink-500/20 text-pink-300 border border-pink-500/30" : "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                }`}>
                  {w.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white truncate">{w.name}</div>
                  <div className="text-xs text-surface-400">{w.id} · {w.industry}</div>
                  <div className="mt-1 flex items-center gap-2 text-xs">
                    <span className={`tag ${w.safetyScore >= 85 ? "bg-safe-500/15 text-safe-400 border-safe-500/30" : w.safetyScore >= 70 ? "bg-amber-400/15 text-amber-400 border-amber-400/30" : "bg-danger-500/15 text-danger-500 border-danger-500/30"}`}>
                      Score {w.safetyScore}
                    </span>
                    <span className="text-surface-400">{w.modulesCompleted.length} modules</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-surface-400" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="card p-6 sm:p-8 max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-11 w-11 rounded-lg bg-info-500/15 border border-info-500/30 flex items-center justify-center">
              <Shield className="h-5 w-5 text-info-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{t(lang, "login.admin")}</h1>
              <div className="text-xs text-surface-400">{t(lang, "login.demoCreds")}</div>
            </div>
          </div>
          <form onSubmit={adminLogin} className="grid gap-3">
            <div>
              <label className="text-xs uppercase tracking-wider text-surface-400">{t(lang, "login.username")}</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full px-3 py-2.5 rounded-lg bg-surface-800 border border-surface-700 text-white focus:border-info-500 focus:outline-none"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-surface-400">{t(lang, "login.password")}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-3 py-2.5 rounded-lg bg-surface-800 border border-surface-700 text-white focus:border-info-500 focus:outline-none"
                placeholder="admin123"
              />
            </div>
            {error && <div className="text-danger-500 text-sm">{error}</div>}
            <button type="submit" className="btn btn-primary mt-2">
              <LogIn className="h-4 w-4" /> {t(lang, "login.signIn")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
