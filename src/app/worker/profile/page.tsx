import { WorkerShell } from "@/components/WorkerShell";
import { ProfileClient } from "@/components/ProfileClient";

export default function ProfilePage() {
  return (
    <WorkerShell>
      <ProfileClient />
    </WorkerShell>
  );
}
