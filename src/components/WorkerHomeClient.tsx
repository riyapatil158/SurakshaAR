"use client";
import Link from "next/link";
import { useSession, useLang } from "@/components/SessionProvider";
import { t } from "@/lib/i18n";
import { DEMO_MODULES } from "@/lib/demo-data";
import { Flame, Wind, Search, Target, Award, TrendingDown, BookOpen, Shield, ArrowRight, Zap } from "lucide-react";

export function WorkerHomeClient() {
  const { session } = useSession();
  const { lang } = useLang();
  const worker = session?.worker;
  if (!worker) return null;

  const comps = worker.competencies;
  const safetyIndex = worker.safetyScore;

  // Find weakest skill
  const weakEntries = Object.entries(comps) as [string, number][];
  weakEntries.sort((a, b) => a[1] - b[1]);
  const weakest = weakEntries[0];
  const weakestLabel: Record<string, string> = {
    hazardRecognition: "Hazard Recognition",
    procedureAccuracy: "Procedure Accuracy",
    decisionMaking: "Decision Making",
    equipmentSelection: "Equipment Selection",
    reactionTime: "Reaction Time",
  };

  // Progress per active module
  const moduleProgress = (id: string) => {
    const p = session.progress[id];
    if (p) return p.bestScore;
    if (worker.modulesCompleted.includes(id as "fire" | "gas")) {
      const cert = worker.certificates.find((c) => c.moduleId === id);
      return cert?.score ?? 0;
    }
    return 0;
  };

  // Recommended next module
  const recommendedModule = (() => {
    if (moduleProgress("fire") === 0) return DEMO_MODULES[0];
    if (moduleProgress("gas") === 0) return DEMO_MODULES[1];
    return DEMO_MODULES[0];
  })();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      {/* Greeting */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-surface-400">{t(lang, "worker.greeting")}</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">{worker.name.split(" ")[0]},</h1>
          <p className="text-surface-300 text-sm mt-1">{worker.industry} · {worker.experience}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/worker/hazard-hunt" className="btn btn-secondary text-xs">
            <Search className="h-4 w-4" /> Hazard Hunt
          </Link>
          <Link href={`/worker/module/${recommendedModule.id}`} className="btn btn-primary text-xs">
            <Zap className="h-4 w-4" /> {t(lang, "worker.continueTraining")}
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-surface-400">{t(lang, "worker.safetyScore")}</span>
            <Shield className="h-4 w-4 text-brand-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white">{safetyIndex}</span>
            <span className="text-sm text-surface-400">/100</span>
          </div>
          <div className="progress mt-2"><div style={{ width: `${safetyIndex}%` }} /></div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-surface-400">Modules</span>
            <BookOpen className="h-4 w-4 text-info-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white">{worker.modulesCompleted.length}</span>
            <span className="text-sm text-surface-400">/ {DEMO_MODULES.length}</span>
          </div>
          <div className="progress mt-2"><div style={{ width: `${(worker.modulesCompleted.length / DEMO_MODULES.length) * 100}%`, background: "linear-gradient(90deg, #22b8cf, #0891b2)" }} /></div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-surface-400">{t(lang, "worker.certificates")}</span>
            <Award className="h-4 w-4 text-safe-400" />
          </div>
          <div className="mt-2 text-3xl font-bold text-white">{worker.certificates.length}</div>
          <div className="text-xs text-surface-400 mt-1">{worker.certificates.filter(c => c.status === "valid").length} valid</div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-surface-400">Last Training</span>
            <TrendingDown className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-base font-bold text-white">{new Date(worker.lastTrainingAt).toLocaleDateString()}</div>
          <div className="text-xs text-surface-400 mt-1">Keep skills fresh</div>
        </div>
      </div>

      {/* Main grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recommended module */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-white text-lg">Recommended Training</h2>
            <div className="tag border-brand-500/40 bg-brand-500/10 text-brand-400">Next</div>
          </div>
          <div className="rounded-xl border border-surface-700 bg-surface-900/60 p-4">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-brand-500/15 border border-brand-500/30 flex items-center justify-center">
                {recommendedModule.id === "fire" ? <Flame className="h-5 w-5 text-brand-400" /> : <Wind className="h-5 w-5 text-info-500" />}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white">{t(lang, recommendedModule.titleKey)}</h3>
                <p className="text-sm text-surface-300 mt-1">{t(lang, recommendedModule.descKey)}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-surface-400">
                  <span>{recommendedModule.durationMinutes} min</span>
                  <span>·</span>
                  <span>{recommendedModule.difficulty}</span>
                  <span>·</span>
                  <span>Best {moduleProgress(recommendedModule.id)}%</span>
                </div>
                <Link href={`/worker/module/${recommendedModule.id}`} className="btn btn-primary text-xs mt-4">
                  Start Mission <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <h3 className="font-bold text-white mt-6 mb-3">All Modules</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DEMO_MODULES.map((m) => {
              const progress = moduleProgress(m.id);
              return (
                <Link
                  key={m.id}
                  href={m.status === "active" ? `/worker/module/${m.id}` : "#"}
                  className={`card ${m.status === "active" ? "card-hover" : "opacity-60 cursor-not-allowed"} p-4`}
                  onClick={(e) => m.status !== "active" && e.preventDefault()}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`tag ${m.status === "active" ? "border-safe-500/40 bg-safe-500/10 text-safe-400" : "border-surface-600 bg-surface-700/40 text-surface-300"}`}>
                      {m.status === "active" ? "Active" : "Coming Soon"}
                    </div>
                    <div className="text-xs text-surface-400">{m.durationMinutes} min</div>
                  </div>
                  <div className="font-semibold text-white">{t(lang, m.titleKey)}</div>
                  <div className="progress mt-2"><div style={{ width: `${progress}%` }} /></div>
                  <div className="mt-1 text-xs text-surface-400">Best: {progress}%</div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right column: competencies + weak skills + recent */}
        <div className="grid gap-4 content-start">
          <div className="card p-5">
            <h2 className="font-bold text-white text-lg mb-4">Safety Competencies</h2>
            <div className="space-y-3">
              {weakEntries.map(([k, v]) => (
                <div key={k}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-surface-200">{weakestLabel[k] ?? k}</span>
                    <span className={`font-semibold ${v >= 85 ? "text-safe-400" : v >= 70 ? "text-amber-400" : "text-danger-500"}`}>{v}%</span>
                  </div>
                  <div className="progress">
                    <div style={{
                      width: `${v}%`,
                      background: v >= 85 ? "linear-gradient(90deg, #1fbf75, #2ee38d)" : v >= 70 ? "linear-gradient(90deg, #ffb020, #ff9f0a)" : "linear-gradient(90deg, #ef4444, #dc2626)"
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {weakest && weakest[1] < 75 && (
            <div className="card p-4 border-amber-400/30 bg-amber-400/5">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Target className="h-4 w-4" /> Recommended Refresher
              </div>
              <div className="mt-2 text-white font-semibold">
                {weakestLabel[weakest[0]] ?? weakest[0]} Refresher
              </div>
              <p className="text-sm text-surface-300 mt-1">
                Your score in {weakestLabel[weakest[0]] ?? weakest[0]} is {weakest[1]}%. A focused refresher will help reinforce this skill.
              </p>
              <Link href="/worker/modules" className="btn btn-secondary text-xs mt-3">View Refreshers</Link>
            </div>
          )}

          <div className="card p-5">
            <h2 className="font-bold text-white text-lg mb-3">Recent Training</h2>
            <div className="space-y-2">
              {worker.certificates.slice(0, 3).map((c) => (
                <div key={c.code} className="flex items-center justify-between text-sm">
                  <div>
                    <div className="text-white font-medium">{c.moduleId === "fire" ? "Fire Safety" : "Gas Safety"}</div>
                    <div className="text-xs text-surface-400">{new Date(c.issueDate).toLocaleDateString()}</div>
                  </div>
                  <span className="text-brand-400 font-bold">{c.score}%</span>
                </div>
              ))}
              {worker.certificates.length === 0 && (
                <div className="text-sm text-surface-400">No training history yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
