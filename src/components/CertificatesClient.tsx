"use client";
import Link from "next/link";
import { useSession, useLang } from "@/components/SessionProvider";
import { t } from "@/lib/i18n";
import { Award, CheckCircle2, AlertTriangle, XCircle, ArrowRight } from "lucide-react";

export function CertificatesClient() {
  const { session } = useSession();
  const { lang } = useLang();
  const certs = session?.worker.certificates ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-white">{t(lang, "worker.certificates")}</h1>
      <p className="text-surface-300 text-sm mt-1">Your verifiable digital credentials.</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {certs.map((c) => {
          const icon = c.status === "valid" ? <CheckCircle2 className="h-4 w-4" /> : c.status === "expiring" ? <AlertTriangle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />;
          return (
            <Link key={c.code} href={`/worker/certificate?code=${c.code}`} className="card card-hover p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-brand-400" />
                  <div>
                    <div className="font-semibold text-white">
                      {t(lang, `module.${c.moduleId}.title`)}
                    </div>
                    <div className="text-xs text-surface-400 font-mono">{c.code}</div>
                  </div>
                </div>
                <span className={`tag ${c.status === "valid" ? "border-safe-500/40 bg-safe-500/10 text-safe-400" : c.status === "expiring" ? "border-amber-400/40 bg-amber-400/10 text-amber-400" : "border-danger-500/40 bg-danger-500/10 text-danger-500"}`}>
                  {icon} {c.status.toUpperCase()}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-surface-300">
                <span>Score: <span className="text-white font-bold">{c.score}%</span></span>
                <span>Issued: {new Date(c.issueDate).toLocaleDateString()}</span>
              </div>
              <div className="mt-3 text-xs text-brand-400 flex items-center gap-1">
                View certificate <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          );
        })}
        {certs.length === 0 && (
          <div className="col-span-full card p-10 text-center">
            <Award className="h-10 w-10 text-surface-400 mx-auto" />
            <div className="mt-3 text-lg font-semibold text-white">No certificates yet</div>
            <p className="mt-1 text-sm text-surface-300">Complete a training module to earn your first credential.</p>
            <Link href="/worker/modules" className="btn btn-primary mt-4">Browse Modules</Link>
          </div>
        )}
      </div>
    </div>
  );
}
