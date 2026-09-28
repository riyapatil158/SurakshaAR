import { AdminShell } from "@/components/AdminShell";
import { AdminWorkersClient } from "@/components/AdminWorkersClient";

export default function AdminWorkersPage() {
  return (
    <AdminShell>
      <AdminWorkersClient />
    </AdminShell>
  );
}
