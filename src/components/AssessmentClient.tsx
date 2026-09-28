"use client";
import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, useLang } from "@/components/SessionProvider";
import { computeOverall, grade, gradeLabel, passing, recommendRefreshers, CompetencyScores } from "@/lib/assessment";
import { t } from "@/lib/i18n";
import { Award, CheckCircle2, AlertTriangle, RotateCw, ArrowRight, Target, Sparkles } from "lucide-react";

export function AssessmentClient() {
  const params = useSearchParams();
  const router = useRouter();
  const { session, addCertificate } = useSession();
  const { lang } = useLang();

  const moduleId = params.get("moduleId") || "fire";

  const comps: CompetencyScores = useMemo(() => ({
    hazardRecognition: Number(params.get("hazardRecognition") || 0),
    procedureAccuracy: Number(params.get("procedureAccuracy") || 0),
    decisionMaking: Number(params.get("decisionMaking") || 0),
    equipmentSelection: Number(params.get("equipmentSelection") || 0),
    reactionTime: Number(params.get("reactionTime") || 0),
    completion: Number(params.get("completion") || 0),
  }), [params]);

  const overall = computeOverall(comps);
  const passed = passing(overall);
  const g = grade(overall);
  const { weak, refresherIds } = recommendRefreshers(comps);

  const competencyList: { key: keyof CompetencyScores; labelKey: string; weight: number }[] = [
    { key: "hazardRecognition", labelKey: "assessment.hazard", weight: 25 },
    { key: "procedureAccuracy", labelKey: "assessment.procedure", weight: 25 },
    { key: "decisionMaking", labelKey: "assessment.decision", weight: 20 },
    { key: "equipmentSelection", labelKey: "assessment.equipment", weight: 15 },
    { key: "reactionTime", labelKey: "assessment.reaction", weight: 10 },
    { key: "completion", labelKey: "assessment.completion", weight: 5 },
  ];

  const issueCertificate = () => {
    const code = addCertificate(moduleId, overall, comps);
    router.push(`/worker/certificate?code=${code}`);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="card p-6 sm:p-8 text-center">
        <div className="score-pop inline-block">
          <div className={`h-28 w-28 rounded-full flex items-center justify-center mx-auto border-4 ${
            passed ? "border-safe-500 bg-safe-500/10" : "border-amber-400 bg-amber-400/10"
          }`}>
            <div className="text-5xl font-bold text-white">{overall}</div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2">
          {passed ? (
            <span className="tag border-safe-500/40 bg-safe-500/10 text-safe-400"><CheckCircle2 className="h-3.5 w-3.5" /> {t(lang, "assessment.pass")}</span>
          ) : (
            <span className="tag border-amber-400/40 bg-amber-400/10 text-amber-400"><AlertTriangle className="h-3.5 w-3.5" /> {t(lang, "assessment.needsPractice")}</span>
          )}
          <span className={`tag ${g === "excellent" ? "border-safe-500/40 bg-safe-500/10 text-safe-400" : g === "good" ? "border-amber-400/40 bg-amber-400/10 text-amber-400" : "border-danger-500/40 bg-danger-500/10 text-danger-500"}`}>
            <Sparkles className="h-3.5 w-3.5" /> {gradeLabel(overall)}
          </span>
        </div>
        <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-white">{t(lang, "assessment.overall")}</h1>
        <p className="text-surface-300 mt-2 text-sm">
          {moduleId === "fire" ? "Fire & Explosion Safety" : "Gas Leak & Confined Space"} · Mission Complete
        </p>
      </div>

      {/* Competencies */}
      <div className="mt-6 card p-5">
        <h2 className="font-bold text-white text-lg mb-4">Competency Breakdown</h2>
        <div className="space-y-3">
          {competencyList.map((c) => {
            const v = comps[c.key];
            return (
              <div key={c.key}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-surface-200">{t(lang, c.labelKey)} <span className="text-surface-500">· {c.weight}%</span></span>
                  <span className={`font-bold ${v >= 85 ? "text-safe-400" : v >= 70 ? "text-amber-400" : "text-danger-500"}`}>{v}%</span>
                </div>
                <div className="progress">
                  <div style={{
                    width: `${v}%`,
                    background: v >= 85 ? "linear-gradient(90deg, #1fbf75, #2ee38d)" : v >= 70 ? "linear-gradient(90deg, #ffb020, #ff9f0a)" : "linear-gradient(90deg, #ef4444, #dc2626)"
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Adaptive recommendations */}
      {weak.length > 0 && (
        <div className="mt-4 card p-5 border-amber-400/30 bg-amber-400/5">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Target className="h-4 w-4" /> Adaptive Refresher Training
          </div>
          <p className="text-surface-200 text-sm mt-2">
            Your assessment identified areas that would benefit from focused practice. These targeted refreshers will help reinforce your skills.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {weak.map((w) => (
              <div key={w.key} className="px-3 py-2 rounded-lg bg-surface-900/60 border border-surface-700 text-sm">
                <div className="text-white font-semibold">{w.label}</div>
                <div className="text-xs text-surface-400">Score: {w.score}%</div>
              </div>
            ))}
          </div>
          {refresherIds.length > 0 && (
            <Link href="/worker/hazard-hunt" className="btn btn-secondary mt-4 text-xs">
              Start Refresher <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <Link href={`/worker/mission/${moduleId}`} className="btn btn-secondary">
          <RotateCw className="h-4 w-4" /> {t(lang, "assessment.retry")}
        </Link>
        {passed ? (
          <button onClick={issueCertificate} className="btn btn-primary">
            <Award className="h-4 w-4" /> {t(lang, "assessment.viewCertificate")}
          </button>
        ) : (
          <Link href="/worker/modules" className="btn btn-primary">Back to Modules</Link>
        )}
      </div>
    </div>
  );
}
