import { AdminShell } from "@/components/AdminShell";
import { ComplianceClient } from "@/components/ComplianceClient";

export default function AdminCompliancePage() {
  return (
    <AdminShell>
      <ComplianceClient />
    </AdminShell>
  );
}
