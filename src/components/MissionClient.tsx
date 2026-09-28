"use client";
import { useEffect, useMemo, useRef, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ARCameraOverlay, startCamera, stopCamera } from "@/components/IndustrialScene";
import { useSession, useLang } from "@/components/SessionProvider";
import { scoreMission } from "@/lib/assessment";
import { t } from "@/lib/i18n";
import { MODULE_CONFIGS, isModuleId } from "@/lib/modules";
import { Camera, CameraOff, Target, Clock, AlertTriangle, CheckCircle2, HelpCircle, RotateCcw, X, MousePointerClick, Eye, ChevronDown } from "lucide-react";

const MissionScene = dynamic(() => import("@/components/MissionScenes").then((m) => m.MissionScene), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center text-surface-400 text-sm">
      <span className="h-2 w-2 rounded-full bg-brand-500 warning-blink mr-2" /> Loading 3D…
    </div>
  ),
});

const TIME_LIMIT = 90;

export function MissionClient({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = use(params);
  if (!isModuleId(moduleId)) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="card p-8">
          <div className="text-white font-semibold">Module not found</div>
          <Link href="/worker/modules" className="btn btn-primary mt-4">Back to modules</Link>
        </div>
      </div>
    );
  }
  return <MissionGame moduleId={moduleId} />;
}

