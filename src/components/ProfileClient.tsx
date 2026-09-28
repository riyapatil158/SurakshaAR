"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, useLang } from "@/components/SessionProvider";
import { t, LANGUAGES } from "@/lib/i18n";
import { LogOut, Globe, Shield, Calendar, Factory } from "lucide-react";

export function ProfileClient() {
  const { session, logout, setLang } = useSession();
  const { lang } = useLang();
  const router = useRouter();
  const w = session?.worker;
  if (!w) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-white">{t(lang, "worker.nav.profile")}</h1>

      <div className="mt-6 card p-6">
        <div className="flex items-center gap-4">
          <div className={`h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold ${
            w.gender === "Female" ? "bg-pink-500/20 text-pink-300 border-2 border-pink-500/30" : "bg-brand-500/20 text-brand-400 border-2 border-brand-500/30"
          }`}>
            {w.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
          <div>
            <div className="text-xl font-bold text-white">{w.name}</div>
            <div className="text-sm text-surface-300 font-mono">{w.id}</div>
            <div className="mt-1 flex items-center gap-2 text-xs text-surface-400">
              <Factory className="h-3.5 w-3.5" /> {w.industry}
              <Shield className="h-3.5 w-3.5 ml-2" /> Score {w.safetyScore}
            </div>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
          <Detail icon={<Factory className="h-4 w-4" />} label="Industry" value={w.industry} />
          <Detail icon={<Calendar className="h-4 w-4" />} label="Experience" value={w.experience} />
          <Detail icon={<Shield className="h-4 w-4" />} label="Age Group" value={w.ageGroup} />
          <Detail icon={<Shield className="h-4 w-4" />} label="Gender" value={w.gender} />
        </dl>
      </div>

      <div className="mt-4 card p-6">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Globe className="h-4 w-4" /> Language
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`p-3 rounded-lg border text-sm transition ${
                lang === l.code
                  ? "border-brand-500 bg-brand-500/10 text-white"
                  : "border-surface-700 bg-surface-800/40 text-surface-200 hover:border-surface-500"
              }`}
            >
              <div className="font-semibold">{l.native}</div>
              <div className="text-[10px] text-surface-400 uppercase">{l.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 card p-6">
        <h3 className="text-white font-semibold mb-2">Safety Disclaimer</h3>
        <p className="text-xs text-surface-300 leading-relaxed">{t(lang, "disclaimer")}</p>
      </div>

      <button
        onClick={() => {
          logout();
          router.push("/");
        }}
        className="btn btn-danger mt-4 w-full"
      >
        <LogOut className="h-4 w-4" /> Sign Out
      </button>
    </div>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-900/60 border border-surface-700 p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-surface-400">
        {icon} {label}
      </div>
      <div className="mt-1 font-semibold text-white">{value}</div>
    </div>
  );
}
