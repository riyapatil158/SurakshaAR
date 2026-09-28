"use client";
import Link from "next/link";
import dynamic from "next/dynamic";

const HeroScene = dynamic(
  () => import("@/components/IndustrialScene").then((m) => {
    const Comp = () => <m.IndustrialScene preset="hero" fireActive autoRotate className="absolute inset-0" />;
    return Comp;
  }),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center text-surface-400 text-sm">
        <span className="h-2 w-2 rounded-full bg-brand-500 warning-blink mr-2" /> Loading 3D environment…
      </div>
    ),
  }
);
import { Logo } from "@/components/Logo";
import { Shield, Camera, Globe2, Award, ArrowRight, Play } from "lucide-react";

import { useLang } from "@/components/SessionProvider";
import { t } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/SessionProvider";
import { DEMO_WORKERS } from "@/lib/demo-data";

export default function HomePage() {
  const { lang } = useLang();
  const router = useRouter();
  const { selectWorker } = useSession();

  const startJudgeDemo = () => {
    selectWorker(DEMO_WORKERS[0]); // Ramesh Kumar
    router.push("/worker");
  };

  return (
    <>
      {/* Hero */}
      <section className="relative rounded-2xl overflow-hidden border border-surface-700/60">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[560px]">
          <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-center relative z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white">
              {t(lang, "welcome.headline")}
            </h1>
            <p className="mt-4 text-surface-200 text-base sm:text-lg max-w-xl">
              {t(lang, "welcome.description")}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/language" className="btn btn-primary !px-6 !py-3 text-sm">
                <Play className="h-4 w-4" />
                {t(lang, "welcome.start")}
              </Link>
              <Link href="/worker/modules" className="btn btn-secondary !px-6 !py-3 text-sm">
                {t(lang, "welcome.explore")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button onClick={startJudgeDemo} className="btn btn-ghost !px-6 !py-3 text-sm">
                {t(lang, "welcome.judgeDemo")}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-xs text-surface-300">
              <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-brand-400" /> Certified</div>
              <div className="flex items-center gap-2"><Camera className="h-4 w-4 text-brand-400" /> AR + 3D</div>
              <div className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-brand-400" /> हिन्दी · संताली</div>
            </div>
          </div>
          <div className="relative min-h-[360px] lg:min-h-0 bg-surface-900 overflow-hidden">
            <HeroScene />
            <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-surface-600 bg-surface-900/70 backdrop-blur px-3 py-1 text-xs text-surface-200">
              <span className="h-2 w-2 rounded-full bg-brand-500 warning-blink" />
              LIVE 3D · {t(lang, "welcome.scene.title")}
            </div>
            <div className="pointer-events-none absolute right-4 bottom-4 card px-3 py-2 text-xs text-surface-200">
              <div className="text-surface-400 text-[10px] uppercase tracking-wider">360°</div>
              <div className="font-semibold text-white">{t(lang, "common.dragPinch").split("·")[0].trim()}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Capability cards */}
      <section className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { icon: Camera, key: "welcome.capabilities.ar", desc: "Camera AR with 3D simulation fallback" },
          { icon: Globe2, key: "welcome.capabilities.lang", desc: "Localized UX for diverse workforce" },
          { icon: Award, key: "welcome.capabilities.cert", desc: "QR-verified digital credentials" },
        ].map((c) => (
          <div key={c.key} className="card card-hover p-4 sm:p-5">
            <div className="h-9 w-9 rounded-lg bg-brand-500/15 border border-brand-500/30 flex items-center justify-center">
              <c.icon className="h-5 w-5 text-brand-400" />
            </div>
            <div className="mt-3 text-white font-semibold text-sm sm:text-base">{t(lang, c.key)}</div>
            <div className="mt-1 text-xs text-surface-300 line-clamp-2">{c.desc}</div>
          </div>
        ))}
      </section>

      {/* Modules preview */}
      <section className="mt-12">
        <div className="flex items-end justify-between flex-wrap gap-3 mb-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Safety Training Modules</h2>
            <p className="text-surface-300 text-sm mt-1">Interactive missions with real-time feedback.</p>
          </div>
          <Link href="/worker/modules" className="btn btn-secondary text-xs">
            View all modules <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/worker/module/fire" className="card card-hover p-5 group">
            <div className="flex items-center justify-between">
              <div className="tag border-brand-500/40 bg-brand-500/10 text-brand-400">01 · Active</div>
              <div className="text-xs text-surface-400">12 min</div>
            </div>
            <h3 className="mt-3 text-xl font-bold text-white">Fire & Explosion Safety</h3>
            <p className="mt-2 text-sm text-surface-300">
              Electrical fire response, extinguisher selection, alarm activation, and evacuation procedures.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-brand-400 text-sm font-semibold group-hover:gap-3 transition-all">
              Start mission <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
          <Link href="/worker/module/gas" className="card card-hover p-5 group">
            <div className="flex items-center justify-between">
              <div className="tag border-info-500/40 bg-info-500/10 text-info-500">02 · Active</div>
              <div className="text-xs text-surface-400">14 min</div>
            </div>
            <h3 className="mt-3 text-xl font-bold text-white">Gas Leak & Confined Space</h3>
            <p className="mt-2 text-sm text-surface-300">
              Hazard recognition, atmospheric awareness, buddy protocol, and safe withdrawal.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-info-500 text-sm font-semibold group-hover:gap-3 transition-all">
              Start mission <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </div>
      </section>

      {/* Impact */}
      <section className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { v: "20+", l: "Demo workers" },
          { v: "2", l: "Active modules" },
          { v: "3", l: "Languages" },
          { v: "QR", l: "Verification" },
        ].map((s) => (
          <div key={s.l} className="card p-4 text-center">
            <div className="text-3xl font-bold text-white">{s.v}</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-surface-300">{s.l}</div>
          </div>
        ))}
      </section>
    </>
  );
}
