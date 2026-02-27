"use client";

import { useState } from "react";
import { usePanelStore } from "@/stores/panel-store";
import { useShallow } from "zustand/react/shallow";
import { STAGE_MAP } from "@/lib/constants";
import type { TeamState, VisualState } from "@/types/state";
import type { CelebrationType } from "@/types/stages";
import { CelebrationTrigger } from "./celebration-trigger";

const VISUAL_STATE_BADGE: Record<
  VisualState,
  { label: string; className: string }
> = {
  active: {
    label: "Ativa",
    className: "bg-violet text-white",
  },
  waiting: {
    label: "Aguardando",
    className: "bg-lime text-night",
  },
  celebrating: {
    label: "Celebrando",
    className: "bg-white text-night",
  },
  pivoting: {
    label: "Pivotando",
    className: "bg-indigo text-white",
  },
  pivoted: {
    label: "Pivotada",
    className: "bg-indigo text-white",
  },
  hero: {
    label: "HERO",
    className: "bg-gold text-night",
  },
};

export function TeamList() {
  const teams = usePanelStore(
    useShallow((s) => Object.values(s.teams))
  );

  const [celebrationTarget, setCelebrationTarget] = useState<{
    teamId: string;
    teamName: string;
  } | null>(null);

  if (teams.length === 0) {
    return (
      <section className="rounded-xl border border-violet-dark bg-night-light p-5">
        <h3 className="mb-4 font-[family-name:var(--font-body)] text-[length:var(--text-admin-body)] font-semibold text-white">
          Equipes (0)
        </h3>
        <p className="py-8 text-center font-[family-name:var(--font-body)] text-[length:var(--text-admin-small)] text-lilac/60">
          Nenhuma equipe registrada. Aguardando evento sync do Gerencial.
        </p>
      </section>
    );
  }

  // Sort: hero first, then by stage order descending
  const sorted = [...teams].sort((a, b) => {
    if (a.is_hero && !b.is_hero) return -1;
    if (!a.is_hero && b.is_hero) return 1;
    const stageA = STAGE_MAP[a.current_stage];
    const stageB = STAGE_MAP[b.current_stage];
    return (stageB?.order ?? 0) - (stageA?.order ?? 0);
  });

  return (
    <section className="rounded-xl border border-violet-dark bg-night-light p-5">
      <h3 className="mb-4 font-[family-name:var(--font-body)] text-[length:var(--text-admin-body)] font-semibold text-white">
        Equipes ({teams.length})
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full font-[family-name:var(--font-body)] text-[length:var(--text-admin-small)]">
          <thead>
            <tr className="border-b border-violet-dark bg-night-lighter text-left text-lilac">
              <th className="px-3 py-2 font-semibold">Equipe</th>
              <th className="px-3 py-2 font-semibold">Etapa Atual</th>
              <th className="px-3 py-2 font-semibold">Estado</th>
              <th className="px-3 py-2 font-semibold">Cor</th>
              <th className="px-3 py-2 font-semibold">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((team, idx) => (
              <TeamRow
                key={team.team_id}
                team={team}
                isOdd={idx % 2 === 1}
                onTriggerCelebration={() =>
                  setCelebrationTarget({
                    teamId: team.team_id,
                    teamName: team.team_name,
                  })
                }
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Celebration trigger modal */}
      {celebrationTarget && (
        <CelebrationTrigger
          teamId={celebrationTarget.teamId}
          teamName={celebrationTarget.teamName}
          onClose={() => setCelebrationTarget(null)}
        />
      )}
    </section>
  );
}

function TeamRow({
  team,
  isOdd,
  onTriggerCelebration,
}: {
  team: TeamState;
  isOdd: boolean;
  onTriggerCelebration: () => void;
}) {
  const stage = STAGE_MAP[team.current_stage];
  const stageName = stage ? `${stage.name} (${stage.order})` : team.current_stage;
  const badge = VISUAL_STATE_BADGE[team.visual_state];

  return (
    <tr className={`border-b border-violet-dark/30 ${isOdd ? "bg-night" : "bg-night-light"}`}>
      <td className="px-3 py-2.5 text-white">
        <div className="flex items-center gap-2">
          <span className="text-base">
            {team.is_hero ? "\u2605" : "\u25CF"}
          </span>
          <span className="font-medium">{team.team_name}</span>
        </div>
      </td>
      <td className="px-3 py-2.5 text-lilac">{stageName}</td>
      <td className="px-3 py-2.5">
        <span
          className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${badge.className}`}
        >
          {badge.label}
        </span>
      </td>
      <td className="px-3 py-2.5">
        <span
          className="inline-block h-4 w-4 rounded-full"
          style={{ backgroundColor: team.team_color }}
          title={team.team_color}
        />
      </td>
      <td className="px-3 py-2.5">
        <button
          onClick={onTriggerCelebration}
          className="rounded px-2 py-1 text-xs text-violet-light transition-colors hover:bg-violet/20 hover:text-white"
          title="Disparar celebracao"
        >
          Celebrar
        </button>
      </td>
    </tr>
  );
}
