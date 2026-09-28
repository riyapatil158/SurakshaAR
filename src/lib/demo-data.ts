import { Lang } from "./i18n";

export type WorkerRecord = {
  id: string;
  name: string;
  industry: "Mining" | "Steel" | "Manufacturing" | "Maintenance" | "Other";
  experience: string;
  language: Lang;
  gender: "Male" | "Female" | "Other";
  ageGroup: string;
  safetyScore: number;
  competencies: {
    hazardRecognition: number;
    procedureAccuracy: number;
    decisionMaking: number;
    equipmentSelection: number;
    reactionTime: number;
  };
  modulesCompleted: ("fire" | "gas" | "machine" | "ppe" | "firstaid")[];
  certificates: {
    code: string;
    moduleId: "fire" | "gas" | "machine" | "ppe" | "firstaid";
    score: number;
    issueDate: string;
    status: "valid" | "expiring" | "expired";
  }[];
  lastTrainingAt: string;
};

function mk(id: string, name: string, opts: Partial<WorkerRecord> & {
  gender: WorkerRecord["gender"];
  industry: WorkerRecord["industry"];
  experience: string;
  safetyScore: number;
  competencies: WorkerRecord["competencies"];
  modulesCompleted: WorkerRecord["modulesCompleted"];
  certificates: WorkerRecord["certificates"];
  lastTrainingAt: string;
  language?: Lang;
  ageGroup?: string;
}): WorkerRecord {
  return {
    id,
    name,
    gender: opts.gender,
    industry: opts.industry,
    experience: opts.experience,
    safetyScore: opts.safetyScore,
    competencies: opts.competencies,
    modulesCompleted: opts.modulesCompleted,
    certificates: opts.certificates,
    lastTrainingAt: opts.lastTrainingAt,
    language: opts.language ?? "en",
    ageGroup: opts.ageGroup ?? "26–35",
  };
}

