import { HomeShell } from "@/components/HomeShell";
import { Logo } from "@/components/Logo";
import { AlertTriangle, Flame, Wind, HardHat, Phone } from "lucide-react";

export default function SafetyInformationPage() {
  return (
    <HomeShell>
      <div className="max-w-3xl mx-auto">
        <Logo />
        <h1 className="mt-6 text-3xl sm:text-4xl font-bold text-white">Safety Information</h1>
        <p className="text-surface-300 mt-3">
          Practical guidance for industrial workers in mining, steel, and manufacturing sectors.
        </p>

        <div className="mt-6 space-y-4">
          <Tip icon={<Flame className="h-5 w-5 text-brand-400" />} title="Electrical Fire">
            <ul className="list-disc list-inside space-y-1">
              <li>Raise the alarm immediately.</li>
              <li>Keep a safe distance from live equipment.</li>
              <li>Do not use water on electrical fires.</li>
              <li>Use CO₂ or dry-powder extinguishers if you are trained and authorized.</li>
              <li>Evacuate using marked routes and assemble at the safe zone.</li>
            </ul>
          </Tip>
          <Tip icon={<Wind className="h-5 w-5 text-info-500" />} title="Gas Leak / Confined Space">
            <ul className="list-disc list-inside space-y-1">
              <li>Stop and do not enter the confined space.</li>
              <li>Identify the gas hazard from a safe distance.</li>
              <li>Alert your buddy and the emergency team.</li>
              <li>Select breathing apparatus only if authorized.</li>
              <li>Withdraw upwind to the designated safe zone.</li>
            </ul>
          </Tip>
          <Tip icon={<HardHat className="h-5 w-5 text-amber-400" />} title="PPE">
            <ul className="list-disc list-inside space-y-1">
              <li>Helmet, safety goggles, reflective vest, gloves, and safety shoes are baseline requirements.</li>
              <li>Use hearing protection near high-decibel machinery.</li>
              <li>Inspect PPE before every shift.</li>
              <li>Replace damaged or expired equipment immediately.</li>
            </ul>
          </Tip>
          <Tip icon={<Phone className="h-5 w-5 text-safe-400" />} title="Emergency Contacts">
            <p>Contact your site safety officer or local emergency services. Keep your site's emergency numbers saved on your phone.</p>
          </Tip>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-amber-400/5 border border-amber-400/30 text-sm text-surface-200 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
          <div>
            This training simulator is an educational prototype and does not replace site-specific safety procedures,
            statutory requirements, qualified safety trainers, emergency response plans, or authorized industrial operating procedures.
          </div>
        </div>
      </div>
    </HomeShell>
  );
}

function Tip({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-surface-900/60 border border-surface-700 flex items-center justify-center">
          {icon}
        </div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
      </div>
      <div className="mt-3 text-sm text-surface-200 leading-relaxed">{children}</div>
    </div>
  );
}
