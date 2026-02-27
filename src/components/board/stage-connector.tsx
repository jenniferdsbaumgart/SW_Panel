"use client";

interface StageConnectorProps {
  direction: "horizontal" | "vertical";
  fromColor?: string;
  toColor?: string;
}

/**
 * Energy filament connector between stages.
 * Glowing line with animated pulse effect.
 */
export function StageConnector({
  direction,
  fromColor = "#4C1D95",
  toColor = "#7C3AED",
}: StageConnectorProps) {
  if (direction === "vertical") {
    return (
      <div className="relative flex w-[4px] items-center justify-center" style={{ height: "100%" }}>
        {/* Outer glow */}
        <div
          className="absolute h-full w-[12px] rounded-full opacity-40"
          style={{
            background: `linear-gradient(to bottom, ${fromColor}, ${toColor})`,
            filter: "blur(6px)",
          }}
        />
        {/* Core line */}
        <div
          className="relative h-full w-[3px] rounded-full"
          style={{
            background: `linear-gradient(to bottom, ${fromColor}, ${toColor})`,
          }}
        />
      </div>
    );
  }

  return (
    <div className="relative flex h-[4px] flex-1 items-center">
      {/* Outer glow */}
      <div
        className="absolute h-[10px] w-full rounded-full opacity-40"
        style={{
          background: `linear-gradient(to right, ${fromColor}, ${toColor})`,
          filter: "blur(6px)",
        }}
      />
      {/* Core line */}
      <div
        className="relative h-[2px] w-full rounded-full"
        style={{
          background: `linear-gradient(to right, ${fromColor}80, ${toColor}, ${fromColor}80)`,
        }}
      />
      {/* Animated energy dots traveling along the connector */}
      <div
        className="absolute h-[4px] w-[20px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${toColor} 0%, transparent 100%)`,
          animation: "energy-flow 3s linear infinite",
          boxShadow: `0 0 8px ${toColor}80`,
        }}
      />
    </div>
  );
}
