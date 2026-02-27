"use client";

import { useState } from "react";
import { usePanelStore } from "@/stores/panel-store";

export function PanelControls() {
  const isPaused = usePanelStore((s) => s.isPaused);
  const pendingCount = usePanelStore((s) => s.pendingEvents.length);
  const celebrationQueueLength = usePanelStore((s) => s.celebrationQueue.length);
  const handlePanelControl = usePanelStore((s) => s.handlePanelControl);
  const resetPanel = usePanelStore((s) => s.resetPanel);

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  function handlePauseResume() {
    handlePanelControl({
      type: "panel_control",
      action: isPaused ? "resume" : "pause",
    });
  }

  function handleReset() {
    resetPanel();
    setShowResetConfirm(false);
  }

  return (
    <section className="rounded-xl border border-violet-dark bg-night-light p-5">
      <h3 className="mb-4 font-[family-name:var(--font-body)] text-[length:var(--text-admin-body)] font-semibold text-white">
        Controles
      </h3>

      <div className="flex flex-wrap items-center gap-3">
        {/* Pause / Resume */}
        <button
          onClick={handlePauseResume}
          className={`rounded-lg px-4 py-2 font-[family-name:var(--font-body)] text-[length:var(--text-admin-small)] font-semibold transition-colors ${
            isPaused
              ? "bg-lime text-night hover:bg-lime/80"
              : "bg-violet text-white hover:bg-violet-light"
          }`}
        >
          {isPaused ? "Retomar Painel" : "Pausar Painel"}
        </button>

        {/* Reset */}
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="rounded-lg border border-red-500 px-4 py-2 font-[family-name:var(--font-body)] text-[length:var(--text-admin-small)] font-semibold text-red-500 transition-colors hover:bg-red-500/10"
          >
            Reset
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-[family-name:var(--font-body)] text-[length:var(--text-admin-small)] text-red-400">
              Tem certeza?
            </span>
            <button
              onClick={handleReset}
              className="rounded-lg bg-red-600 px-3 py-1.5 font-[family-name:var(--font-body)] text-[length:var(--text-admin-small)] font-semibold text-white transition-colors hover:bg-red-700"
            >
              Confirmar
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="rounded-lg px-3 py-1.5 font-[family-name:var(--font-body)] text-[length:var(--text-admin-small)] text-lilac transition-colors hover:text-white"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Queue info */}
        <div className="ml-auto flex items-center gap-3">
          {isPaused && (
            <span className="rounded-md bg-red-500/20 px-2.5 py-1 font-[family-name:var(--font-body)] text-[length:var(--text-admin-small)] font-semibold text-red-400">
              PAUSADO
            </span>
          )}

          <span className="font-[family-name:var(--font-body)] text-[length:var(--text-admin-small)] text-lilac">
            Fila:{" "}
            <span className="font-semibold text-lime">
              {celebrationQueueLength}
            </span>{" "}
            {celebrationQueueLength === 1 ? "celebracao" : "celebracoes"}
          </span>
        </div>
      </div>

      {isPaused && pendingCount > 0 && (
        <p className="mt-3 font-[family-name:var(--font-body)] text-[length:var(--text-admin-small)] text-lime/80">
          {pendingCount} {pendingCount === 1 ? "evento acumulado" : "eventos acumulados"} na fila.
        </p>
      )}
    </section>
  );
}
