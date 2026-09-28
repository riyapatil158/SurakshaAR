"use client";
import Link from "next/link";
import { DEMO_MODULES } from "@/lib/demo-data";
import { useSession, useLang } from "@/components/SessionProvider";
import { t } from "@/lib/i18n";
import { Flame, Wind, Cog, HardHat, HeartPulse, ArrowRight, Clock, Lock } from "lucide-react";

export function ModulesClient() {
  const { session } = useSession();
  const { lang } = useLang();
  const worker = session?.worker;

  const iconFor = (id: string) => {
    switch (id) {
      case "fire": return Flame;
      case "gas": return Wind;
      case "machine": return Cog;
      case "ppe": return HardHat;
      case "firstaid": return HeartPulse;
    }
    return Cog;
  };

  const colorFor = (id: string) => {
    switch (id) {
      case "fire": return { bg: "bg-brand-500/15", border: "border-brand-500/30", text: "text-brand-400" };
      case "gas": return { bg: "bg-info-500/15", border: "border-info-500/30", text: "text-info-500" };
      case "machine": return { bg: "bg-amber-400/15", border: "border-amber-400/30", text: "text-amber-400" };
      case "ppe": return { bg: "bg-safe-500/15", border: "border-safe-500/30", text: "text-safe-400" };
      case "firstaid": return { bg: "bg-danger-500/15", border: "border-danger-500/30", text: "text-danger-500" };
    }
    return { bg: "bg-brand-500/15", border: "border-brand-500/30", text: "text-brand-400" };
  };

  const progress = (id: string) => {
    const p = session?.progress[id];
    if (p) return p.bestScore;
    const cert = worker?.certificates.find((c) => c.moduleId === id);
    return cert?.score ?? 0;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-white">{t(lang, "modules.title")}</h1>
      <p className="text-surface-300 mt-1 text-sm">{t(lang, "modules.subtitle")}</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEMO_MODULES.map((m, i) => {
          const Icon = iconFor(m.id);
          const c = colorFor(m.id);
          const p = progress(m.id);
          const isActive = m.status === "active";
          return (
            <div key={m.id} className={`card p-5 ${isActive ? "card-hover" : "opacity-80"}`}>
              <div className="flex items-start gap-4">
                <div className={`h-14 w-14 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-6 w-6 ${c.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-[10px] tracking-wider uppercase text-surface-400">0{i + 1}</div>
                    <div className={`tag ${isActive ? "border-safe-500/40 bg-safe-500/10 text-safe-400" : "border-surface-600 bg-surface-700/40 text-surface-300"}`}>
                      {isActive ? "Active" : t(lang, "module.coming")}
                    </div>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-white">{t(lang, m.titleKey)}</h3>
                  <p className="text-sm text-surface-300 mt-1">{t(lang, m.descKey)}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-surface-400">
                    <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {m.durationMinutes} {t(lang, "module.minutes")}</span>
                    <span>·</span>
                    <span>{m.difficulty}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {m.skills.map((s) => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-800 border border-surface-700 text-surface-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-surface-700 flex items-center justify-between">
                {isActive ? (
                  <>
                    <div>
                      <div className="text-xs text-surface-400">{t(lang, "module.bestScore")}</div>
                      <div className="font-bold text-white">{p}%</div>
                    </div>
                    <Link href={`/worker/module/${m.id}`} className="btn btn-primary text-xs">
                      {p > 0 ? t(lang, "module.resume") : t(lang, "module.start")} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </>
                ) : (
                  <div className="inline-flex items-center gap-2 text-surface-400 text-sm">
                    <Lock className="h-4 w-4" /> {t(lang, "module.coming")}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
