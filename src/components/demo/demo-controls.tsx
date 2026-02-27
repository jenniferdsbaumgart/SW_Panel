"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { usePanelStore } from "@/stores/panel-store";
import type { StageId, CelebrationType } from "@/types/stages";
import type { TeamSyncData } from "@/types/events";

// ============================================================
// FAKE DATA
// ============================================================

const FAKE_NAMES = [
  "Rocket Fuel",
  "Neural Spark",
  "Code Wizards",
  "Pixel Pirates",
  "Data Dragons",
  "Cloud Nine",
  "Byte Force",
  "Quantum Leap",
];

const FAKE_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
];

// ============================================================
// STAGE LOGIC
// ============================================================

const STAGE_ORDER: StageId[] = [
  "zero",
  "ideia",
  "problema",
  "validacao",
  "mvp",
  "sol_validada",
  "pitch",
  "hero",
];

const CELEBRATION_MAP: Record<string, CelebrationType> = {
  "zero->ideia": "light",
  "ideia->problema": "light",
  "problema->validacao": "medium",
  "validacao->mvp": "medium",
  "mvp->sol_validada": "medium_high",
  "sol_validada->pitch": "medium_high",
};

function getNextStage(current: StageId): StageId | null {
  const idx = STAGE_ORDER.indexOf(current);
  if (idx === -1 || idx >= STAGE_ORDER.length - 1) return null;
  return STAGE_ORDER[idx + 1];
}


// ============================================================
// COUNTER for unique team IDs
// ============================================================

let fakeTeamCounter = 0;

// ============================================================
// COMPONENT
// ============================================================

export function DemoControls() {
  const searchParams = useSearchParams();
  const isDemoMode = searchParams.get("demo") === "true";

  const [isOpen, setIsOpen] = useState(false);

  if (!isDemoMode) return null;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 9999,
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #7C3AED, #A78BFA)",
          color: "#fff",
          border: "2px solid rgba(167, 139, 250, 0.5)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          fontWeight: "bold",
          boxShadow: "0 4px 20px rgba(124, 58, 237, 0.4)",
        }}
        title="Demo Controls"
      >
        {isOpen ? "X" : "D"}
      </button>

      {/* Panel */}
      {isOpen && <DemoPanel />}
    </>
  );
}

// ============================================================
// DEMO PANEL (inner, only rendered when open)
// ============================================================

const CELEBRATION_TYPES: CelebrationType[] = [
  "light",
  "medium",
  "medium_high",
  "max",
  "pivot",
];

