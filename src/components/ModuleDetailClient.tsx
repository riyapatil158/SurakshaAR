"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Flame, Wind, Cog, HardHat, HeartPulse, Clock, Shield, Target, CheckCircle2, Play, ArrowLeft, Eye, MousePointerClick } from "lucide-react";
import { useLang } from "@/components/SessionProvider";
import { t } from "@/lib/i18n";
import { MODULE_CONFIGS, isModuleId, type ModuleId } from "@/lib/modules";

const MissionScene = dynamic(() => import("@/components/MissionScenes").then((m) => m.MissionScene), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center text-surface-400 text-sm">
      <span className="h-2 w-2 rounded-full bg-brand-500 warning-blink mr-2" /> Loading 3D…
    </div>
  ),
});

const ICONS: Record<ModuleId, typeof Flame> = { fire: Flame, gas: Wind, machine: Cog, ppe: HardHat, firstaid: HeartPulse };
const ACCENT: Record<string, { text: string; box: string }> = {
  brand: { text: "text-brand-400", box: "bg-brand-500/15 border-brand-500/30" },
  info: { text: "text-info-500", box: "bg-info-500/15 border-info-500/30" },
  amber: { text: "text-amber-400", box: "bg-amber-400/15 border-amber-400/30" },
  safe: { text: "text-safe-400", box: "bg-safe-500/15 border-safe-500/30" },
  danger: { text: "text-danger-500", box: "bg-danger-500/15 border-danger-500/30" },
};

export function ModuleDetailClient({ moduleId }: { moduleId: string }) {
  const { lang } = useLang();

  if (!isModuleId(moduleId)) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="card p-8">
          <div className="text-white font-semibold">Module not found</div>
          <Link href="/worker/modules" className="btn btn-primary mt-4">{t(lang, "module.back")}</Link>
        </div>
      </div>
    );
  }

  const cfg = MODULE_CONFIGS[moduleId];
  const Icon = ICONS[moduleId];
  const accent = ACCENT[cfg.accent];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <Link href="/worker/modules" className="inline-flex items-center gap-2 text-surface-300 hover:text-white text-sm mb-4">
        <ArrowLeft className="h-4 w-4" /> {t(lang, "module.back")}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="card overflow-hidden">
            <div className="relative h-80 sm:h-[440px] bg-surface-900">
              <MissionScene moduleId={moduleId} lang={lang} preview />
              <div className="pointer-events-none absolute top-3 left-3 flex items-center gap-2 rounded-full border border-surface-600 bg-surface-900/70 backdrop-blur px-3 py-1 text-xs text-surface-200">
                <span className={`h-2 w-2 rounded-full bg-current ${accent.text} warning-blink`} />
                {t(lang, "module.preview")}
              </div>
              <div className="pointer-events-none absolute bottom-3 right-3 card px-3 py-2 text-[11px] text-surface-200 flex items-center gap-2">
                <Eye className="h-3.5 w-3.5 text-surface-400" /> {t(lang, "scene.hoverHint")}
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3">
                <div className={`h-11 w-11 rounded-lg flex items-center justify-center border ${accent.box}`}>
                  <Icon className={`h-5 w-5 ${accent.text}`} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-surface-400">
                    {t(lang, "mission.label")} {cfg.number}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">{t(lang, cfg.titleKey)}</h1>
                </div>
              </div>
              <p className="mt-3 text-surface-300">{t(lang, cfg.descKey)}</p>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <Meta icon={<Clock className="h-4 w-4" />} text={`${cfg.durationMinutes} ${t(lang, "module.minutes")}`} />
                <Meta icon={<Target className="h-4 w-4" />} text={`${cfg.steps.length} ${t(lang, "mission.missionSteps")}`} />
                <Meta icon={<Shield className="h-4 w-4" />} text={cfg.difficulty} />
                <Meta icon={<CheckCircle2 className="h-4 w-4" />} text={t(lang, "module.certEligible")} />
              </div>
            </div>
          </div>

          {/* Scene guide */}
          <div className="card p-5">
            <h2 className="font-bold text-white text-lg">{t(lang, "scene.guide")}</h2>
            <p className="text-sm text-surface-400 mt-1">{t(lang, "scene.guideDesc")}</p>
            <div className="mt-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-brand-400 font-semibold">
                <MousePointerClick className="h-3.5 w-3.5" /> {t(lang, "scene.actionObjects")}
              </div>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cfg.interactiveObjects.map((o) => (
                  <ObjectCard key={o} name={t(lang, `obj.${o}`)} desc={t(lang, `obj.${o}.desc`)} interactive />
                ))}
              </div>
            </div>
            <div className="mt-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-info-500 font-semibold">
                <Eye className="h-3.5 w-3.5" /> {t(lang, "scene.envObjects")}
              </div>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cfg.environmentObjects.map((o) => (
                  <ObjectCard key={o} name={t(lang, `obj.${o}`)} desc={t(lang, `obj.${o}.desc`)} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card p-5 content-start h-fit lg:sticky lg:top-20">
          <div className="tag border-brand-500/40 bg-brand-500/10 text-brand-400">{t(lang, "module.missionBriefing")}</div>
          <h2 className="mt-3 font-bold text-white text-lg">{t(lang, "mission.objective")}</h2>
          <p className="text-surface-300 text-sm mt-2">{t(lang, cfg.objectiveKey)}</p>

          <div className="mt-5">
            <div className="text-xs uppercase tracking-wider text-surface-400 mb-2">{t(lang, "mission.missionSteps")}</div>
            <ol className="space-y-2">
              {cfg.steps.map((k, i) => (
                <li key={k} className="flex gap-3 items-start">
                  <span className="h-6 w-6 rounded-full bg-surface-800 border border-surface-700 flex items-center justify-center text-[11px] font-bold text-surface-200 shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-surface-200 pt-0.5">
                    {t(lang, cfg.stepLabel[k])}
                    <span className="block text-[11px] text-surface-400">→ {t(lang, `obj.${cfg.stepObject[k]}`)}</span>
                  </span>
                </li>
              ))}
            </ol>
            {!cfg.ordered && <div className="mt-2 text-xs text-info-500">{t(lang, "scene.anyOrder")}</div>}
          </div>

          <div className="mt-6 p-3 rounded-lg bg-surface-900/60 border border-surface-700 text-xs text-surface-300 space-y-0.5">
            <div className="font-semibold text-white mb-1">{t(lang, "module.scoringWeights")}</div>
            <div>{t(lang, "assessment.hazard")} 25%</div>
            <div>{t(lang, "assessment.procedure")} 25%</div>
            <div>{t(lang, "assessment.decision")} 20%</div>
            <div>{t(lang, "assessment.equipment")} 15%</div>
            <div>{t(lang, "assessment.reaction")} 10%</div>
            <div>{t(lang, "assessment.completion")} 5%</div>
          </div>

          <Link href={`/worker/mission/${moduleId}`} className="btn btn-primary w-full mt-5">
            <Play className="h-4 w-4" /> {t(lang, "module.start")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function Meta({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-surface-300">
      {icon} {text}
    </div>
  );
}

function ObjectCard({ name, desc, interactive = false }: { name: string; desc: string; interactive?: boolean }) {
  return (
    <div className={`rounded-lg border p-3 ${interactive ? "border-brand-500/25 bg-brand-500/5" : "border-surface-700 bg-surface-900/60"}`}>
      <div className="text-sm font-semibold text-white">{name}</div>
      <div className="text-xs text-surface-300 mt-0.5">{desc}</div>
    </div>
  );
}
