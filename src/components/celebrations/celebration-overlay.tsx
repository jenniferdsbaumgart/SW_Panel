"use client";

import { useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { usePanelStore } from "@/stores/panel-store";
import type { CelebrationQueueItem } from "@/types/state";
import type { CelebrationType } from "@/types/stages";
import { CelebrationLight } from "./celebration-light";
import { CelebrationMedium } from "./celebration-medium";
import { CelebrationMediumHigh } from "./celebration-medium-high";
import { CelebrationHero } from "./celebration-hero";
import { CelebrationPivot } from "./celebration-pivot";

interface CelebrationComponentProps {
  celebration: CelebrationQueueItem;
  onComplete: () => void;
}

/**
 * Maps a CelebrationType to the correct celebration component.
 */
function getCelebrationComponent(
  type: CelebrationType
): React.ComponentType<CelebrationComponentProps> {
  switch (type) {
    case "light":
      return CelebrationLight;
    case "medium":
      return CelebrationMedium;
    case "medium_high":
      return CelebrationMediumHigh;
    case "max":
      return CelebrationHero;
    case "pivot":
      return CelebrationPivot;
  }
}

/**
 * Overlay container for celebrations.
 * Watches currentCelebration from the store and renders the appropriate
 * celebration component based on celebration_type.
 */
export function CelebrationOverlay() {
  const currentCelebration = usePanelStore((s) => s.currentCelebration);

  const handleComplete = useCallback(() => {
    usePanelStore.getState().finishCelebration();
  }, []);

  const CelebrationComponent = currentCelebration
    ? getCelebrationComponent(currentCelebration.celebration_type)
    : null;

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: "var(--z-celebration-overlay)" }}
    >
      <AnimatePresence mode="wait">
        {currentCelebration && CelebrationComponent && (
          <CelebrationComponent
            key={currentCelebration.id}
            celebration={currentCelebration}
            onComplete={handleComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