// Helpers to build dynamic recent dates so certificates always look fresh
function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}
function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export const DEMO_WORKERS: WorkerRecord[] = [
  mk("JH-W-10245", "Ramesh Kumar", {
    gender: "Male",
    industry: "Mining",
    experience: "3–5 Years",
    safetyScore: 84,
    competencies: {
      hazardRecognition: 91,
      procedureAccuracy: 82,
      decisionMaking: 78,
      equipmentSelection: 86,
      reactionTime: 83,
    },
    modulesCompleted: ["fire", "gas"],
    certificates: [
      { code: "SA-7842F1", moduleId: "fire", score: 84, issueDate: daysAgo(3), status: "valid" },
      { code: "SA-7842F2", moduleId: "gas", score: 78, issueDate: daysAgo(12), status: "valid" },
    ],
    lastTrainingAt: daysAgo(3),
  }),
  mk("JH-W-10312", "Sita Devi", {
    gender: "Female",
    industry: "Steel",
    experience: "5+ Years",
    safetyScore: 92,
    competencies: { hazardRecognition: 95, procedureAccuracy: 91, decisionMaking: 90, equipmentSelection: 93, reactionTime: 88 },
    modulesCompleted: ["fire", "gas"],
    certificates: [
      { code: "SA-9913A1", moduleId: "fire", score: 94, issueDate: daysAgo(9), status: "valid" },
    ],
    lastTrainingAt: daysAgo(9),
  }),
  mk("JH-W-10407", "Amit Kumar", {
    gender: "Male",
    industry: "Manufacturing",
    experience: "1–3 Years",
    safetyScore: 67,
    competencies: { hazardRecognition: 72, procedureAccuracy: 64, decisionMaking: 61, equipmentSelection: 58, reactionTime: 79 },
    modulesCompleted: ["fire"],
    certificates: [
      { code: "SA-3321B7", moduleId: "fire", score: 67, issueDate: daysAgo(324), status: "expiring" },
    ],
    lastTrainingAt: daysAgo(324),
  }),
  mk("JH-W-10519", "Pooja Kumari", {
    gender: "Female",
    industry: "Maintenance",
    experience: "1–3 Years",
    safetyScore: 74,
    competencies: { hazardRecognition: 80, procedureAccuracy: 72, decisionMaking: 70, equipmentSelection: 68, reactionTime: 82 },
    modulesCompleted: ["fire"],
    certificates: [
      { code: "SA-5521C4", moduleId: "fire", score: 74, issueDate: daysAgo(213), status: "valid" },
    ],
    lastTrainingAt: daysAgo(213),
  }),
  mk("JH-W-10622", "Rahul Singh", {
    gender: "Male",
    industry: "Mining",
    experience: "5+ Years",
    safetyScore: 88,
    competencies: { hazardRecognition: 90, procedureAccuracy: 88, decisionMaking: 84, equipmentSelection: 92, reactionTime: 86 },
    modulesCompleted: ["fire", "gas"],
    certificates: [
      { code: "SA-6624D9", moduleId: "fire", score: 90, issueDate: daysAgo(115), status: "valid" },
      { code: "SA-6624E9", moduleId: "gas", score: 85, issueDate: daysAgo(110), status: "valid" },
    ],
    lastTrainingAt: daysAgo(110),
  }),
  mk("JH-W-10734", "Anjali Kumari", {
    gender: "Female",
    industry: "Steel",
    experience: "0–1 Years",
    safetyScore: 58,
    competencies: { hazardRecognition: 62, procedureAccuracy: 55, decisionMaking: 52, equipmentSelection: 61, reactionTime: 60 },
    modulesCompleted: [],
    certificates: [],
    lastTrainingAt: daysAgo(268),
  }),
  mk("JH-W-10845", "Deepak Mahto", {
    gender: "Male",
    industry: "Manufacturing",
    experience: "3–5 Years",
    safetyScore: 81,
    competencies: { hazardRecognition: 86, procedureAccuracy: 80, decisionMaking: 77, equipmentSelection: 83, reactionTime: 79 },
    modulesCompleted: ["fire", "gas"],
    certificates: [
      { code: "SA-8845F2", moduleId: "fire", score: 83, issueDate: daysAgo(93), status: "valid" },
      { code: "SA-8845F3", moduleId: "gas", score: 79, issueDate: daysAgo(82), status: "valid" },
    ],
    lastTrainingAt: daysAgo(82),
  }),
  mk("JH-W-10956", "Neha Kumari", {
    gender: "Female",
    industry: "Maintenance",
    experience: "1–3 Years",
    safetyScore: 72,
    competencies: { hazardRecognition: 78, procedureAccuracy: 70, decisionMaking: 66, equipmentSelection: 72, reactionTime: 74 },
    modulesCompleted: ["fire"],
    certificates: [
      { code: "SA-9956G5", moduleId: "fire", score: 72, issueDate: daysAgo(160), status: "valid" },
    ],
    lastTrainingAt: daysAgo(160),
  }),
  mk("JH-W-11067", "Manoj Kumar", {
    gender: "Male",
    industry: "Mining",
    experience: "5+ Years",
    safetyScore: 90,
    competencies: { hazardRecognition: 93, procedureAccuracy: 89, decisionMaking: 87, equipmentSelection: 92, reactionTime: 89 },
    modulesCompleted: ["fire", "gas"],
    certificates: [
      { code: "SA-1067H1", moduleId: "fire", score: 92, issueDate: daysAgo(52), status: "valid" },
      { code: "SA-1067H2", moduleId: "gas", score: 88, issueDate: daysAgo(47), status: "valid" },
    ],
    lastTrainingAt: daysAgo(47),
  }),
  mk("JH-W-11178", "Kavita Devi", {
    gender: "Female",
    industry: "Steel",
    experience: "3–5 Years",
    safetyScore: 83,
    competencies: { hazardRecognition: 88, procedureAccuracy: 82, decisionMaking: 79, equipmentSelection: 85, reactionTime: 81 },
    modulesCompleted: ["fire", "gas"],
    certificates: [
      { code: "SA-1178J4", moduleId: "fire", score: 85, issueDate: daysAgo(11), status: "valid" },
    ],
    lastTrainingAt: daysAgo(11),
  }),
  mk("JH-W-11289", "Vikash Yadav", {
    gender: "Male",
    industry: "Manufacturing",
    experience: "0–1 Years",
    safetyScore: 49,
    competencies: { hazardRecognition: 54, procedureAccuracy: 46, decisionMaking: 44, equipmentSelection: 50, reactionTime: 51 },
    modulesCompleted: [],
    certificates: [],
    lastTrainingAt: daysAgo(245),
  }),
  mk("JH-W-11401", "Rekha Kumari", {
    gender: "Female",
    industry: "Mining",
    experience: "3–5 Years",
    safetyScore: 79,
    competencies: { hazardRecognition: 84, procedureAccuracy: 78, decisionMaking: 74, equipmentSelection: 80, reactionTime: 79 },
    modulesCompleted: ["fire"],
    certificates: [
      { code: "SA-1401K3", moduleId: "fire", score: 79, issueDate: daysAgo(178), status: "valid" },
    ],
    lastTrainingAt: daysAgo(178),
  }),
  mk("JH-W-11512", "Sunil Toppo", {
    gender: "Male",
    industry: "Maintenance",
    experience: "5+ Years",
    safetyScore: 86,
    competencies: { hazardRecognition: 90, procedureAccuracy: 84, decisionMaking: 83, equipmentSelection: 88, reactionTime: 85 },
    modulesCompleted: ["fire", "gas"],
    certificates: [
      { code: "SA-1512L8", moduleId: "fire", score: 88, issueDate: daysAgo(72), status: "valid" },
    ],
    lastTrainingAt: daysAgo(72),
  }),
  mk("JH-W-11623", "Geeta Devi", {
    gender: "Female",
    industry: "Steel",
    experience: "1–3 Years",
    safetyScore: 71,
    competencies: { hazardRecognition: 76, procedureAccuracy: 70, decisionMaking: 66, equipmentSelection: 71, reactionTime: 72 },
    modulesCompleted: ["fire"],
    certificates: [
      { code: "SA-1623M2", moduleId: "fire", score: 71, issueDate: daysAgo(296), status: "expiring" },
    ],
    lastTrainingAt: daysAgo(296),
  }),
  mk("JH-W-11734", "Arun Munda", {
    gender: "Male",
    industry: "Mining",
    experience: "3–5 Years",
    safetyScore: 82,
    competencies: { hazardRecognition: 87, procedureAccuracy: 80, decisionMaking: 78, equipmentSelection: 83, reactionTime: 82 },
    modulesCompleted: ["fire", "gas"],
    certificates: [
      { code: "SA-1734N7", moduleId: "fire", score: 83, issueDate: daysAgo(39), status: "valid" },
    ],
    lastTrainingAt: daysAgo(39),
  }),
  mk("JH-W-11845", "Meena Kumari", {
    gender: "Female",
    industry: "Manufacturing",
    experience: "5+ Years",
    safetyScore: 89,
    competencies: { hazardRecognition: 92, procedureAccuracy: 88, decisionMaking: 86, equipmentSelection: 90, reactionTime: 88 },
    modulesCompleted: ["fire", "gas"],
    certificates: [
      { code: "SA-1845P1", moduleId: "fire", score: 91, issueDate: daysAgo(1), status: "valid" },
    ],
    lastTrainingAt: daysAgo(1),
  }),
  mk("JH-W-11956", "Rajesh Oraon", {
    gender: "Male",
    industry: "Maintenance",
    experience: "1–3 Years",
    safetyScore: 63,
    competencies: { hazardRecognition: 68, procedureAccuracy: 60, decisionMaking: 58, equipmentSelection: 62, reactionTime: 67 },
    modulesCompleted: ["fire"],
    certificates: [
      { code: "SA-1956Q5", moduleId: "fire", score: 63, issueDate: daysAgo(225), status: "valid" },
    ],
    lastTrainingAt: daysAgo(225),
  }),
  mk("JH-W-12067", "Lakshmi Devi", {
    gender: "Female",
    industry: "Steel",
    experience: "3–5 Years",
    safetyScore: 85,
    competencies: { hazardRecognition: 89, procedureAccuracy: 84, decisionMaking: 82, equipmentSelection: 86, reactionTime: 84 },
    modulesCompleted: ["fire", "gas"],
    certificates: [
      { code: "SA-2067R9", moduleId: "fire", score: 87, issueDate: daysAgo(59), status: "valid" },
    ],
    lastTrainingAt: daysAgo(59),
  }),
  mk("JH-W-12178", "Birendra Singh", {
    gender: "Male",
    industry: "Mining",
    experience: "5+ Years",
    safetyScore: 78,
    competencies: { hazardRecognition: 82, procedureAccuracy: 77, decisionMaking: 74, equipmentSelection: 79, reactionTime: 78 },
    modulesCompleted: ["fire"],
    certificates: [
      { code: "SA-2178S3", moduleId: "fire", score: 78, issueDate: daysAgo(346), status: "expired" },
    ],
    lastTrainingAt: daysAgo(346),
  }),
  mk("JH-W-12289", "Sumitra Kumari", {
    gender: "Female",
    industry: "Manufacturing",
    experience: "1–3 Years",
    safetyScore: 70,
    competencies: { hazardRecognition: 75, procedureAccuracy: 68, decisionMaking: 64, equipmentSelection: 70, reactionTime: 73 },
    modulesCompleted: ["fire"],
    certificates: [
      { code: "SA-2289T6", moduleId: "fire", score: 70, issueDate: daysAgo(127), status: "valid" },
    ],
    lastTrainingAt: daysAgo(127),
  }),
];

