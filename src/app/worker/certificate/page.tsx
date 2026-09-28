import { WorkerShell } from "@/components/WorkerShell";
import { CertificateViewClient } from "@/components/CertificateViewClient";

export default function CertificatePage() {
  return (
    <WorkerShell>
      <CertificateViewClient />
    </WorkerShell>
  );
}
