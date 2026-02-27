"use client";

import { useConnectionStatus } from "@/stores/panel-store";

const STATUS_CONFIG: Record<
  string,
  { color: string; label: string; pulse: boolean }
> = {
  connected: { color: "#22C55E", label: "Conectado", pulse: false },
  connecting: { color: "#EAB308", label: "Conectando", pulse: true },
  reconnecting: { color: "#EAB308", label: "Reconectando", pulse: true },
  disconnected: { color: "#EF4444", label: "Desconectado", pulse: false },
};

export function ConnectionIndicator() {
  const status = useConnectionStatus();
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.disconnected;

  return (
    <div
      className="absolute bottom-[var(--spacing-panel-3)] left-[var(--spacing-panel-3)] flex items-center gap-[8px]"
      style={{ zIndex: "var(--z-status-indicators)" }}
    >
      <div
        className="h-[16px] w-[16px] rounded-full"
        style={{
          backgroundColor: config.color,
          boxShadow: `0 0 8px ${config.color}88`,
          animation: config.pulse ? "pulse-waiting 2s ease-in-out infinite" : "none",
        }}
      />
      <span
        className="font-[family-name:var(--font-body)] text-white/50"
        style={{ fontSize: "var(--text-panel-small)" }}
      >
        {config.label}
      </span>
    </div>
  );
}
