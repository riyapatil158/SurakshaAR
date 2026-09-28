import { MissionClient } from "@/components/MissionClient";

export function MissionPageInner({ params }: { params: Promise<{ moduleId: string }> }) {
  return <MissionClient params={params} />;
}
