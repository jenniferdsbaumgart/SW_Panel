"use client";

import { Suspense } from "react";
import { useWebSocket } from "@/hooks/use-websocket";
import { JourneyTrack } from "./journey-track";
import { BackgroundBlobs } from "./background-blobs";
import { CelebrationOverlay } from "@/components/celebrations/celebration-overlay";
import { CelebrationQueueManager } from "@/components/celebrations/celebration-queue-manager";
import { ConnectionIndicator } from "@/components/ui/connection-indicator";
import { PauseIndicator } from "@/components/ui/pause-indicator";
import { DemoControls } from "@/components/demo/demo-controls";

/**
 * Root container for the journey board game panel.
 * Layers: Background blobs → Track → Celebrations → Status indicators
 */
export function JourneyBoard() {
  useWebSocket();

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Atmospheric background blobs */}
      <BackgroundBlobs />

      {/* Subtle grid overlay for board game feel */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 1,
          backgroundImage: `
            radial-gradient(circle at 50% 50%, transparent 0%, #0F0A1A 100%),
            linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 60px 60px, 60px 60px",
        }}
      />

      {/* Journey track with 8 stages in serpentine layout */}
      <JourneyTrack />

      {/* Celebration overlay (z-40) */}
      <CelebrationOverlay />

      {/* Connection status indicator (bottom-left) */}
      <ConnectionIndicator />

      {/* Pause indicator (bottom-right, only visible when paused) */}
      <PauseIndicator />

      {/* Headless celebration queue processor */}
      <CelebrationQueueManager />

      {/* Demo controls (only visible with ?demo=true) */}
      <Suspense fallback={null}>
        <DemoControls />
      </Suspense>
    </div>
  );
}
