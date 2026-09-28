import { AdminShell } from "@/components/AdminShell";
import { AdminWorkerDetailClient } from "@/components/AdminWorkerDetailClient";

export default async function AdminWorkerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AdminShell>
      <AdminWorkerDetailClient workerId={id} />
    </AdminShell>
  );
}
