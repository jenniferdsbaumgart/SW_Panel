"use client";

import type { StageDefinition } from "@/types/stages";
import { useTeamsByStage } from "@/stores/panel-store";
import { StageLabel } from "./stage-label";
import { CardsCluster } from "@/components/cards/cards-cluster";

interface StageNodeProps {
  stage: StageDefinition;
}

export function StageNode({ stage }: StageNodeProps) {
  const teams = useTeamsByStage(stage.id);

  return (
    <div className="flex flex-col items-center gap-[12px]">
      <StageLabel stage={stage} teamCount={teams.length} />
      <CardsCluster teams={teams} />
    </div>
  );
}
