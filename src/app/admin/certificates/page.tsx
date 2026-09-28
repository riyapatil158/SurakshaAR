import { AdminShell } from "@/components/AdminShell";
import { DEMO_WORKERS } from "@/lib/demo-data";
import { Award, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export default function AdminCertificatesPage() {
  const allCerts = DEMO_WORKERS.flatMap((w) =>
    w.certificates.map((c) => ({ worker: w, cert: c }))
  );
  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Certificates</h1>
        <p className="text-surface-300 text-sm mt-1">{allCerts.length} certificates issued across the workforce.</p>
        <div className="mt-6 card overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-surface-400 border-b border-surface-700">
                <th className="py-2 px-3">Certificate ID</th>
                <th className="py-2 px-3">Worker</th>
                <th className="py-2 px-3">Module</th>
                <th className="py-2 px-3">Score</th>
                <th className="py-2 px-3">Issued</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Verify</th>
              </tr>
            </thead>
            <tbody>
              {allCerts.map(({ worker, cert }) => (
                <tr key={cert.code} className="border-b border-surface-800 hover:bg-surface-800/40 transition">
                  <td className="py-3 px-3 font-mono text-xs text-surface-200">{cert.code}</td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-white">{worker.name}</div>
                    <div className="text-xs text-surface-400">{worker.industry}</div>
                  </td>
                  <td className="py-3 px-3 text-surface-200">{cert.moduleId === "fire" ? "Fire & Explosion Safety" : "Gas Leak & Confined Space"}</td>
                  <td className="py-3 px-3 font-bold text-white">{cert.score}%</td>
                  <td className="py-3 px-3 text-xs text-surface-300">{new Date(cert.issueDate).toLocaleDateString()}</td>
                  <td className="py-3 px-3">
                    <span className={`tag ${cert.status === "valid" ? "border-safe-500/40 bg-safe-500/10 text-safe-400" : cert.status === "expiring" ? "border-amber-400/40 bg-amber-400/10 text-amber-400" : "border-danger-500/40 bg-danger-500/10 text-danger-500"}`}>
                      {cert.status === "valid" ? <CheckCircle2 className="h-3 w-3" /> : cert.status === "expiring" ? <AlertTriangle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {cert.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <a href={`/verify/${cert.code}`} target="_blank" rel="noreferrer" className="text-brand-400 text-xs hover:underline">
                      /verify/{cert.code}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
