import { HomeShell } from "@/components/HomeShell";
import { DEMO_WORKERS } from "@/lib/demo-data";
import { renderQRToSVG } from "@/lib/qr";
import { Logo } from "@/components/Logo";
import { CheckCircle2, XCircle, Calendar, Award, User } from "lucide-react";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { certificates, workers } from "@/db/schema";

export const dynamic = "force-dynamic";

const MODULE_TITLES: Record<string, string> = {
  fire: "Fire & Explosion Safety",
  gas: "Gas Leak & Confined Space",
  machine: "Machinery Safety",
  ppe: "PPE & Industrial Hazards",
  firstaid: "First Aid & Emergency",
};

type FoundCert = { code: string; moduleId: string; score: number; issueDate: string; status: string };

export default async function VerifyPage({ params }: { params: Promise<{ code: string }> }) {
  const { code: rawCode } = await params;
  const code = decodeURIComponent(rawCode).trim().toUpperCase();
  let foundWorker: { name: string } | null = null;
  let foundCert: FoundCert | null = null;

  // 1) Certificates issued in the app (stored in PostgreSQL)
  try {
    const rows = await db
      .select({
        code: certificates.verificationCode,
        moduleId: certificates.moduleId,
        score: certificates.score,
        issueDate: certificates.issueDate,
        status: certificates.status,
        workerName: workers.name,
      })
      .from(certificates)
      .innerJoin(workers, eq(certificates.workerId, workers.id))
      .where(eq(certificates.verificationCode, code))
      .limit(1);
    if (rows[0]) {
      foundCert = {
        code: rows[0].code,
        moduleId: rows[0].moduleId,
        score: rows[0].score,
        issueDate: rows[0].issueDate.toISOString(),
        status: rows[0].status,
      };
      foundWorker = { name: rows[0].workerName };
    }
  } catch (err) {
    console.error("Verification lookup failed", err);
  }

  // 2) Fall back to the demo dataset
  if (!foundCert) {
    for (const w of DEMO_WORKERS) {
      const c = w.certificates.find((cc) => cc.code === code);
      if (c) {
        foundWorker = w;
        foundCert = c;
        break;
      }
    }
  }

  let qrSvg = "";
  if (foundCert) {
    try {
      const h = await headers();
      const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
      const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
      qrSvg = await renderQRToSVG(`${proto}://${host}/verify/${foundCert.code}`, 180);
    } catch {
      qrSvg = "";
    }
  }

  return (
    <HomeShell>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <Logo />
          <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-white">Certificate Verification</h1>
          <p className="text-surface-300 text-sm mt-1">Public verification for SurakshaAR credentials.</p>
        </div>

        {foundCert && foundWorker ? (
          <div className="card p-6 sm:p-8">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-safe-500/10 border border-safe-500/40">
              <CheckCircle2 className="h-6 w-6 text-safe-400" />
              <div>
                <div className="font-bold text-white">Certificate Valid</div>
                <div className="text-sm text-surface-300">This certificate is authentic and currently active.</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Info icon={<User className="h-4 w-4" />} label="Worker" value={foundWorker.name} />
              <Info icon={<Award className="h-4 w-4" />} label="Certificate ID" value={foundCert.code} mono />
              <Info icon={<Award className="h-4 w-4" />} label="Training" value={MODULE_TITLES[foundCert.moduleId] ?? foundCert.moduleId} />
              <Info icon={<Award className="h-4 w-4" />} label="Score" value={`${foundCert.score}%`} />
              <Info icon={<Calendar className="h-4 w-4" />} label="Issued" value={new Date(foundCert.issueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric", timeZone: "Asia/Kolkata" })} />
              <Info icon={<Award className="h-4 w-4" />} label="Status" value={foundCert.status.toUpperCase()} accent />
            </div>

            {qrSvg && (
              <div className="mt-6 p-4 rounded-lg bg-surface-900/60 border border-surface-700 text-center">
                <div className="text-[10px] uppercase tracking-wider text-surface-400">Verification QR</div>
                <div className="mt-2 inline-block bg-white p-2 rounded" dangerouslySetInnerHTML={{ __html: qrSvg }} />
              </div>
            )}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <XCircle className="h-12 w-12 text-danger-500 mx-auto" />
            <h2 className="mt-3 text-xl font-bold text-white">Certificate Not Found</h2>
            <p className="mt-2 text-sm text-surface-300 max-w-md mx-auto">
              This verification code does not match any issued certificate.
              <span className="block font-mono mt-2 text-surface-200">{code}</span>
            </p>
          </div>
        )}
      </div>
    </HomeShell>
  );
}

function Info({ icon, label, value, mono, accent }: { icon: React.ReactNode; label: string; value: string; mono?: boolean; accent?: boolean }) {
  return (
    <div className="rounded-lg bg-surface-900/60 border border-surface-700 p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-surface-400">
        {icon} {label}
      </div>
      <div className={`mt-1 font-semibold ${mono ? "font-mono" : ""} ${accent ? "text-safe-400" : "text-white"}`}>
        {value}
      </div>
    </div>
  );
}
