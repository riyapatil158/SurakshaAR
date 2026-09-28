"use client";
import Link from "next/link";
import { DEMO_WORKERS } from "@/lib/demo-data";
import { ArrowLeft, Award, Calendar, Factory, Shield, Target } from "lucide-react";

export function AdminWorkerDetailClient({ workerId }: { workerId: string }) {
  const worker = DEMO_WORKERS.find((w) => w.id === workerId);
  if (!worker) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="card p-8">
          <div className="text-surface-300">Worker not found.</div>
          <Link href="/admin/workers" className="btn btn-primary mt-4">Back to Workers</Link>
        </div>
      </div>
    );
  }

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
    <div className="max-w-5xl mx-auto">
      <Link href="/admin/workers" className="inline-flex items-center gap-2 text-surface-300 hover:text-white text-sm mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to Workers
      </Link>

      <div className="card p-6">
        <div className="flex flex-wrap items-start gap-4 justify-between">
          <div className="flex items-center gap-4">
            <div className={`h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold ${
              worker.gender === "Female" ? "bg-pink-500/20 text-pink-300 border-2 border-pink-500/30" : "bg-brand-500/20 text-brand-400 border-2 border-brand-500/30"
            }`}>
              {worker.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{worker.name}</h1>
              <div className="text-sm text-surface-300 font-mono mt-0.5">{worker.id}</div>
              <div className="mt-1 flex items-center gap-3 text-xs text-surface-400">
                <span className="inline-flex items-center gap-1"><Factory className="h-3.5 w-3.5" /> {worker.industry}</span>
                <span className="inline-flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> {worker.experience}</span>
                <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {worker.ageGroup}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-surface-400">Overall Safety Index</div>
            <div className={`text-4xl font-bold ${worker.safetyScore >= 85 ? "text-safe-400" : worker.safetyScore >= 70 ? "text-amber-400" : "text-danger-500"}`}>
              {worker.safetyScore}%
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {weakEntries.map(([k, v]) => (
            <div key={k} className="rounded-lg bg-surface-900/60 border border-surface-700 p-3">
              <div className="text-[10px] uppercase tracking-wider text-surface-400">{weakestLabels[k]}</div>
              <div className={`text-2xl font-bold mt-1 ${v >= 85 ? "text-safe-400" : v >= 70 ? "text-amber-400" : "text-danger-500"}`}>{v}%</div>
              <div className="progress mt-1">
                <div style={{ width: `${v}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="font-bold text-white text-lg flex items-center gap-2"><Award className="h-4 w-4 text-brand-400" /> Certificates</h2>
          <div className="mt-3 space-y-2">
            {worker.certificates.map((c) => (
              <div key={c.code} className="rounded-lg bg-surface-900/60 border border-surface-700 p-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">
                    {c.moduleId === "fire" ? "Fire & Explosion Safety" : "Gas Leak & Confined Space"}
                  </div>
                  <div className="text-xs text-surface-400 font-mono">{c.code} · {new Date(c.issueDate).toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white">{c.score}%</div>
                  <span className={`tag ${c.status === "valid" ? "border-safe-500/40 bg-safe-500/10 text-safe-400" : c.status === "expiring" ? "border-amber-400/40 bg-amber-400/10 text-amber-400" : "border-danger-500/40 bg-danger-500/10 text-danger-500"}`}>
                    {c.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
            {worker.certificates.length === 0 && <div className="text-sm text-surface-400">No certificates issued.</div>}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-bold text-white text-lg flex items-center gap-2"><Target className="h-4 w-4 text-amber-400" /> Weak Areas & Recommendations</h2>
          <div className="mt-3 space-y-2">
            {weakEntries.filter(([, v]) => v < 80).map(([k, v]) => (
              <div key={k} className="rounded-lg bg-surface-900/60 border border-surface-700 p-3">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-white">{weakestLabels[k]}</div>
                  <span className="text-danger-500 font-bold">{v}%</span>
                </div>
                <div className="text-xs text-surface-400 mt-1">Recommended: {weakestLabels[k]} Refresher</div>
              </div>
            ))}
            {weakEntries.every(([, v]) => v >= 80) && (
              <div className="text-sm text-surface-400">No weak areas identified. Maintain current training.</div>
            )}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-surface-900/60 border border-surface-700">
            <div className="text-xs uppercase tracking-wider text-surface-400">Compliance Status</div>
            <div className={`text-lg font-bold mt-1 ${worker.certificates.some((c) => c.status === "valid") ? "text-safe-400" : "text-amber-400"}`}>
              {worker.certificates.some((c) => c.status === "valid") ? "Compliant" : worker.certificates.length ? "Review Required" : "Pending Training"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
