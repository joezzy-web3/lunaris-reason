// components/InfinityLoopMark.tsx
// Animated gradient infinity loop mark (Video 1 reference)

import React from 'react';

interface InfinityLoopMarkProps {
  className?: string;
  size?: number;
}

export function InfinityLoopMark({ className = '', size = 52 }: InfinityLoopMarkProps) {
  return (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size * 0.6 }}
    >
      <svg
        viewBox="0 0 100 60"
        className="w-full h-full overflow-visible drop-shadow-[0_0_12px_rgba(168,85,247,0.45)]"
      >
        <defs>
          <linearGradient id="infinityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="40%" stopColor="#818cf8" />
            <stop offset="75%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
          <linearGradient id="infinityGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Ambient Glow Trail */}
        <path
          d="M 30,30 C 15,10 0,20 0,30 C 0,40 15,50 30,30 C 45,10 55,10 70,30 C 85,50 100,40 100,30 C 100,20 85,10 70,30 C 55,50 45,50 30,30 Z"
          fill="none"
          stroke="url(#infinityGlow)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-30 filter blur-[4px]"
        />

        {/* Core Animated Infinity Track */}
        <path
          d="M 30,30 C 15,10 0,20 0,30 C 0,40 15,50 30,30 C 45,10 55,10 70,30 C 85,50 100,40 100,30 C 100,20 85,10 70,30 C 55,50 45,50 30,30 Z"
          fill="none"
          stroke="url(#infinityGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Orbiting Quantum Spark Node */}
        <circle r="2.5" fill="#ffffff" className="filter drop-shadow-[0_0_6px_#38bdf8]">
          <animateMotion
            path="M 30,30 C 15,10 0,20 0,30 C 0,40 15,50 30,30 C 45,10 55,10 70,30 C 85,50 100,40 100,30 C 100,20 85,10 70,30 C 55,50 45,50 30,30 Z"
            dur="6s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}
