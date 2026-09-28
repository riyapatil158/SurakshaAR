import { WorkerShell } from "@/components/WorkerShell";
import { CertificatesClient } from "@/components/CertificatesClient";

export default function CertificatesPage() {
  return (
    <WorkerShell>
      <CertificatesClient />
    </WorkerShell>
  );
}
