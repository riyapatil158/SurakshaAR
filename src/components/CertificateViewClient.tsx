"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession, useLang } from "@/components/SessionProvider";
import { t } from "@/lib/i18n";
import { renderQRToDataURL } from "@/lib/qr";
import { Logo } from "@/components/Logo";
import { Download, Printer, ArrowLeft, CheckCircle2 } from "lucide-react";

export function CertificateViewClient() {
  const params = useSearchParams();
  const code = params.get("code") || "";
  const { session } = useSession();
  const { lang } = useLang();
  const [qrUrl, setQrUrl] = useState<string>("");
  const printRef = useRef<HTMLDivElement>(null);

  // Look in the worker's certificates and in newly issued ones
  const allCerts = [...(session?.worker.certificates ?? []), ...(session?.certificates ?? [])];
  const cert = allCerts.find((c) => c.code === code) ?? allCerts[0];
  const worker = session?.worker;

  // "Today" is computed on the client each time the page is opened / downloaded
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => {
    setToday(new Date());
    const onBeforePrint = () => setToday(new Date());
    window.addEventListener("beforeprint", onBeforePrint);
    return () => window.removeEventListener("beforeprint", onBeforePrint);
  }, []);
  const fmt = (d: Date | string) =>
    new Date(d).toLocaleDateString(lang === "en" ? "en-IN" : "hi-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  useEffect(() => {
    if (!cert || !worker) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "https://surakshaar.app";
    const url = `${origin}/verify/${cert.code}`;
    renderQRToDataURL(url, 300)
      .then((dataUrl) => {
        if (dataUrl && dataUrl.startsWith("data:image")) {
          setQrUrl(dataUrl);
        } else {
          setQrUrl("");
        }
      })
      .catch(() => setQrUrl(""));
  }, [cert, worker]);

  if (!cert || !worker) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <div className="card p-8">
          <div className="text-surface-300">Certificate not found.</div>
          <Link href="/worker/certificates" className="btn btn-primary mt-4">Back</Link>
        </div>
      </div>
    );
  }

  const titleKey: Record<string, string> = {
    fire: "module.fire.title",
    gas: "module.gas.title",
    machine: "module.machine.title",
    ppe: "module.ppe.title",
    firstaid: "module.firstaid.title",
  };
  const title = t(lang, titleKey[cert.moduleId] ?? "module.fire.title");

  const doPrint = () => {
    setToday(new Date());
    setTimeout(() => window.print(), 50);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <Link href="/worker/certificates" className="inline-flex items-center gap-2 text-surface-300 hover:text-white text-sm mb-4 print:hidden">
        <ArrowLeft className="h-4 w-4" /> Back to certificates
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Certificate</h1>
          <p className="text-surface-300 text-sm mt-1 font-mono">{cert.code}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={doPrint} className="btn btn-secondary text-xs">
            <Printer className="h-4 w-4" /> Print
          </button>
          <button onClick={doPrint} className="btn btn-primary text-xs">
            <Download className="h-4 w-4" /> Download PDF
          </button>
        </div>
      </div>

      <div ref={printRef} className="print:shadow-none">
        <div className="relative rounded-2xl overflow-hidden border-4 border-double border-brand-500/40 bg-gradient-to-br from-surface-900 via-surface-850 to-surface-900 p-6 sm:p-10">
          {/* Decorative corners */}
          <div className="absolute top-3 left-3 h-8 w-8 border-t-2 border-l-2 border-brand-500/60" />
          <div className="absolute top-3 right-3 h-8 w-8 border-t-2 border-r-2 border-brand-500/60" />
          <div className="absolute bottom-3 left-3 h-8 w-8 border-b-2 border-l-2 border-brand-500/60" />
          <div className="absolute bottom-3 right-3 h-8 w-8 border-b-2 border-r-2 border-brand-500/60" />

          <div className="flex items-center justify-between flex-wrap gap-3">
            <Logo />
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-surface-400">Certificate ID</div>
              <div className="font-mono text-white">{cert.code}</div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="text-[11px] uppercase tracking-[0.3em] text-brand-400">SurakshaAR</div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
              {t(lang, "certificate.title")}
            </h2>
            <div className="mt-6 text-surface-300 text-sm">{t(lang, "certificate.issuedTo")}</div>
            <div className="mt-1 text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "Georgia, serif" }}>
              {worker.name}
            </div>
            <div className="mt-1 text-xs text-surface-400">{worker.id} · {worker.industry}</div>
            <div className="mt-6 text-surface-300 text-sm">{t(lang, "certificate.completed")}</div>
            <div className="mt-1 text-xl font-semibold text-brand-400">{title}</div>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <Stat label={t(lang, "certificate.score")} value={`${cert.score}%`} />
            <Stat label={t(lang, "certificate.status")} value={t(lang, "certificate.valid")} accent />
            <Stat label={t(lang, "certificate.issued")} value={fmt(cert.issueDate)} />
            <Stat label={t(lang, "certificate.downloadedOn")} value={today ? fmt(today) : "—"} />
          </div>

          <div className="mt-8 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-surface-400">{t(lang, "certificate.signature")}</div>
              <div className="mt-1 border-t border-surface-600 pt-1 text-sm text-surface-200 italic" style={{ fontFamily: "cursive" }}>
                {t(lang, "certificate.director")}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider text-surface-400">{t(lang, "certificate.scanToVerify")}</div>
                <a
                  href={typeof window !== "undefined" ? `${window.location.origin}/verify/${cert.code}` : `/verify/${cert.code}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-xs text-brand-400 hover:underline mt-1 font-mono"
                >
                  /verify/{cert.code}
                </a>
              </div>
              {qrUrl ? (
                <a
                  href={typeof window !== "undefined" ? `${window.location.origin}/verify/${cert.code}` : `/verify/${cert.code}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={qrUrl} alt="Verification QR" className="h-24 w-24 rounded-md bg-white p-1 hover:scale-105 transition" />
                </a>
              ) : (
                <a
                  href={`/verify/${cert.code}`}
                  target="_blank"
                  rel="noreferrer"
                  className="h-24 w-24 rounded-md bg-surface-800 border border-surface-700 flex items-center justify-center text-surface-400 text-xs hover:border-brand-500 transition text-center p-2"
                >
                  Open Verification →
                </a>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-surface-700 flex items-center justify-center gap-2 text-xs text-surface-400">
            <CheckCircle2 className="h-3.5 w-3.5 text-safe-400" /> Digitally issued and verifiable
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg bg-surface-900/60 border border-surface-700 p-3">
      <div className="text-[10px] uppercase tracking-wider text-surface-400">{label}</div>
      <div className={`text-xl font-bold mt-1 ${accent ? "text-safe-400" : "text-white"}`}>{value}</div>
    </div>
  );
}
