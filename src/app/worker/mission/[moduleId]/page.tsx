import { WorkerShell } from "@/components/WorkerShell";
import { MissionClient } from "@/components/MissionClient";

export default function MissionPage({ params }: { params: Promise<{ moduleId: string }> }) {
  return (
    <WorkerShell>
      <MissionPageInner params={params} />
    </WorkerShell>
  );
}

import { MissionPageInner } from "@/components/MissionPageInner";
