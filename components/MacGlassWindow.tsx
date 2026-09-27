// components/MacGlassWindow.tsx
// Glossy Apple UI glass window container with traffic-light dots and specular rim shine (Exact Video 1 Inspiration)

import React from 'react';

interface MacGlassWindowProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  className?: string;
}

export function MacGlassWindow({
  children,
  title,
  subtitle,
  headerRight,
  className = '',
}: MacGlassWindowProps) {
  return (
    <div
      className={`relative rounded-[32px] bg-[#0a0b12]/80 backdrop-blur-2xl border border-white/[0.12] overflow-hidden transition-all duration-300 hover:border-white/[0.2] ${className}`}
      style={{
        boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.22), 0 30px 100px -20px rgba(0, 0, 0, 0.85)',
      }}
    >
      {/* Top Gloss Specular Gradient Sheen */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

      {/* Corner Crosshair Reticles (§3c design grammar) */}
      <span className="absolute top-2.5 left-3 text-[9px] font-mono text-cyan-400/30 select-none pointer-events-none">[+]</span>
      <span className="absolute top-2.5 right-3 text-[9px] font-mono text-cyan-400/30 select-none pointer-events-none">[+]</span>
      <span className="absolute bottom-2.5 left-3 text-[9px] font-mono text-cyan-400/30 select-none pointer-events-none">[+]</span>
      <span className="absolute bottom-2.5 right-3 text-[9px] font-mono text-cyan-400/30 select-none pointer-events-none">[+]</span>

      {/* Window Top Bar with macOS Traffic Lights */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/[0.08] bg-white/[0.02] select-none">
        <div className="flex items-center gap-4">
          {/* macOS Traffic Lights */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-[0_0_8px_rgba(255,95,86,0.6)] hover:brightness-110 transition-all cursor-pointer" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-[0_0_8px_rgba(255,189,46,0.6)] hover:brightness-110 transition-all cursor-pointer" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] shadow-[0_0_8px_rgba(39,201,63,0.6)] hover:brightness-110 transition-all cursor-pointer" />
          </div>

          {/* Window Title (Two-tone header grammar: bright white title + warm gray status) */}
          {title && (
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-semibold tracking-wide text-white">{title}</span>
              {subtitle && (
                <>
                  <span className="text-zinc-600 text-xs">/</span>
                  <span className="text-[11px] text-zinc-400 font-mono tracking-tight">{subtitle}</span>
                </>
              )}
            </div>
          )}
        </div>

        {headerRight && <div className="flex items-center gap-2">{headerRight}</div>}
      </div>

      {/* Main Content Area */}
      <div className="relative p-5 sm:p-6 lg:p-8">{children}</div>
    </div>
  );
}
