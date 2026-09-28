"use client";
import Link from "next/link";
import { useSession, useLang } from "@/components/SessionProvider";
import { t } from "@/lib/i18n";
import { Shield, Award, Calendar, Target } from "lucide-react";

export function PassportClient() {
  const { session } = useSession();
  const { lang } = useLang();
  const worker = session?.worker;
  if (!worker) return null;

  const comps = worker.competencies;
  const weakEntries = Object.entries(comps).sort((a, b) => a[1] - b[1]);
  const weakest = weakEntries[0];
  const weakestLabels: Record<string, string> = {
    hazardRecognition: "Hazard Recognition",
    procedureAccuracy: "Procedure Accuracy",
    decisionMaking: "Decision Making",
    equipmentSelection: "Equipment Selection",
    reactionTime: "Reaction Time",
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-white">{t(lang, "passport.title")}</h1>
      <p className="text-surface-300 text-sm mt-1">Your digital industrial safety credential.</p>

      {/* Passport card */}
      <div className="mt-6 relative rounded-2xl overflow-hidden border border-brand-500/30 shadow-2xl">
        <div className="absolute inset-0 hazard-stripes opacity-20" />
        <div className="relative bg-gradient-to-br from-surface-900 via-surface-850 to-surface-900 p-6 sm:p-8">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-brand-400">SurakshaAR · Safety Passport</div>
              <h2 className="mt-1 text-2xl font-bold text-white">{worker.name}</h2>
              <div className="text-sm text-surface-300 mt-0.5">{worker.id}</div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-brand-400" />
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider text-surface-400">Issued</div>
                <div className="font-mono text-white text-sm">{new Date(worker.lastTrainingAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Info label={t(lang, "passport.industry")} value={worker.industry} />
            <Info label="Experience" value={worker.experience} />
            <Info label={t(lang, "passport.safetyIndex")} value={`${worker.safetyScore}%`} accent />
            <Info label="Certificates" value={String(worker.certificates.length)} />
          </div>

          <div className="mt-6">
            <div className="text-xs uppercase tracking-wider text-surface-400 mb-2">Competencies</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(comps).map(([k, v]) => (
                <div key={k} className="rounded-lg bg-surface-900/60 border border-surface-700 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-surface-400">{weakestLabels[k] ?? k}</div>
                  <div className={`text-2xl font-bold mt-1 ${v >= 85 ? "text-safe-400" : v >= 70 ? "text-amber-400" : "text-danger-500"}`}>{v}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg bg-surface-900/60 border border-surface-700 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-surface-400">
                <Calendar className="h-3.5 w-3.5" /> {t(lang, "passport.lastTraining")}
              </div>
              <div className="mt-1 font-semibold text-white">{new Date(worker.lastTrainingAt).toLocaleDateString()}</div>
            </div>
            <div className="rounded-lg bg-surface-900/60 border border-surface-700 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-surface-400">
                <Target className="h-3.5 w-3.5" /> {t(lang, "passport.nextTraining")}
              </div>
              <div className="mt-1 font-semibold text-white">
                {weakest && weakest[1] < 85 ? `${weakestLabels[weakest[0]]} Refresher` : "Maintain current skills"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificates */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">{t(lang, "worker.certificates")}</h2>
          <Link href="/worker/certificates" className="btn btn-secondary text-xs">View all</Link>
        </div>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {worker.certificates.map((c) => (
            <Link key={c.code} href={`/worker/certificate?code=${c.code}`} className="card card-hover p-4">
              <div className="flex items-center justify-between">
                <Award className="h-5 w-5 text-brand-400" />
                <span className={`tag ${c.status === "valid" ? "border-safe-500/40 bg-safe-500/10 text-safe-400" : c.status === "expiring" ? "border-amber-400/40 bg-amber-400/10 text-amber-400" : "border-danger-500/40 bg-danger-500/10 text-danger-500"}`}>
                  {c.status.toUpperCase()}
                </span>
              </div>
              <div className="mt-2 font-semibold text-white">
                {t(lang, `module.${c.moduleId}.title`)}
              </div>
              <div className="text-xs text-surface-400 mt-1 font-mono">{c.code}</div>
              <div className="mt-2 flex items-center justify-between text-xs text-surface-300">
                <span>Score: <span className="text-white font-bold">{c.score}%</span></span>
                <span>{new Date(c.issueDate).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
          {worker.certificates.length === 0 && (
            <div className="col-span-full card p-8 text-center">
              <Award className="h-8 w-8 text-surface-400 mx-auto" />
              <div className="mt-2 text-surface-300 text-sm">No certificates yet. Complete a module to earn your first credential.</div>
              <Link href="/worker/modules" className="btn btn-primary mt-4 text-xs">Browse Modules</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-surface-400">{label}</div>
      <div className={`mt-1 font-bold ${accent ? "text-brand-400 text-2xl" : "text-white"}`}>{value}</div>
    </div>
  );
}