function DemoPanel() {
  const teams = usePanelStore((s) => s.teams);
  const teamList = Object.values(teams);

  const addFakeTeam = useCallback(() => {
    const store = usePanelStore.getState();
    const existingTeams = Object.values(store.teams);

    const nameIdx = fakeTeamCounter % FAKE_NAMES.length;
    const colorIdx = fakeTeamCounter % FAKE_COLORS.length;
    fakeTeamCounter++;

    const teamId = `demo-${Date.now()}-${fakeTeamCounter}`;
    const teamName = FAKE_NAMES[nameIdx];
    const teamColor = FAKE_COLORS[colorIdx];

    const newTeam: TeamSyncData = {
      team_id: teamId,
      team_name: teamName,
      team_color: teamColor,
      current_stage: "zero",
      card: null,
      is_waiting: false,
      is_pivoted: false,
      pivot_count: 0,
      is_hero: false,
    };

    // Re-sync all existing teams + the new one
    const allTeams: TeamSyncData[] = existingTeams.map((t) => ({
      team_id: t.team_id,
      team_name: t.team_name,
      team_color: t.team_color,
      current_stage: t.current_stage,
      card: t.card,
      is_waiting: t.is_waiting,
      is_pivoted: t.is_pivoted,
      pivot_count: t.pivot_count,
      is_hero: t.is_hero,
    }));

    allTeams.push(newTeam);
    store.handleSync(allTeams);
  }, []);

  const advanceTeam = useCallback((teamId: string) => {
    const store = usePanelStore.getState();
    const team = store.teams[teamId];
    if (!team) return;

    const nextStage = getNextStage(team.current_stage);
    if (!nextStage) return;

    // pitch -> hero uses handleHero
    if (team.current_stage === "pitch" && nextStage === "hero") {
      store.handleHero({
        type: "hero",
        team_id: teamId,
        card_hero: {
          image_url: "",
          title: `${team.team_name} - HERO!`,
          subtitle: "From Zero to Hero",
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const key = `${team.current_stage}->${nextStage}`;
    const celebrationType = CELEBRATION_MAP[key] ?? "light";

    store.handleStageUpdate({
      type: "stage_update",
      team_id: teamId,
      team_name: team.team_name,
      team_color: team.team_color,
      from_stage: team.current_stage,
      to_stage: nextStage,
      celebration_type: celebrationType,
      card: team.card,
      timestamp: new Date().toISOString(),
    });
  }, []);

  const toggleWaiting = useCallback((teamId: string) => {
    const store = usePanelStore.getState();
    const team = store.teams[teamId];
    if (!team) return;

    store.handleWaiting({
      type: "waiting",
      team_id: teamId,
      stage: team.current_stage,
      timestamp: new Date().toISOString(),
    });
  }, []);

  const pivotTeam = useCallback((teamId: string) => {
    const store = usePanelStore.getState();
    const team = store.teams[teamId];
    if (!team) return;

    // Can't pivot from zero or ideia
    const stageIdx = STAGE_ORDER.indexOf(team.current_stage);
    if (stageIdx <= 1) return; // 0=zero, 1=ideia

    store.handlePivot({
      type: "pivot",
      team_id: teamId,
      from_stage: team.current_stage,
      to_stage: "ideia",  // ALWAYS go back to ideia
      reason: "Demo pivot",
      card: team.card,
      timestamp: new Date().toISOString(),
    });
  }, []);

  const fireCelebration = useCallback(
    (teamId: string, type: CelebrationType) => {
      const store = usePanelStore.getState();
      store.triggerManualCelebration(teamId, type);
    },
    []
  );

  const resetAll = useCallback(() => {
    usePanelStore.getState().resetPanel();
    fakeTeamCounter = 0;
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 72,
        right: 16,
        zIndex: 9998,
        width: 340,
        maxHeight: "70vh",
        overflowY: "auto",
        background: "rgba(15, 10, 26, 0.92)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(124, 58, 237, 0.3)",
        borderRadius: 12,
        padding: 16,
        color: "#E2E8F0",
        fontFamily: "system-ui, sans-serif",
        fontSize: 13,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
          paddingBottom: 8,
          borderBottom: "1px solid rgba(124, 58, 237, 0.2)",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 14, color: "#A78BFA" }}>
          Demo Controls
        </span>
        <span
          style={{
            fontSize: 11,
            color: "#7C3AED",
            background: "rgba(124, 58, 237, 0.15)",
            padding: "2px 8px",
            borderRadius: 4,
          }}
        >
          {teamList.length} teams
        </span>
      </div>

      {/* Global actions */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <DemoButton onClick={addFakeTeam} color="#7C3AED">
          + Add Team
        </DemoButton>
        <DemoButton onClick={resetAll} color="#EF4444">
          Reset All
        </DemoButton>
      </div>

      {/* Team list */}
      {teamList.length === 0 && (
        <p
          style={{
            textAlign: "center",
            color: "#64748B",
            padding: "16px 0",
            fontSize: 12,
          }}
        >
          No teams yet. Click "Add Team" to start.
        </p>
      )}

      {teamList.map((team) => (
        <TeamRow
          key={team.team_id}
          team={team}
          onAdvance={advanceTeam}
          onWaiting={toggleWaiting}
          onPivot={pivotTeam}
          onCelebration={fireCelebration}
        />
      ))}
    </div>
  );
}

// ============================================================
// TEAM ROW
// ============================================================

interface TeamRowProps {
  team: {
    team_id: string;
    team_name: string;
    team_color: string;
    current_stage: StageId;
    visual_state: string;
    is_waiting: boolean;
    is_hero: boolean;
  };
  onAdvance: (id: string) => void;
  onWaiting: (id: string) => void;
  onPivot: (id: string) => void;
  onCelebration: (id: string, type: CelebrationType) => void;
}

function TeamRow({
  team,
  onAdvance,
  onWaiting,
  onPivot,
  onCelebration,
}: TeamRowProps) {
  const [celebType, setCelebType] = useState<CelebrationType>("light");
  const nextStage = getNextStage(team.current_stage);
  const stageIdx = STAGE_ORDER.indexOf(team.current_stage);

  return (
    <div
      style={{
        marginBottom: 8,
        padding: 10,
        borderRadius: 8,
        background: "rgba(30, 20, 50, 0.6)",
        border: `1px solid ${team.team_color}33`,
      }}
    >
      {/* Team header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 6,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: team.team_color,
            flexShrink: 0,
          }}
        />
        <span style={{ fontWeight: 600, flex: 1 }}>{team.team_name}</span>
        <span
          style={{
            fontSize: 10,
            color: "#A78BFA",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {team.current_stage} ({stageIdx}/7)
        </span>
      </div>

      {/* Status badges */}
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        {team.is_waiting && (
          <Badge color="#FBBF24" label="Waiting" />
        )}
        {team.is_hero && <Badge color="#FFD700" label="HERO" />}
        {team.visual_state === "celebrating" && (
          <Badge color="#A78BFA" label="Celebrating" />
        )}
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {nextStage && (
          <DemoButton
            onClick={() => onAdvance(team.team_id)}
            color="#10B981"
            small
          >
            {team.current_stage === "pitch"
              ? "HERO!"
              : `-> ${nextStage}`}
          </DemoButton>
        )}

        <DemoButton
          onClick={() => onWaiting(team.team_id)}
          color="#FBBF24"
          small
        >
          Wait
        </DemoButton>

        {STAGE_ORDER.indexOf(team.current_stage) > 1 && (
          <DemoButton
            onClick={() => onPivot(team.team_id)}
            color="#F97316"
            small
          >
            Pivot → IDEIA
          </DemoButton>
        )}
      </div>

      {/* Celebration trigger */}
      <div
        style={{
          display: "flex",
          gap: 4,
          marginTop: 6,
          alignItems: "center",
        }}
      >
        <select
          value={celebType}
          onChange={(e) =>
            setCelebType(e.target.value as CelebrationType)
          }
          style={{
            flex: 1,
            height: 26,
            fontSize: 11,
            background: "rgba(15, 10, 26, 0.8)",
            color: "#E2E8F0",
            border: "1px solid rgba(124, 58, 237, 0.3)",
            borderRadius: 4,
            padding: "0 6px",
            cursor: "pointer",
          }}
        >
          {CELEBRATION_TYPES.map((ct) => (
            <option key={ct} value={ct}>
              {ct}
            </option>
          ))}
        </select>
        <DemoButton
          onClick={() => onCelebration(team.team_id, celebType)}
          color="#8B5CF6"
          small
        >
          Fire!
        </DemoButton>
      </div>
    </div>
  );
}

// ============================================================
// SHARED UI PIECES
// ============================================================

function Badge({ color, label }: { color: string; label: string }) {
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 600,
        color,
        background: `${color}22`,
        padding: "1px 6px",
        borderRadius: 3,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      {label}
    </span>
  );
}

function DemoButton({
  onClick,
  color,
  small,
  children,
}: {
  onClick: () => void;
  color: string;
  small?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        height: small ? 24 : 30,
        padding: small ? "0 8px" : "0 12px",
        fontSize: small ? 11 : 12,
        fontWeight: 600,
        color: "#fff",
        background: `${color}CC`,
        border: `1px solid ${color}66`,
        borderRadius: 4,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.target as HTMLButtonElement).style.background = color;
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLButtonElement).style.background = `${color}CC`;
      }}
    >
      {children}
    </button>
  );
}
