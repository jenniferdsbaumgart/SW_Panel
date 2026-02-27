"use client";

interface CardPlaceholderProps {
  teamName: string;
  teamColor: string;
  width: number;
  height: number;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

export function CardPlaceholder({
  teamName,
  teamColor,
  width,
  height,
}: CardPlaceholderProps) {
  const initials = getInitials(teamName);
  // Image area is ~75% of the card height
  const imageHeight = Math.round(height * 0.75);

  return (
    <div
      className="flex items-center justify-center rounded-[8px]"
      style={{
        width: `${width}px`,
        height: `${imageHeight}px`,
        backgroundColor: `${teamColor}33`,
      }}
    >
      <span
        className="font-[family-name:var(--font-display)] font-black text-white"
        style={{
          fontSize: `${Math.round(width * 0.32)}px`,
          textShadow: `0 0 12px ${teamColor}66`,
        }}
      >
        {initials}
      </span>
    </div>
  );
}
