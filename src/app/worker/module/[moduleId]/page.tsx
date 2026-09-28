import { WorkerShell } from "@/components/WorkerShell";
import { ModuleDetailClient } from "@/components/ModuleDetailClient";

export default async function ModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  return (
    <WorkerShell>
      <ModuleDetailClient moduleId={moduleId} />
    </WorkerShell>
  );
}
