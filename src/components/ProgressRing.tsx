"use client";

import React from "react";

interface ProgressRingProps {
  value: number; // 0 to 100
  size?: number; // diameter in px (default 120)
  strokeWidth?: number; // ring stroke width in px (default 10)
  colorClass?: string; // stroke color (e.g. text-emerald-400)
  trackColorClass?: string; // background track color
  label?: string; // accessible aria-label
  children?: React.ReactNode; // center content
}

export default function ProgressRing({
  value,
  size = 120,
  strokeWidth = 10,
  colorClass = "text-emerald-400",
  trackColorClass = "text-zinc-800",
  label = "Tiến độ học tập",
  children,
}: ProgressRingProps) {
  const clampedValue = Math.min(100, Math.max(0, isNaN(value) ? 0 : value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  return (
    <div
      className="relative inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      {/* Semantic progress for screen readers and accessibility */}
      <progress
        value={clampedValue}
        max={100}
        aria-label={label}
        className="sr-only"
      >
        {clampedValue}%
      </progress>

      {/* Visual SVG Progress Ring with smooth transition */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90 transform"
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className={trackColorClass}
        />
        {/* Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className={`${colorClass} transition-[stroke-dashoffset] duration-700 ease-out`}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {children ?? (
          <span className="text-xl font-bold font-mono tracking-tight text-white">
            {Math.round(clampedValue)}%
          </span>
        )}
      </div>
    </div>
  );
}

