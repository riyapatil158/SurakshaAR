// Deterministic weighted scoring engine for SurakshaAR.
// The final score is computed from real performance metrics — never random.

export type CompetencyScores = {
  hazardRecognition: number; // 0..100
  procedureAccuracy: number;
  decisionMaking: number;
  equipmentSelection: number;
  reactionTime: number;
  completion: number;
};

export const WEIGHTS: Record<keyof CompetencyScores, number> = {
  hazardRecognition: 0.25,
  procedureAccuracy: 0.25,
  decisionMaking: 0.2,
  equipmentSelection: 0.15,
  reactionTime: 0.1,
  completion: 0.05,
};

export function computeOverall(c: CompetencyScores): number {
  let total = 0;
  (Object.keys(WEIGHTS) as (keyof CompetencyScores)[]).forEach((k) => {
    total += Math.max(0, Math.min(100, c[k])) * WEIGHTS[k];
  });
  return Math.round(total);
}

export function grade(score: number): "excellent" | "good" | "practice" {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  return "practice";
}

export function gradeLabel(score: number): string {
  const g = grade(score);
  if (g === "excellent") return "Excellent";
  if (g === "good") return "Good";
  return "Needs Practice";
}

export function passing(score: number): boolean {
  return score >= 70;
}

// Identify weak competencies (< 75) and return recommended refresher IDs.
export function recommendRefreshers(c: CompetencyScores): {
  weak: { key: keyof CompetencyScores; score: number; label: string }[];
  refresherIds: string[];
} {
  const labels: Record<keyof CompetencyScores, string> = {
    hazardRecognition: "Hazard Recognition",
    procedureAccuracy: "Procedure Accuracy",
    decisionMaking: "Decision Making",
    equipmentSelection: "Equipment Selection",
    reactionTime: "Reaction Time",
    completion: "Mission Completion",
  };
  const weak: { key: keyof CompetencyScores; score: number; label: string }[] = [];
  (Object.keys(labels) as (keyof CompetencyScores)[]).forEach((k) => {
    if (c[k] < 75) weak.push({ key: k, score: c[k], label: labels[k] });
  });
  const ids: string[] = [];
  if (weak.some((w) => w.key === "hazardRecognition")) ids.push("hazard-hunt");
  if (weak.some((w) => w.key === "equipmentSelection"))
    ids.push("equipment-refresher");
  if (weak.some((w) => w.key === "decisionMaking"))
    ids.push("decision-refresher");
  if (weak.some((w) => w.key === "procedureAccuracy"))
    ids.push("procedure-refresher");
  return { weak, refresherIds: ids };
}

// Build competencies from mission performance so the score is deterministic.
export function scoreMission(opts: {
  steps: Record<string, boolean>;
  wrongActions: number;
  timeSpentSec: number;
  timeLimitSec: number;
  /** Steps that measure hazard recognition for this module */
  hazardSteps?: string[];
  /** Steps that measure equipment selection for this module */
  equipmentSteps?: string[];
  /** Number of wrong equipment choices (e.g. water extinguisher on an electrical fire) */
  equipmentErrors?: number;
}): CompetencyScores {
  const { steps, wrongActions, timeSpentSec, timeLimitSec } = opts;
  const equipmentErrors = opts.equipmentErrors ?? 0;
  const stepKeys = Object.keys(steps);
  const completedSteps = stepKeys.filter((k) => steps[k]).length;
  const stepRatio = stepKeys.length ? completedSteps / stepKeys.length : 0;

  const ratio = (keys: string[]) => (keys.length ? keys.filter((k) => steps[k]).length / keys.length : stepRatio);

  const hazardKeys =
    opts.hazardSteps ?? stepKeys.filter((k) => k.includes("hazard") || k.includes("assess") || k.includes("alarm"));
  const hazardRecognition = Math.round(ratio(hazardKeys) * 100);

  const procedureAccuracy = Math.max(0, Math.round(stepRatio * 100 - wrongActions * 6));

  const decisionMaking = Math.max(0, Math.round(100 - wrongActions * 14 - (1 - stepRatio) * 20));

  const equipmentKeys = opts.equipmentSteps ?? stepKeys.filter((k) => k.includes("extinguisher") || k.includes("protect"));
  const equipmentSelection = Math.max(0, Math.round(ratio(equipmentKeys) * 100 - equipmentErrors * 20));

  const remaining = Math.max(0, timeLimitSec - timeSpentSec);
  const reactionTime = completedSteps === 0 ? 0 : Math.round((remaining / timeLimitSec) * 100);

  const completion = Math.round(stepRatio * 100);

  return {
    hazardRecognition,
    procedureAccuracy,
    decisionMaking,
    equipmentSelection,
    reactionTime,
    completion,
  };
}
