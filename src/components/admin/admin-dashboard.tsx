"use client";

import { useAdminStore } from "@/stores/admin-store";
import { useWebSocket } from "@/hooks/use-websocket";
import { useStoreHydration } from "@/hooks/use-store-hydration";
import { ConnectionStatus } from "./connection-status";
import { PanelControls } from "./panel-controls";
import { TeamList } from "./team-list";
import { EventLog } from "./event-log";

export function AdminDashboard() {
  useStoreHydration();
  const logout = useAdminStore((s) => s.logout);

  // Admin runs in its own tab, so it needs its own WebSocket connection
  useWebSocket();

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-[family-name:var(--font-display)] text-[length:var(--text-admin-h1)] font-bold text-white">
            SW PAINEL ADMIN
          </h1>
          <ConnectionStatus />
        </div>
        <button
          onClick={logout}
          className="rounded-lg px-3 py-1.5 font-[family-name:var(--font-body)] text-[length:var(--text-admin-small)] text-lilac transition-colors hover:text-white"
        >
          Sair
        </button>
      </header>

      {/* Controls */}
      <PanelControls />

      {/* Team List */}
      <TeamList />

      {/* Event Log */}
      <EventLog />
    </div>
  );
}
