"use client";

import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-zinc-800/60 ${className}`}
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// 1. DASHBOARD SKELETON
// ---------------------------------------------------------------------------
export function DashboardSkeleton() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Sticky Header Skeleton */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/85 px-4 sm:px-6 lg:px-8 py-3.5 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <Skeleton className="w-7 h-7 sm:w-8 sm:h-8" />
              <Skeleton className="w-24 h-5" />
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Skeleton className="w-20 h-7" />
              <Skeleton className="w-16 h-7" />
              <Skeleton className="w-14 h-7" />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Skeleton className="w-14 h-7" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* Hero Banner Skeleton */}
        <div className="border border-zinc-800 bg-zinc-900/40 p-5 sm:p-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl w-full">
              <Skeleton className="w-36 h-3" />
              <Skeleton className="w-3/4 h-8 sm:h-10" />
              <Skeleton className="w-full h-4" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="w-32 h-11" />
              <Skeleton className="w-32 h-11" />
            </div>
          </div>
        </div>

        {/* 4 Stat Cards Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="border border-zinc-800 bg-zinc-900/40 p-3.5 sm:p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="w-16 h-3" />
                <Skeleton className="w-6 h-6" />
              </div>
              <Skeleton className="w-16 h-8" />
              <Skeleton className="w-24 h-3" />
            </div>
          ))}
        </div>

        {/* 2-Column Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6 space-y-4">
              <Skeleton className="w-28 h-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6 space-y-5">
              <div className="flex justify-between items-center">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-16 h-3" />
              </div>
              <div className="flex items-center gap-5 pt-1">
                <Skeleton className="w-24 h-24 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-full h-3" />
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// 2. PROGRESS SKELETON
// ---------------------------------------------------------------------------
export function ProgressSkeleton() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Sticky Header Skeleton */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/85 px-4 sm:px-6 py-3.5 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="w-24 h-5" />
          </div>
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
        <div className="space-y-3">
          <Skeleton className="w-32 h-3" />
          <Skeleton className="w-56 h-9" />
          <Skeleton className="w-44 h-4" />
        </div>

        {/* Streak banner skeleton */}
        <div className="border-y border-zinc-800/80 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12" />
            <div className="space-y-2">
              <Skeleton className="w-36 h-3" />
              <Skeleton className="w-24 h-8" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="w-28 h-3" />
            <Skeleton className="w-32 h-4" />
          </div>
        </div>

        {/* 4 Cards Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-zinc-800 bg-zinc-900/40 p-4 space-y-2">
              <Skeleton className="w-20 h-3" />
              <Skeleton className="w-12 h-7" />
              <Skeleton className="w-full h-1.5" />
            </div>
          ))}
        </div>

        {/* SRS Memory Bars Skeleton */}
        <div className="border border-zinc-800 bg-zinc-900/30 p-5 sm:p-6 space-y-4">
          <Skeleton className="w-40 h-4" />
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-10" />
        </div>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// 3. GAME LIBRARY SKELETON
// ---------------------------------------------------------------------------
export function GameSkeleton() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300 font-sans">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Skeleton className="w-24 h-5" />
          <div className="flex items-center gap-3">
            <Skeleton className="w-24 h-7" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
        </div>
      </header>

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Title row */}
        <div className="border-b border-zinc-800/80 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="w-40 h-3" />
            <Skeleton className="w-64 h-7" />
          </div>
          <Skeleton className="w-48 h-4" />
        </div>

        {/* 2 Game Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6 space-y-5"
            >
              <div className="flex justify-between items-center">
                <Skeleton className="w-28 h-5" />
                <Skeleton className="w-16 h-4" />
              </div>
              <div className="space-y-2">
                <Skeleton className="w-48 h-6" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-4/5 h-4" />
              </div>
              <Skeleton className="w-full h-11" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// 4. SUPPORT SKELETON
// ---------------------------------------------------------------------------
export function SupportSkeleton() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Skeleton className="w-24 h-5" />
          <div className="flex items-center gap-3">
            <Skeleton className="w-28 h-7" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
        </div>
      </header>

      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        <div className="border-b border-zinc-800/80 pb-6 space-y-2">
          <Skeleton className="w-36 h-3" />
          <Skeleton className="w-60 h-8" />
          <Skeleton className="w-full max-w-md h-4" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <Skeleton className="w-36 h-10" />
          <Skeleton className="w-36 h-10" />
        </div>

        {/* Form Body Skeleton */}
        <div className="border border-zinc-800 bg-zinc-900/30 p-5 sm:p-7 space-y-5">
          <div className="space-y-2">
            <Skeleton className="w-32 h-3" />
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="w-28 h-3" />
            <Skeleton className="w-full h-11" />
          </div>
          <div className="space-y-2">
            <Skeleton className="w-28 h-3" />
            <Skeleton className="w-full h-28" />
          </div>
          <Skeleton className="w-full h-11" />
        </div>
      </div>
    </main>
  );
}

