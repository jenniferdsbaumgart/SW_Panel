"use client";

import { useEffect, useRef } from "react";
import { usePanelStore } from "@/stores/panel-store";
import { useShallow } from "zustand/react/shallow";
import type { EventLogEntry } from "@/types/state";

const EVENT_TYPE_COLOR: Record<string, string> = {
  stage_update: "text-green-400",
  waiting: "text-lime",
  pivot: "text-indigo",
  hero: "text-gold",
  sync: "text-lilac",
  panel_control: "text-white",
  manual_celebration: "text-violet-light",
  celebration: "text-violet-lighter",
  error: "text-red-500",
};

const MAX_VISIBLE = 50;

export function EventLog() {
  const eventLog = usePanelStore(
    useShallow((s) => s.eventLog.slice(-MAX_VISIBLE))
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [eventLog.length]);

  return (
    <section className="rounded-xl border border-violet-dark bg-night p-5">
      <h3 className="mb-3 font-[family-name:var(--font-body)] text-[length:var(--text-admin-body)] font-semibold text-white">
        Log de Eventos{" "}
        <span className="font-normal text-lilac/60">
          (ultimos {eventLog.length})
        </span>
      </h3>

      <div
        ref={scrollRef}
        className="max-h-64 overflow-y-auto rounded-lg bg-night-light/50 p-3"
      >
        {eventLog.length === 0 ? (
          <p className="py-4 text-center font-mono text-xs text-lilac/40">
            Aguardando eventos...
          </p>
        ) : (
          <div className="space-y-0.5">
            {eventLog.map((entry) => (
              <EventLogRow key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function EventLogRow({ entry }: { entry: EventLogEntry }) {
  const time = new Date(entry.timestamp).toLocaleTimeString("pt-BR");
  const colorClass = EVENT_TYPE_COLOR[entry.type] ?? "text-lilac";

  const summary = formatEventSummary(entry);

  return (
    <div className="flex items-baseline gap-2 font-mono text-xs leading-relaxed">
      <span className="shrink-0 text-lilac/60">{time}</span>
      <span className={`shrink-0 font-semibold ${colorClass}`}>
        {entry.type.padEnd(16)}
      </span>
      <span className="truncate text-white/70">{summary}</span>
    </div>
  );
}

function formatEventSummary(entry: EventLogEntry): string {
  const data = entry.data;
  switch (entry.type) {
    case "sync":
      return `${data.teamCount ?? "?"} equipes carregadas`;
    case "stage_update":
      return `${data.team_id ?? ""} ${data.from ?? ""} -> ${data.to ?? ""}`;
    case "waiting":
      return `${data.team_id ?? ""} etapa ${data.stage ?? ""}`;
    case "pivot":
      return `${data.team_id ?? ""} ${data.from ?? ""} -> ${data.to ?? ""}`;
    case "hero":
      return `${data.team_id ?? ""}`;
    case "panel_control":
      return `${data.action ?? ""}`;
    case "manual_celebration":
      return `${data.team_id ?? ""} tipo ${data.celebration ?? ""}`;
    default:
      return JSON.stringify(data).slice(0, 80);
  }
}
