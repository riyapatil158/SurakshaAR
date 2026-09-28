import { HomeShell } from "@/components/HomeShell";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Camera, Globe2, Award, Target, Search, RefreshCw, ShieldCheck, QrCode } from "lucide-react";

export default function SolutionPage() {
  const innovations = [
    { icon: Camera, title: "AR + 3D Training", desc: "Camera AR with automatic 3D simulation fallback ensures training works on every device." },
    { icon: Target, title: "Safety Mission Mode", desc: "Workers perform a sequence of realistic safety actions instead of answering static MCQs." },
    { icon: Search, title: "Hazard Hunt", desc: "Timed hazard-recognition drills build situational awareness." },
    { icon: RefreshCw, title: "Adaptive Refresher", desc: "Weighted competency scoring identifies weak skills and recommends targeted practice." },
    { icon: Award, title: "Digital Certificates", desc: "Printable, professional credentials issued automatically upon passing." },
    { icon: QrCode, title: "QR Verification", desc: "Every certificate has a unique verification URL accessible via QR code." },
    { icon: Globe2, title: "Hindi + Santali", desc: "Localized interface for a diverse workforce across Jharkhand." },
    { icon: ShieldCheck, title: "Admin Compliance", desc: "Supervisors monitor workforce readiness with real-time analytics." },
  ];

  return (
    <HomeShell>
      <div className="max-w-5xl mx-auto">
        <Logo />
        <h1 className="mt-6 text-3xl sm:text-4xl font-bold text-white">Solution Architecture</h1>
        <p className="text-surface-300 mt-3 max-w-2xl">
          A mobile-first PWA combining React Three Fiber simulations, deterministic assessment, and digital credentialing.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {innovations.map((i) => (
            <div key={i.title} className="card card-hover p-5">
              <div className="h-10 w-10 rounded-lg bg-brand-500/15 border border-brand-500/30 flex items-center justify-center">
                <i.icon className="h-5 w-5 text-brand-400" />
              </div>
              <div className="mt-3 font-bold text-white">{i.title}</div>
              <p className="text-sm text-surface-300 mt-1">{i.desc}</p>
            </div>
          ))}
        </div>

        <section className="mt-10 card p-6">
          <h2 className="text-xl font-bold text-white">Technology Stack</h2>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <StackItem label="Frontend" value="Next.js 16 + React 19" />
            <StackItem label="3D Engine" value="Three.js + React Three Fiber + Drei" />
            <StackItem label="Styling" value="Tailwind CSS v4" />
            <StackItem label="Charts" value="Recharts" />
            <StackItem label="QR" value="qrcode (OSS)" />
            <StackItem label="Database" value="PostgreSQL + Drizzle ORM" />
            <StackItem label="Storage" value="LocalStorage + PostgreSQL" />
            <StackItem label="Icons" value="Lucide React" />
            <StackItem label="Hosting" value="Any Node.js 18+ platform" />
          </div>
        </section>

        <section className="mt-4 card p-6">
          <h2 className="text-xl font-bold text-white">Assessment Algorithm</h2>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <StackItem label="Hazard Recognition" value="25%" />
            <StackItem label="Procedure Accuracy" value="25%" />
            <StackItem label="Decision Making" value="20%" />
            <StackItem label="Equipment Selection" value="15%" />
            <StackItem label="Reaction Time" value="10%" />
            <StackItem label="Mission Completion" value="5%" />
          </div>
          <p className="text-xs text-surface-400 mt-3">
            All scores are deterministic — they are computed from the worker's actual actions and timing, never randomized.
          </p>
        </section>

        <section className="mt-4 card p-6">
          <h2 className="text-xl font-bold text-white">Roadmap</h2>
          <ul className="mt-3 space-y-2 text-surface-200 text-sm list-disc list-inside">
            <li>AI-powered personalized learning (planned)</li>
            <li>Device-to-device training sync</li>
            <li>Video proctoring for high-stakes certification</li>
            <li>Additional industrial modules (Machinery, PPE, First Aid)</li>
            <li>Advanced AR spatial tracking (WebXR where supported)</li>
            <li>BLE / IoT smart extinguisher hardware integration</li>
          </ul>
        </section>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/language" className="btn btn-primary">Try Training <ShieldCheck className="h-4 w-4" /></Link>
          <Link href="/admin" className="btn btn-secondary">Admin Demo</Link>
        </div>
      </div>
    </HomeShell>
  );
}

function StackItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-900/60 border border-surface-700 p-3">
      <div className="text-[10px] uppercase tracking-wider text-surface-400">{label}</div>
      <div className="mt-1 font-semibold text-white">{value}</div>
    </div>
  );
}
