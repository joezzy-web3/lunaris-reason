// components/AmbientLightSweep.tsx
// Ambient sweeping directional light-beam inspired by dark AI-agent landing reference (Video 1)
// Diagonal glowing aurora ray in hot magenta -> violet -> electric indigo -> cyan tones

import React from 'react';

interface AmbientLightSweepProps {
  className?: string;
  intensity?: 'hero' | 'subtle';
}

export function AmbientLightSweep({ className = '', intensity = 'hero' }: AmbientLightSweepProps) {
  const opacityClass = intensity === 'hero' ? 'opacity-45' : 'opacity-20';

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${className}`}
    >
      {/* Primary Diagonal Glossy Aurora Ray from Top-Right (Exact Mya Reference) */}
      <div
        className={`absolute -top-[15%] -right-[10%] w-[900px] lg:w-[1200px] h-[750px] lg:h-[950px] ${opacityClass} filter blur-[70px] transform-gpu pointer-events-none`}
        style={{
          background: `radial-gradient(ellipse 65% 45% at 75% 25%, 
            rgba(244, 63, 94, 0.75) 0%, 
            rgba(217, 70, 239, 0.65) 30%, 
            rgba(139, 92, 246, 0.55) 55%, 
            rgba(56, 189, 248, 0.25) 75%, 
            transparent 100%)`,
          transform: 'rotate(-25deg)',
        }}
      />

      {/* Sweeping Conic Beam Rotation for Ambient Life */}
      <div
        className="absolute -top-[25%] -right-[20%] w-[1100px] h-[1100px] opacity-30 filter blur-[90px] transform-gpu pointer-events-none"
        style={{
          background: `conic-gradient(from 220deg at 65% 35%, 
            rgba(236, 72, 153, 0.6) 0deg, 
            rgba(168, 85, 247, 0.5) 60deg, 
            rgba(99, 102, 241, 0.4) 120deg, 
            rgba(56, 189, 248, 0.3) 180deg, 
            transparent 270deg, 
            rgba(236, 72, 153, 0.6) 360deg)`,
          animation: 'slowSweepRotation 45s linear infinite',
        }}
      />

      {/* Secondary Soft Ambient Glow Pill behind Center Window */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full filter blur-[110px] opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.45) 0%, rgba(244, 63, 94, 0.2) 40%, transparent 75%)',
        }}
      />

      {/* Glossy Top Rim Horizon Specular Glow */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#f43f5e]/10 via-transparent to-transparent pointer-events-none" />

      {/* Subtle Bottom Falloff Scrim */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050508]/30 to-[#050508] pointer-events-none" />
    </div>
  );
}
