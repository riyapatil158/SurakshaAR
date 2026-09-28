import { WorkerShell } from "@/components/WorkerShell";
import { WorkerHomeClient } from "@/components/WorkerHomeClient";

export default function WorkerHomePage() {
  return (
    <WorkerShell>
      <WorkerHomeClient />
    </WorkerShell>
  );
}
