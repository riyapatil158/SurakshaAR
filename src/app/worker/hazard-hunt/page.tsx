import { WorkerShell } from "@/components/WorkerShell";
import { HazardHuntClient } from "@/components/HazardHuntClient";

export default function HazardHuntPage() {
  return (
    <WorkerShell>
      <HazardHuntClient />
    </WorkerShell>
  );
}
