// Shared configuration for every playable training module.
// Used by the mission game engine, the module detail page and the in-scene object guide.

export type ModuleId = "fire" | "gas" | "machine" | "ppe" | "firstaid";

export type ModuleConfig = {
  id: ModuleId;
  number: string;
  titleKey: string;
  descKey: string;
  objectiveKey: string;
  durationMinutes: number;
  difficulty: string;
  accent: "brand" | "info" | "amber" | "safe" | "danger";
  /** Ordered step keys */
  steps: string[];
  /** i18n key for each step label */
  stepLabel: Record<string, string>;
  /** i18n key for the success feedback of each step */
  stepFeedback: Record<string, string>;
  /** Which 3D object completes each step */
  stepObject: Record<string, string>;
  /** Steps must be completed in order (PPE can be worn in any order) */
  ordered: boolean;
  /** Tapping these objects is an unsafe/wrong choice */
  wrongObjects: Record<string, { feedback: string; equipment?: boolean }>;
  /** Feedback when an already-used object is tapped again unsafely */
  repeatWrong?: Record<string, string>;
  /** Competency mapping for the scoring engine */
  hazardSteps: string[];
  equipmentSteps: string[];
  /** Objects shown in the scene guide (interactive first, then environment) */
  interactiveObjects: string[];
  environmentObjects: string[];
};

