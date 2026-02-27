"use client";

import { useState } from "react";
import { CardPlaceholder } from "./card-placeholder";

interface CardImageProps {
  imageUrl: string;
  teamName: string;
  teamColor: string;
  width: number;
  height: number;
}

export function CardImage({
  imageUrl,
  teamName,
  teamColor,
  width,
  height,
}: CardImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const imageHeight = Math.round(height * 0.75);

  if (hasError) {
    return (
      <CardPlaceholder
        teamName={teamName}
        teamColor={teamColor}
        width={width}
        height={height}
      />
    );
  }

  return (
    <div
      className="relative overflow-hidden rounded-[8px]"
      style={{ width: `${width}px`, height: `${imageHeight}px` }}
    >
      {!isLoaded && (
        <div
          className="absolute inset-0 animate-pulse rounded-[8px]"
          style={{ backgroundColor: `${teamColor}22` }}
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={`Card de ${teamName}`}
        className="h-full w-full rounded-[8px] object-cover"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 300ms ease",
        }}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
