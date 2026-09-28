import { WorkerShell } from "@/components/WorkerShell";
import { ModulesClient } from "@/components/ModulesClient";

export default function ModulesPage() {
  return (
    <WorkerShell>
      <ModulesClient />
    </WorkerShell>
  );
}
