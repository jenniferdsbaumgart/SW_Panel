"use client";

import { useState } from "react";
import { usePanelStore } from "@/stores/panel-store";
import type { CelebrationType } from "@/types/stages";

const CELEBRATION_OPTIONS: {
  type: CelebrationType;
  label: string;
  duration: string;
}[] = [
  { type: "light", label: "Leve", duration: "~2s" },
  { type: "medium", label: "Media", duration: "~3s" },
  { type: "medium_high", label: "Media-Alta", duration: "~5s" },
  { type: "max", label: "HERO/Maxima", duration: "~8s" },
  { type: "pivot", label: "Pivot", duration: "~3s" },
];

interface CelebrationTriggerProps {
  teamId: string;
  teamName: string;
  onClose: () => void;
}

export function CelebrationTrigger({
  teamId,
  teamName,
  onClose,
}: CelebrationTriggerProps) {
  const [selected, setSelected] = useState<CelebrationType>("medium_high");
  const [triggered, setTriggered] = useState(false);
  const triggerManualCelebration = usePanelStore(
    (s) => s.triggerManualCelebration
  );

  function handleTrigger() {
    triggerManualCelebration(teamId, selected);
    setTriggered(true);
    setTimeout(() => {
      onClose();
    }, 800);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-night/60"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm rounded-2xl border border-violet-dark bg-night-light p-6">
        <h4 className="mb-1 font-[family-name:var(--font-body)] text-[length:var(--text-admin-body)] font-semibold text-white">
          Disparar Celebracao
        </h4>
        <p className="mb-5 font-[family-name:var(--font-body)] text-[length:var(--text-admin-small)] text-lilac">
          Equipe: {teamName}
        </p>

        {triggered ? (
          <div className="py-4 text-center">
            <p className="font-[family-name:var(--font-body)] text-[length:var(--text-admin-body)] font-semibold text-lime">
              Celebracao disparada!
            </p>
          </div>
        ) : (
          <>
            <fieldset className="mb-5 space-y-2">
              <legend className="mb-2 font-[family-name:var(--font-body)] text-[length:var(--text-admin-small)] font-medium text-lilac">
                Tipo:
              </legend>
              {CELEBRATION_OPTIONS.map((option) => (
                <label
                  key={option.type}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-night-lighter"
                >
                  <input
                    type="radio"
                    name="celebration-type"
                    value={option.type}
                    checked={selected === option.type}
                    onChange={() => setSelected(option.type)}
                    className="h-4 w-4 accent-violet"
                  />
                  <span className="font-[family-name:var(--font-body)] text-[length:var(--text-admin-small)] text-white">
                    {option.label}{" "}
                    <span className="text-lilac/60">({option.duration})</span>
                  </span>
                </label>
              ))}
            </fieldset>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-lg px-4 py-2 font-[family-name:var(--font-body)] text-[length:var(--text-admin-small)] text-lilac transition-colors hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleTrigger}
                className="rounded-lg bg-violet px-4 py-2 font-[family-name:var(--font-body)] text-[length:var(--text-admin-small)] font-semibold text-white transition-colors hover:bg-violet-light"
              >
                Disparar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
