"use client";
import { DEMO_WORKERS } from "@/lib/demo-data";
import { AlertTriangle, XCircle, Clock, CheckCircle2 } from "lucide-react";

export function ComplianceClient() {
  const expiring = DEMO_WORKERS.flatMap((w) =>
    w.certificates.filter((c) => c.status === "expiring").map((c) => ({ worker: w, cert: c }))
  );
  const expired = DEMO_WORKERS.flatMap((w) =>
    w.certificates.filter((c) => c.status === "expired").map((c) => ({ worker: w, cert: c }))
  );
  const lowScore = DEMO_WORKERS.filter((w) => w.safetyScore < 65);
  const notCompleted = DEMO_WORKERS.filter((w) => w.modulesCompleted.length < 2);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-white">Compliance Alerts</h1>
      <p className="text-surface-300 text-sm mt-1">Action items requiring supervisor or HR attention.</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <AlertSection
          title="Expiring Soon"
          icon={<Clock className="h-4 w-4 text-amber-400" />}
          tone="warn"
          items={expiring.map(({ worker, cert }) => ({
            label: worker.name,
            sub: `${cert.code} · ${cert.moduleId === "fire" ? "Fire" : "Gas"}`,
            meta: new Date(cert.issueDate).toLocaleDateString(),
          }))}
        />
        <AlertSection
          title="Expired Certificates"
          icon={<XCircle className="h-4 w-4 text-danger-500" />}
          tone="danger"
          items={expired.map(({ worker, cert }) => ({
            label: worker.name,
            sub: `${cert.code} · ${cert.moduleId === "fire" ? "Fire" : "Gas"}`,
            meta: new Date(cert.issueDate).toLocaleDateString(),
          }))}
        />
        <AlertSection
          title="Low Safety Score (< 65%)"
          icon={<AlertTriangle className="h-4 w-4 text-amber-400" />}
          tone="warn"
          items={lowScore.map((w) => ({
            label: w.name,
            sub: `${w.industry} · Score ${w.safetyScore}%`,
            meta: "Refresher recommended",
          }))}
        />
        <AlertSection
          title="Incomplete Training (< 2 modules)"
          icon={<AlertTriangle className="h-4 w-4 text-info-500" />}
          tone="info"
          items={notCompleted.map((w) => ({
            label: w.name,
            sub: `${w.industry} · ${w.modulesCompleted.length} / 2 modules`,
            meta: "Training overdue",
          }))}
        />
      </div>
    </div>
  );
}

function AlertSection({
  title,
  icon,
  tone,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  tone: "warn" | "danger" | "info" | "safe";
  items: { label: string; sub: string; meta: string }[];
}) {
  const tones = {
    warn: "border-amber-400/30",
    danger: "border-danger-500/30",
    info: "border-info-500/30",
    safe: "border-safe-500/30",
  };
  return (
    <div className={`card p-4 ${tones[tone]}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 font-semibold text-white">
          {icon} {title}
        </div>
        <span className="text-xs text-surface-400">{items.length}</span>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {items.map((it, i) => (
          <div key={i} className="rounded-lg bg-surface-900/60 border border-surface-700 p-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-white text-sm">{it.label}</div>
              <div className="text-xs text-surface-400">{it.meta}</div>
            </div>
            <div className="text-xs text-surface-400 mt-0.5">{it.sub}</div>
          </div>
        ))}
        {items.length === 0 && <div className="text-sm text-safe-400 flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> No issues.</div>}
      </div>
    </div>
  );
}