export const MODULE_CONFIGS: Record<ModuleId, ModuleConfig> = {
  fire: {
    id: "fire",
    number: "01",
    titleKey: "module.fire.title",
    descKey: "module.fire.desc",
    objectiveKey: "fire.objective",
    durationMinutes: 12,
    difficulty: "Intermediate",
    accent: "brand",
    steps: ["alarm", "extinguisher", "distance", "exit", "safe"],
    stepLabel: {
      alarm: "fire.step.alarm",
      extinguisher: "fire.step.extinguisher",
      distance: "fire.step.keepDistance",
      exit: "fire.step.exit",
      safe: "fire.step.safe",
    },
    stepFeedback: {
      alarm: "fire.feedback.alarm",
      extinguisher: "fire.feedback.co2",
      distance: "fire.feedback.distance",
      exit: "fire.feedback.exit",
      safe: "fire.feedback.safe",
    },
    stepObject: { alarm: "alarm", extinguisher: "extinguisher", distance: "panel", exit: "exit", safe: "safe" },
    ordered: true,
    wrongObjects: {
      water: { feedback: "fire.feedback.water", equipment: true },
      foam: { feedback: "fire.feedback.foam", equipment: true },
    },
    repeatWrong: { panel: "fire.feedback.close" },
    hazardSteps: ["alarm", "distance"],
    equipmentSteps: ["extinguisher"],
    interactiveObjects: ["alarm", "water", "foam", "extinguisher", "panel", "exit", "safe"],
    environmentObjects: ["worker", "machine", "rack", "barrier", "cone", "sign_electric"],
  },
  gas: {
    id: "gas",
    number: "02",
    titleKey: "module.gas.title",
    descKey: "module.gas.desc",
    objectiveKey: "gas.objective",
    durationMinutes: 14,
    difficulty: "Intermediate",
    accent: "info",
    steps: ["stop", "assess", "alert", "protect", "safe"],
    stepLabel: {
      stop: "gas.step.stop",
      assess: "gas.step.assess",
      alert: "gas.step.alert",
      protect: "gas.step.protect",
      safe: "gas.step.withdraw",
    },
    stepFeedback: {
      stop: "gas.feedback.stop",
      assess: "gas.feedback.assess",
      alert: "gas.feedback.alert",
      protect: "gas.feedback.protect",
      safe: "gas.feedback.withdraw",
    },
    stepObject: { stop: "barrier", assess: "detector", alert: "radio", protect: "scba", safe: "safe" },
    ordered: true,
    wrongObjects: { entry: { feedback: "gas.feedback.enter" } },
    hazardSteps: ["stop", "assess"],
    equipmentSteps: ["protect"],
    interactiveObjects: ["barrier", "entry", "detector", "radio", "scba", "safe"],
    environmentObjects: ["gascloud", "cylinders", "buddy", "worker", "windsock", "cone"],
  },
  machine: {
    id: "machine",
    number: "03",
    titleKey: "module.machine.title",
    descKey: "module.machine.desc",
    objectiveKey: "machine.objective",
    durationMinutes: 10,
    difficulty: "Intermediate",
    accent: "amber",
    steps: ["stop", "power", "lock", "clear", "test"],
    stepLabel: {
      stop: "machine.step.stop",
      power: "machine.step.power",
      lock: "machine.step.lock",
      clear: "machine.step.clear",
      test: "machine.step.test",
    },
    stepFeedback: {
      stop: "machine.feedback.stop",
      power: "machine.feedback.power",
      lock: "machine.feedback.lock",
      clear: "machine.feedback.clear",
      test: "machine.feedback.test",
    },
    stepObject: { stop: "stop", power: "power", lock: "lock", clear: "clear", test: "test" },
    ordered: true,
    wrongObjects: { rollers: { feedback: "machine.feedback.rollers" } },
    hazardSteps: ["stop"],
    equipmentSteps: ["power", "lock"],
    interactiveObjects: ["stop", "power", "lock", "clear", "rollers", "test"],
    environmentObjects: ["conveyor", "worker", "toolbox", "sign_moving", "cone"],
  },
  ppe: {
    id: "ppe",
    number: "04",
    titleKey: "module.ppe.title",
    descKey: "module.ppe.desc",
    objectiveKey: "ppe.objective",
    durationMinutes: 8,
    difficulty: "Beginner",
    accent: "safe",
    steps: ["helmet", "goggles", "earmuffs", "vest", "gloves"],
    stepLabel: {
      helmet: "ppe.step.helmet",
      goggles: "ppe.step.goggles",
      earmuffs: "ppe.step.earmuffs",
      vest: "ppe.step.vest",
      gloves: "ppe.step.gloves",
    },
    stepFeedback: {
      helmet: "ppe.feedback.helmet",
      goggles: "ppe.feedback.goggles",
      earmuffs: "ppe.feedback.earmuffs",
      vest: "ppe.feedback.vest",
      gloves: "ppe.feedback.gloves",
    },
    stepObject: { helmet: "helmet", goggles: "goggles", earmuffs: "earmuffs", vest: "vest", gloves: "gloves" },
    ordered: false,
    wrongObjects: {
      sandals: { feedback: "ppe.feedback.sandals", equipment: true },
      cap: { feedback: "ppe.feedback.cap", equipment: true },
    },
    hazardSteps: ["goggles", "earmuffs"],
    equipmentSteps: ["helmet", "goggles", "earmuffs", "vest", "gloves"],
    interactiveObjects: ["helmet", "goggles", "earmuffs", "vest", "gloves", "sandals", "cap"],
    environmentObjects: ["trainee", "ppe_bench", "noisy", "dust", "sign_ppe"],
  },
  firstaid: {
    id: "firstaid",
    number: "05",
    titleKey: "module.firstaid.title",
    descKey: "module.firstaid.desc",
    objectiveKey: "firstaid.objective",
    durationMinutes: 12,
    difficulty: "Intermediate",
    accent: "danger",
    steps: ["danger", "response", "call", "kit", "care"],
    stepLabel: {
      danger: "firstaid.step.danger",
      response: "firstaid.step.response",
      call: "firstaid.step.call",
      kit: "firstaid.step.kit",
      care: "firstaid.step.care",
    },
    stepFeedback: {
      danger: "firstaid.feedback.danger",
      response: "firstaid.feedback.response",
      call: "firstaid.feedback.call",
      kit: "firstaid.feedback.kit",
      care: "firstaid.feedback.care",
    },
    stepObject: { danger: "power", response: "casualty", call: "phone", kit: "kit", care: "casualty" },
    ordered: true,
    wrongObjects: { cable: { feedback: "firstaid.feedback.cable" } },
    hazardSteps: ["danger", "response"],
    equipmentSteps: ["kit"],
    interactiveObjects: ["power", "cable", "casualty", "phone", "kit"],
    environmentObjects: ["coworker", "machine", "sign_firstaid", "cone"],
  },
};

export const MODULE_ORDER: ModuleId[] = ["fire", "gas", "machine", "ppe", "firstaid"];

export function isModuleId(id: string): id is ModuleId {
  return id in MODULE_CONFIGS;
}
