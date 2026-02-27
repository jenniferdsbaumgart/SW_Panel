"use client";

import { useMemo } from "react";

/**
 * Neural network background + organic blobs.
 * Creates interconnected nodes with pulsing connections.
 */

interface NeuralNode {
  x: number;
  y: number;
  size: number;
  opacity: number;
  pulseDelay: number;
}

interface NeuralConnection {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
  animDelay: number;
}

// Round to 2 decimal places to avoid floating-point drift between server and client
const r2 = (n: number) => Math.round(n * 100) / 100;

function generateNeuralNetwork(
  nodeCount: number,
  width: number,
  height: number
): { nodes: NeuralNode[]; connections: NeuralConnection[] } {
  // Deterministic seed-like generation using fixed values
  const nodes: NeuralNode[] = [];
  const golden = 1.618033988749;

  for (let i = 0; i < nodeCount; i++) {
    const angle = i * golden * Math.PI * 2;
    const radius = 0.15 + (i / nodeCount) * 0.7;
    const jitterX = Math.sin(i * 7.3) * 0.15;
    const jitterY = Math.cos(i * 11.7) * 0.15;

    nodes.push({
      x: r2((0.5 + Math.cos(angle) * radius * 0.45 + jitterX) * width),
      y: r2((0.5 + Math.sin(angle) * radius * 0.45 + jitterY) * height),
      size: r2(1.5 + (i % 4) * 0.8),
      opacity: r2(0.1 + (i % 5) * 0.07),
      pulseDelay: r2((i * 0.7) % 8),
    });
  }

  // Connect nearby nodes
  const connections: NeuralConnection[] = [];
  const maxDist = Math.min(width, height) * 0.2;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < maxDist && connections.length < nodeCount * 2) {
        connections.push({
          x1: nodes[i].x,
          y1: nodes[i].y,
          x2: nodes[j].x,
          y2: nodes[j].y,
          opacity: r2(0.05 + (1 - dist / maxDist) * 0.10),
          animDelay: r2((i + j) * 0.3 % 12),
        });
      }
    }
  }

  return { nodes, connections };
}

export function BackgroundBlobs() {
  // Increased node count to 120 for a denser neural net feel, as per reference
  const network = useMemo(() => generateNeuralNetwork(120, 3840, 1920), []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }} suppressHydrationWarning>
      {/* Deep violet gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, #1a1040 0%, #0a0a2e 100%)
          `,
        }}
      />

      {/* Neural network SVG */}
      <svg
        viewBox="0 0 3840 1920"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="neural-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Animated gradient for "data flowing" effect */}
          <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0">
              <animate attributeName="offset" values="-0.3;1" dur="4s" repeatCount="indefinite" />
            </stop>
            <stop offset="15%" stopColor="#7C3AED" stopOpacity="0.4">
              <animate attributeName="offset" values="-0.15;1.15" dur="4s" repeatCount="indefinite" />
            </stop>
            <stop offset="30%" stopColor="#7C3AED" stopOpacity="0">
              <animate attributeName="offset" values="0;1.3" dur="4s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>

        {/* Connections */}
        {network.connections.map((conn, i) => (
          <g key={`c-${i}`}>
            <line
              x1={conn.x1}
              y1={conn.y1}
              x2={conn.x2}
              y2={conn.y2}
              stroke="#7850DC" /* rgba(120, 80, 220, x) */
              strokeWidth="1.5"
              opacity={conn.opacity}
            >
              <animate
                attributeName="opacity"
                values={`${r2(conn.opacity * 0.3)};${conn.opacity};${r2(conn.opacity * 0.3)}`}
                dur={`${6 + (i % 4) * 2}s`}
                begin={`${conn.animDelay}s`}
                repeatCount="indefinite"
              />
            </line>
          </g>
        ))}

        {/* Nodes */}
        {network.nodes.map((node, i) => (
          <g key={`n-${i}`} filter="url(#neural-glow)">
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size}
              fill="#8C64FF" /* rgba(140, 100, 255, x) */
              opacity={node.opacity}
            >
              <animate
                attributeName="opacity"
                values={`${r2(node.opacity * 0.4)};${node.opacity};${r2(node.opacity * 0.4)}`}
                dur={`${4 + (i % 3) * 2}s`}
                begin={`${node.pulseDelay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values={`${node.size};${r2(node.size * 1.5)};${node.size}`}
                dur={`${r2(5 + (i % 4) * 1.5)}s`}
                begin={`${node.pulseDelay}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}

        {/* A few brighter "hub" nodes that stand out more */}
        {[
          { x: 600, y: 400, r: 4 },
          { x: 2200, y: 300, r: 3.5 },
          { x: 3200, y: 1500, r: 4 },
          { x: 800, y: 1400, r: 3 },
          { x: 1800, y: 1000, r: 5 },
          { x: 3000, y: 600, r: 3.5 },
        ].map((hub, i) => (
          <g key={`hub-${i}`}>
            {/* Glow ring */}
            <circle
              cx={hub.x}
              cy={hub.y}
              r={hub.r * 6}
              fill="none"
              stroke="#7C3AED"
              strokeWidth="0.5"
              opacity="0.08"
            >
              <animate
                attributeName="r"
                values={`${hub.r * 4};${hub.r * 8};${hub.r * 4}`}
                dur={`${7 + i * 1.3}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.04;0.12;0.04"
                dur={`${7 + i * 1.3}s`}
                repeatCount="indefinite"
              />
            </circle>
            {/* Core */}
            <circle
              cx={hub.x}
              cy={hub.y}
              r={hub.r}
              fill="#A78BFA"
              opacity="0.3"
            >
              <animate
                attributeName="opacity"
                values="0.15;0.4;0.15"
                dur={`${5 + i}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}
      </svg>

      {/* Minimal organic blobs to not overpower the neural network */}
      {[
        { cx: "25%", cy: "35%", size: 800, color: "#1a1040", delay: 0, dur: 35 },
        { cx: "75%", cy: "65%", size: 600, color: "#1a1040", delay: 10, dur: 40 },
      ].map((blob, i) => (
        <div
          key={`blob-${i}`}
          className="absolute rounded-full"
          style={{
            left: blob.cx,
            top: blob.cy,
            width: `${blob.size}px`,
            height: `${blob.size}px`,
            background: `radial-gradient(circle, ${blob.color}40 0%, transparent 70%)`,
            filter: "blur(80px)",
            transform: "translate(-50%, -50%)",
            animation: `blob-morph ${blob.dur}s ease-in-out infinite`,
            animationDelay: `${blob.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
