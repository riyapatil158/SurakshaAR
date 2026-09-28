import { AdminShell } from "@/components/AdminShell";
import { AdminDashboardClient } from "@/components/AdminDashboardClient";

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <AdminDashboardClient />
    </AdminShell>
  );
}