export const DEMO_MODULES = [
  {
    id: "fire" as const,
    titleKey: "module.fire.title" as const,
    descKey: "module.fire.desc" as const,
    difficulty: "Intermediate",
    durationMinutes: 12,
    status: "active" as const,
    skills: ["Hazard Recognition", "Extinguisher Selection", "Evacuation"],
  },
  {
    id: "gas" as const,
    titleKey: "module.gas.title" as const,
    descKey: "module.gas.desc" as const,
    difficulty: "Intermediate",
    durationMinutes: 14,
    status: "active" as const,
    skills: ["Confined Space Awareness", "Buddy Protocol", "Safe Withdrawal"],
  },
  {
    id: "machine" as const,
    titleKey: "module.machine.title" as const,
    descKey: "module.machine.desc" as const,
    difficulty: "Intermediate",
    durationMinutes: 10,
    status: "active" as const,
    skills: ["Lockout-Tagout", "Machine Guarding", "Jam Clearing"],
  },
  {
    id: "ppe" as const,
    titleKey: "module.ppe.title" as const,
    descKey: "module.ppe.desc" as const,
    difficulty: "Beginner",
    durationMinutes: 8,
    status: "active" as const,
    skills: ["PPE Selection", "Hazard Matching"],
  },
  {
    id: "firstaid" as const,
    titleKey: "module.firstaid.title" as const,
    descKey: "module.firstaid.desc" as const,
    difficulty: "Advanced",
    durationMinutes: 15,
    status: "active" as const,
    skills: ["Scene Safety", "Casualty Check", "Recovery Position"],
  },
];