function MissionGame({ moduleId }: { moduleId: keyof typeof MODULE_CONFIGS }) {
  const cfg = MODULE_CONFIGS[moduleId];
  const router = useRouter();
  const { updateProgress } = useSession();
  const { lang } = useLang();

  const [steps, setSteps] = useState<Record<string, boolean>>(() => Object.fromEntries(cfg.steps.map((k) => [k, false])));
  const [wrongActions, setWrongActions] = useState(0);
  const [equipmentErrors, setEquipmentErrors] = useState(0);
  const [log, setLog] = useState<{ ok: boolean; text: string; time: number }[]>([]);
  const [feedback, setFeedback] = useState<{ kind: "ok" | "bad" | "info"; text: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [timeSpent, setTimeSpent] = useState(0);
  const [done, setDone] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showHint, setShowHint] = useState(true);
  const [showGuide, setShowGuide] = useState(false);

  // AR camera
  const [arMode, setArMode] = useState(false);
  const [arStarting, setArStarting] = useState(false);
  const [showArInfo, setShowArInfo] = useState(false);
  const [cameraSupported, setCameraSupported] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const completed = cfg.steps.filter((k) => steps[k]).length;
  const total = cfg.steps.length;
  const currentStep = cfg.steps.find((k) => !steps[k]) ?? cfg.steps[total - 1];
  const hintObject = showHint && !done && !steps[currentStep] ? cfg.stepObject[currentStep] : undefined;
  const stepLabel = (k: string) => t(lang, cfg.stepLabel[k]);

  // Timer (paused while tutorial / AR explanation is open)
  useEffect(() => {
    if (done || showTutorial || showArInfo) return;
    const iv = setInterval(() => {
      setTimeLeft((v) => Math.max(0, v - 1));
      setTimeSpent((v) => v + 1);
    }, 1000);
    return () => clearInterval(iv);
  }, [done, showTutorial, showArInfo]);

  const flash = (kind: "ok" | "bad" | "info", text: string) => {
    setFeedback({ kind, text });
    if (kind !== "info") setLog((l) => [{ ok: kind === "ok", text, time: timeSpent }, ...l].slice(0, 8));
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setFeedback(null), 2800);
  };

  const finish = () => {
    if (done) return;
    setDone(true);
    const scores = scoreMission({
      steps,
      wrongActions,
      timeSpentSec: timeSpent,
      timeLimitSec: TIME_LIMIT,
      hazardSteps: cfg.hazardSteps,
      equipmentSteps: cfg.equipmentSteps,
      equipmentErrors,
    });
    updateProgress(moduleId, Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 6), scores);
    const sp = new URLSearchParams();
    sp.set("moduleId", moduleId);
    Object.entries(scores).forEach(([k, v]) => sp.set(k, String(v)));
    sp.set("time", String(timeSpent));
    sp.set("wrong", String(wrongActions));
    router.push(`/worker/assessment?${sp.toString()}`);
  };

  // Auto-finish when time runs out or all steps are complete
  useEffect(() => {
    if (!done && timeLeft === 0) finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);
  useEffect(() => {
    if (!done && completed === total) {
      const id = setTimeout(() => finish(), 1400);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed]);

  /** Core game rule engine — same for every module, driven by lib/modules.ts */
  const onPick = (obj: string) => {
    if (done || showTutorial) return;

    const wrong = cfg.wrongObjects[obj];
    if (wrong) {
      setWrongActions((w) => w + 1);
      if (wrong.equipment) setEquipmentErrors((e) => e + 1);
      flash("bad", t(lang, wrong.feedback));
      return;
    }

    const pendingForObj = cfg.steps.filter((k) => !steps[k] && cfg.stepObject[k] === obj);
    const target = cfg.ordered ? (cfg.stepObject[currentStep] === obj && !steps[currentStep] ? currentStep : undefined) : pendingForObj[0];

    if (target) {
      setSteps((s) => ({ ...s, [target]: true }));
      flash("ok", t(lang, cfg.stepFeedback[target]));
      return;
    }

    if (pendingForObj.length > 0) {
      // Right object, wrong moment
      setWrongActions((w) => w + 1);
      flash("bad", `${t(lang, "fb.notYet")} ${stepLabel(currentStep)}`);
      return;
    }

    if (cfg.repeatWrong?.[obj]) {
      setWrongActions((w) => w + 1);
      flash("bad", t(lang, cfg.repeatWrong[obj]));
      return;
    }

    flash("info", t(lang, "fb.alreadyDone"));
  };

  // ---------- AR camera ----------
  const toggleAR = () => (arMode ? setArMode(false) : setShowArInfo(true));
  const confirmAR = () => {
    setShowArInfo(false);
    setArStarting(true);
    setArMode(true);
  };
  useEffect(() => {
    if (!arMode) return;
    let cancelled = false;
    (async () => {
      await new Promise((r) => setTimeout(r, 50));
      if (cancelled) return;
      const stream = await startCamera(videoRef.current);
      if (cancelled) {
        stopCamera(stream);
        return;
      }
      setArStarting(false);
      if (!stream) {
        setCameraSupported(false);
        flash("bad", t(lang, "mission.cameraUnavailable"));
        setArMode(false);
        return;
      }
      streamRef.current = stream;
    })();
    return () => {
      cancelled = true;
      stopCamera(streamRef.current);
      streamRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arMode]);

  const guideObjects = useMemo(
    () => [
      ...cfg.interactiveObjects.map((o) => ({ id: o, interactive: true, wrong: !!cfg.wrongObjects[o] })),
      ...cfg.environmentObjects.map((o) => ({ id: o, interactive: false, wrong: false })),
    ],
    [cfg]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-4">
      {/* HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-surface-400">
            {t(lang, "mission.label")} · {cfg.number}
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white">{t(lang, cfg.titleKey)}</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`card px-3 py-1.5 flex items-center gap-2 ${timeLeft <= 15 ? "border-danger-500/40 text-danger-500" : "text-white"}`}>
            <Clock className="h-4 w-4" />
            <span className="font-mono font-bold text-lg">
              {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
            </span>
          </div>
          <button onClick={() => setShowHint((s) => !s)} className={`btn !py-2 !px-3 text-xs ${showHint ? "btn-primary" : "btn-secondary"}`}>
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">{showHint ? t(lang, "mission.hintsOn") : t(lang, "mission.hints")}</span>
          </button>
          <button onClick={toggleAR} className="btn btn-secondary !py-2 !px-3 text-xs">
            {arMode ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
            <span className="hidden sm:inline">{arMode ? t(lang, "mission.exitAR") : t(lang, "mission.arMode")}</span>
          </button>
          <button onClick={finish} className="btn btn-primary !py-2 !px-3 text-xs">
            <CheckCircle2 className="h-4 w-4" /> {t(lang, "common.finish")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* 3D scene */}
        <div className="lg:col-span-3">
          <div className="card overflow-hidden relative" style={{ height: "min(72vh, 600px)" }}>
            <ARCameraOverlay active={arMode} videoRef={videoRef}>
              <MissionScene moduleId={moduleId} lang={lang} onPick={onPick} hint={hintObject} ar={arMode} progress={steps} />
            </ARCameraOverlay>

            {/* Status + controls */}
            <div
              className={`absolute top-3 left-3 z-10 flex items-center gap-2 rounded-full border backdrop-blur px-3 py-1 text-xs font-semibold pointer-events-none ${
                arMode ? "border-safe-500/40 bg-safe-500/10 text-safe-400" : "border-surface-600 bg-surface-900/70 text-surface-200"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${arMode ? "bg-safe-400" : "bg-brand-500 warning-blink"}`} />
              {arMode ? t(lang, "mission.arActive") : t(lang, "mission.simActive")}
            </div>
            <div className="absolute top-3 right-3 z-10 card px-3 py-2 text-[11px] text-surface-200 flex items-center gap-2 pointer-events-none">
              <RotateCcw className="h-3.5 w-3.5 text-surface-400" />
              <span className="hidden sm:inline">{t(lang, "common.dragPinch")} · {t(lang, "scene.hoverHint")}</span>
              <span className="sm:hidden">{t(lang, "scene.hoverHint")}</span>
            </div>

            {arMode && !arStarting && (
              <div className="absolute top-12 left-3 z-10 card px-3 py-2 text-xs text-white max-w-[240px] pointer-events-none">
                {t(lang, "ar.pointCamera")}
              </div>
            )}

            {/* Current step banner */}
            <div className="absolute bottom-3 left-3 right-3 z-10 pointer-events-none">
              <div className="card px-4 py-3 flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                    completed === total ? "bg-safe-500/20 text-safe-400 border border-safe-500/40" : "bg-brand-500/20 text-brand-400 border border-brand-500/40"
                  }`}
                >
                  {completed === total ? <CheckCircle2 className="h-5 w-5" /> : <Target className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-surface-400">
                    {completed === total
                      ? t(lang, "assessment.missionComplete")
                      : `${t(lang, "mission.step")} ${cfg.steps.indexOf(currentStep) + 1} ${t(lang, "mission.of")} ${total}`}
                  </div>
                  <div className="text-white font-semibold truncate">
                    {completed === total ? t(lang, "mission.complete.desc") : stepLabel(currentStep)}
                  </div>
                </div>
                <div className="hidden sm:block text-xs text-surface-400">
                  {completed}/{total}
                </div>
              </div>
              {!cameraSupported && (
                <div className="mt-2 card px-3 py-1.5 text-xs text-amber-400 border-amber-400/40 inline-flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5" /> {t(lang, "mission.cameraUnavailable")}
                </div>
              )}
            </div>

            {/* Feedback toast */}
            {feedback && (
              <div
                className={`absolute top-16 left-1/2 -translate-x-1/2 z-20 float-up ${
                  feedback.kind === "ok" ? "bg-safe-500/95" : feedback.kind === "bad" ? "bg-danger-500/95" : "bg-surface-700/95"
                } text-white font-semibold px-5 py-3 rounded-lg shadow-xl text-sm max-w-md text-center pointer-events-none`}
              >
                {feedback.text}
              </div>
            )}

            {arStarting && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-surface-950/70">
                <div className="card px-4 py-3 text-sm text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand-500 warning-blink" /> {t(lang, "ar.starting")}
                </div>
              </div>
            )}

            {showArInfo && (
              <div className="absolute inset-0 bg-surface-950/85 backdrop-blur-sm flex items-center justify-center z-30 p-4">
                <div className="card p-6 max-w-md w-full">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-lg bg-brand-500/15 border border-brand-500/30 flex items-center justify-center">
                      <Camera className="h-5 w-5 text-brand-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">{t(lang, "ar.title")}</h2>
                  </div>
                  <p className="mt-3 text-sm text-surface-200">{t(lang, "ar.what")}</p>
                  <ul className="mt-3 space-y-2 text-sm text-surface-300">
                    {["ar.use1", "ar.use2", "ar.use3"].map((k) => (
                      <li key={k} className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 text-safe-400 shrink-0 mt-0.5" /> {t(lang, k)}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-surface-400">{t(lang, "ar.note")}</p>
                  <div className="mt-5 flex gap-2">
                    <button onClick={() => setShowArInfo(false)} className="btn btn-secondary flex-1">{t(lang, "common.cancel")}</button>
                    <button onClick={confirmAR} className="btn btn-primary flex-1">
                      <Camera className="h-4 w-4" /> {t(lang, "ar.start")}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mission briefing / tutorial */}
            {showTutorial && (
              <div className="absolute inset-0 bg-surface-950/85 backdrop-blur-sm flex items-center justify-center z-30 p-4 overflow-y-auto">
                <div className="card p-6 max-w-lg w-full my-auto">
                  <div className="flex items-center justify-between mb-3">
                    <div className="tag border-brand-500/40 bg-brand-500/10 text-brand-400">{t(lang, "module.missionBriefing")}</div>
                    <button onClick={() => setShowTutorial(false)} className="text-surface-400 hover:text-white" aria-label="Close">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <h2 className="text-xl font-bold text-white">{t(lang, cfg.titleKey)}</h2>
                  <p className="mt-2 text-sm text-surface-200">{t(lang, cfg.objectiveKey)}</p>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <TutorialStep icon={<RotateCcw className="h-4 w-4" />} title={t(lang, "mission.tutorial1.title")} desc={t(lang, "mission.tutorial1.desc")} />
                    <TutorialStep icon={<Eye className="h-4 w-4" />} title={t(lang, "scene.tutorialHover.title")} desc={t(lang, "scene.tutorialHover.desc")} />
                    <TutorialStep icon={<MousePointerClick className="h-4 w-4" />} title={t(lang, "mission.tutorial2.title")} desc={t(lang, "mission.tutorial2.desc")} />
                    <TutorialStep icon={<Clock className="h-4 w-4" />} title={t(lang, "mission.tutorial4.title")} desc={t(lang, "mission.tutorial4.desc")} />
                  </div>

                  <div className="mt-4">
                    <div className="text-[10px] uppercase tracking-wider text-surface-400 mb-2">{t(lang, "mission.missionSteps")}</div>
                    <ol className="space-y-1">
                      {cfg.steps.map((k, i) => (
                        <li key={k} className="flex items-center gap-2 text-sm text-surface-200">
                          <span className="h-5 w-5 rounded-full bg-surface-700 text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                          {stepLabel(k)}
                        </li>
                      ))}
                    </ol>
                    {!cfg.ordered && <div className="mt-2 text-xs text-info-500">{t(lang, "scene.anyOrder")}</div>}
                  </div>

                  <button onClick={() => setShowTutorial(false)} className="btn btn-primary w-full mt-5">
                    {t(lang, "mission.startMission")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Side panel */}
        <div className="grid gap-4 content-start">
          <div className="card p-4">
            <h2 className="font-bold text-white text-sm uppercase tracking-wider">{t(lang, "mission.missionSteps")}</h2>
            <div className="mt-1 text-xs text-surface-400">{completed} / {total}</div>
            <div className="progress mt-2"><div style={{ width: `${(completed / total) * 100}%` }} /></div>
            <ol className="mt-4 space-y-2">
              {cfg.steps.map((key, i) => {
                const isDone = steps[key];
                const isCurrent = key === currentStep && !isDone;
                return (
                  <li
                    key={key}
                    className={`flex items-start gap-3 p-2 rounded-lg transition border ${
                      isDone ? "bg-safe-500/10 border-safe-500/20" : isCurrent ? "bg-brand-500/15 border-brand-500/40" : "bg-surface-900/60 border-surface-700"
                    }`}
                  >
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${isDone ? "bg-safe-500 text-white" : isCurrent ? "bg-brand-500 text-white" : "bg-surface-700 text-surface-300"}`}>
                      {isDone ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-[11px] font-bold">{i + 1}</span>}
                    </div>
                    <div className={`text-sm pt-0.5 ${isCurrent ? "text-white font-semibold" : isDone ? "text-surface-300" : "text-surface-200"}`}>
                      {stepLabel(key)}
                      {isCurrent && (
                        <span className="block text-[10px] text-brand-400 mt-0.5">
                          → {t(lang, `obj.${cfg.stepObject[key]}`)}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg bg-surface-900/60 border border-surface-700 p-2">
                <div className="text-[10px] uppercase tracking-wider text-surface-400">{t(lang, "mission.wrongActions")}</div>
                <div className="font-bold text-white">{wrongActions}</div>
              </div>
              <div className="rounded-lg bg-surface-900/60 border border-surface-700 p-2">
                <div className="text-[10px] uppercase tracking-wider text-surface-400">{t(lang, "mission.timeElapsed")}</div>
                <div className="font-bold text-white">{timeSpent}s</div>
              </div>
            </div>

            {wrongActions >= 2 && (
              <div className="mt-3 p-3 rounded-lg bg-amber-400/10 border border-amber-400/30 text-xs text-amber-400">{t(lang, "mission.tip")}</div>
            )}
          </div>

          {/* Action log */}
          {log.length > 0 && (
            <div className="card p-4">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">{t(lang, "scene.actionLog")}</h3>
              <ul className="mt-2 space-y-1.5 max-h-40 overflow-y-auto">
                {log.map((e, i) => (
                  <li key={i} className={`text-xs ${e.ok ? "text-safe-400" : "text-danger-500"}`}>
                    <span className="text-surface-500 font-mono mr-1">{e.time}s</span> {e.text}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Scene guide: every object and its name */}
          <div className="card p-4">
            <button onClick={() => setShowGuide((v) => !v)} className="w-full flex items-center justify-between text-left">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">{t(lang, "scene.guide")}</h3>
              <ChevronDown className={`h-4 w-4 text-surface-400 transition ${showGuide ? "rotate-180" : ""}`} />
            </button>
            {showGuide && (
              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
                <p className="text-[11px] text-surface-400">{t(lang, "scene.guideDesc")}</p>
                {guideObjects.map((o, i) => (
                  <div key={`${o.id}-${i}`} className="rounded-lg bg-surface-900/60 border border-surface-700 p-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-semibold text-white">{t(lang, `obj.${o.id}`)}</div>
                      <span
                        className={`tag ${
                          o.interactive ? "border-brand-500/40 bg-brand-500/10 text-brand-400" : "border-info-500/40 bg-info-500/10 text-info-500"
                        }`}
                      >
                        {o.interactive ? t(lang, "scene.tapShort") : t(lang, "scene.info")}
                      </span>
                    </div>
                    <div className="text-[11px] text-surface-300 mt-0.5">{t(lang, `obj.${o.id}.desc`)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TutorialStep({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-surface-900/60 border border-surface-700 p-2">
      <div className="h-7 w-7 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-400 flex items-center justify-center shrink-0">{icon}</div>
      <div>
        <div className="text-white font-semibold text-xs">{title}</div>
        <div className="text-surface-300 text-[11px] mt-0.5 leading-snug">{desc}</div>
      </div>
    </div>
  );
}
