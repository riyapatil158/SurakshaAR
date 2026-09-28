"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { HazardScene } from "@/components/IndustrialScene";
import { useLang } from "@/components/SessionProvider";
import { t } from "@/lib/i18n";
import { Clock, Search, CheckCircle2, XCircle, RotateCw, ArrowRight, Target } from "lucide-react";

const REAL_HAZARDS = ["h1", "h2", "h3", "h4", "h5"];

export function HazardHuntClient() {
  const { lang } = useLang();
  const [timeLeft, setTimeLeft] = useState(30);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [found, setFound] = useState<Record<string, "real" | "decoy" | "missed">>({});

  useEffect(() => {
    if (!started || done) return;
    const iv = setInterval(() => {
      setTimeLeft((v) => {
        if (v <= 1) {
          finish();
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, done]);

  const finish = () => {
    setDone(true);
    // Mark any real hazards not found as missed
    setFound((prev) => {
      const next = { ...prev };
      REAL_HAZARDS.forEach((h) => {
        if (!next[h]) next[h] = "missed";
      });
      return next;
    });
  };

  const onClick = (id: string, isReal: boolean) => {
    if (done) return;
    if (!started) setStarted(true);
    if (found[id]) return;
    setFound((prev) => ({ ...prev, [id]: isReal ? "real" : "decoy" }));
  };

  const foundReal = Object.values(found).filter((v) => v === "real").length;
  const missed = REAL_HAZARDS.length - foundReal;
  const falsePos = Object.values(found).filter((v) => v === "decoy").length;
  const score = Math.round((foundReal / REAL_HAZARDS.length) * 100 - falsePos * 5);
  const finalScore = Math.max(0, score);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-surface-400">{t(lang, "hazard.title")}</div>
          <h1 className="text-lg sm:text-xl font-bold text-white">{t(lang, "hazard.subtitle")}</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className={`card px-3 py-1.5 flex items-center gap-2 ${timeLeft <= 10 ? "border-danger-500/40 text-danger-500" : "text-white"}`}>
            <Clock className="h-4 w-4" />
            <span className="font-mono font-bold text-lg">{timeLeft}s</span>
          </div>
          <div className="card px-3 py-1.5 flex items-center gap-2 text-safe-400">
            <CheckCircle2 className="h-4 w-4" />
            <span className="font-bold">{foundReal} / {REAL_HAZARDS.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 card overflow-hidden relative" style={{ height: "min(65vh, 520px)" }}>
          <HazardScene onHazardClick={onClick} />
          {!started && (
            <div className="absolute inset-0 flex items-center justify-center bg-surface-950/60 backdrop-blur-sm">
              <div className="card p-6 max-w-md text-center">
                <Target className="h-10 w-10 text-brand-400 mx-auto" />
                <h2 className="mt-3 text-xl font-bold text-white">{t(lang, "hazard.title")}</h2>
                <p className="mt-2 text-sm text-surface-300">Find 5 hazards in the industrial scene. Tap each hazard. You have 30 seconds.</p>
                <button onClick={() => setStarted(true)} className="btn btn-primary mt-4">
                  {t(lang, "hazard.start")}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="card p-4">
          <h2 className="font-bold text-white uppercase tracking-wider text-sm">Status</h2>
          <div className="mt-4 space-y-3">
            <StatRow icon={<CheckCircle2 className="h-4 w-4 text-safe-400" />} label={t(lang, "hazard.found")} value={foundReal} />
            <StatRow icon={<XCircle className="h-4 w-4 text-danger-500" />} label={t(lang, "hazard.missed")} value={done ? missed : 0} />
            <StatRow icon={<XCircle className="h-4 w-4 text-amber-400" />} label={t(lang, "hazard.false")} value={falsePos} />
          </div>
          {done && (
            <div className="mt-5 p-3 rounded-lg bg-surface-900/60 border border-surface-700 text-center">
              <div className="text-xs uppercase tracking-wider text-surface-400">Hazard Recognition</div>
              <div className="text-4xl font-bold text-white mt-1">{finalScore}%</div>
              <div className="mt-3 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setStarted(false);
                    setDone(false);
                    setFound({});
                    setTimeLeft(30);
                  }}
                  className="btn btn-secondary text-xs"
                >
                  <RotateCw className="h-4 w-4" /> Try Again
                </button>
                <Link href="/worker/modules" className="btn btn-primary text-xs">
                  Back to Modules <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-surface-900/60">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm text-surface-200">{label}</span>
      </div>
      <span className="font-bold text-white">{value}</span>
    </div>
  );
}
