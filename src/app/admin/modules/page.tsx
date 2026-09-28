import { AdminShell } from "@/components/AdminShell";
import { DEMO_MODULES } from "@/lib/demo-data";
import { Flame, Wind, Cog, HardHat, HeartPulse, Lock } from "lucide-react";

export default function AdminModulesPage() {
  const icons = { fire: Flame, gas: Wind, machine: Cog, ppe: HardHat, firstaid: HeartPulse };
  const colors: Record<string, string> = {
    fire: "text-brand-400 bg-brand-500/15 border-brand-500/30",
    gas: "text-info-500 bg-info-500/15 border-info-500/30",
    machine: "text-amber-400 bg-amber-400/15 border-amber-400/30",
    ppe: "text-safe-400 bg-safe-500/15 border-safe-500/30",
    firstaid: "text-danger-500 bg-danger-500/15 border-danger-500/30",
  };
  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Modules</h1>
        <p className="text-surface-300 text-sm mt-1">Manage safety training modules and content.</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEMO_MODULES.map((m) => {
            const Icon = icons[m.id as keyof typeof icons] ?? Cog;
            return (
              <div key={m.id} className="card p-5">
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-lg border flex items-center justify-center ${colors[m.id]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white">{m.titleKey.replace("module.", "").replace(".title", "").replace(/^\w/, (c) => c.toUpperCase())} · {m.titleKey === "module.fire.title" ? "Fire & Explosion Safety" : m.titleKey === "module.gas.title" ? "Gas Leak & Confined Space" : m.titleKey === "module.machine.title" ? "Machinery Safety" : m.titleKey === "module.ppe.title" ? "PPE & Industrial Hazards" : "First Aid & Emergency"}</h3>
                      <span className={`tag ${m.status === "active" ? "border-safe-500/40 bg-safe-500/10 text-safe-400" : "border-surface-600 bg-surface-700/40 text-surface-300"}`}>
                        {m.status === "active" ? "Active" : "Coming Soon"}
                      </span>
                    </div>
                    <p className="text-sm text-surface-300 mt-1">{m.descKey === "module.fire.desc" ? "Electrical fire response, extinguisher selection, alarm activation, and evacuation procedures." : m.descKey === "module.gas.desc" ? "Hazard recognition, atmospheric awareness, buddy protocol, and safe withdrawal." : m.descKey === "module.machine.desc" ? "Lockout-tagout, entanglement prevention, and machine guarding." : m.descKey === "module.ppe.desc" ? "Personal protective equipment selection and hazard-specific protocols." : "Immediate response, casualty care, and incident reporting."}</p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-surface-400">
                      <span>{m.durationMinutes} min</span>
                      <span>·</span>
                      <span>{m.difficulty}</span>
                      <span>·</span>
                      <span>{m.skills.length} skills</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminShell>
  );
}
