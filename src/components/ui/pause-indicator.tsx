"use client";

import { useIsPaused } from "@/stores/panel-store";
import { Pause } from "lucide-react";

export function PauseIndicator() {
  const isPaused = useIsPaused();

  if (!isPaused) return null;

  return (
    <div
      className="absolute bottom-[var(--spacing-panel-3)] right-[var(--spacing-panel-3)] flex items-center gap-[6px] opacity-30"
      style={{ zIndex: "var(--z-status-indicators)" }}
    >
      <Pause size={20} className="text-white" />
      <span
        className="font-[family-name:var(--font-body)] text-white"
        style={{ fontSize: "var(--text-panel-small)" }}
      >
        Pausado
      </span>
    </div>
  );
}
