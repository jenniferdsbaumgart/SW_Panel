"use client";

import { usePanelStore } from "@/stores/panel-store";

const STATUS_CONFIG: Record<
  string,
  { label: string; dotClass: string; textClass: string }
> = {
  connected: {
    label: "Conectado",
    dotClass: "bg-green-500",
    textClass: "text-green-400",
  },
  connecting: {
    label: "Conectando...",
    dotClass: "bg-yellow-500 animate-pulse",
    textClass: "text-yellow-400",
  },
  reconnecting: {
    label: "Reconectando...",
    dotClass: "bg-yellow-500 animate-pulse",
    textClass: "text-yellow-400",
  },
  disconnected: {
    label: "Desconectado",
    dotClass: "bg-red-500",
    textClass: "text-red-400",
  },
};

export function ConnectionStatus() {
  const connectionStatus = usePanelStore((s) => s.connectionStatus);
  const reconnectAttempts = usePanelStore((s) => s.reconnectAttempts);
  const lastSyncAt = usePanelStore((s) => s.lastSyncAt);

  const config = STATUS_CONFIG[connectionStatus] ?? STATUS_CONFIG.disconnected;

  const formattedSync = lastSyncAt
    ? new Date(lastSyncAt).toLocaleTimeString("pt-BR")
    : "--";

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className={`inline-block h-2.5 w-2.5 rounded-full ${config.dotClass}`} />
        <span className={`font-[family-name:var(--font-body)] text-[length:var(--text-admin-small)] font-medium ${config.textClass}`}>
          {config.label}
        </span>
      </div>

      {connectionStatus === "reconnecting" && (
        <span className="font-[family-name:var(--font-body)] text-[length:var(--text-admin-small)] text-lilac">
          Tentativa {reconnectAttempts}
        </span>
      )}

      <span className="font-[family-name:var(--font-body)] text-[length:var(--text-admin-small)] text-lilac/60">
        Sync: {formattedSync}
      </span>
    </div>
  );
}
