// components/AmbientIdleCompanion.tsx
// Ambient, muted, looped companion background layer (Video 2 inspiration)
// Strictly decorative, low opacity (15-25%), slight blur, dark overlay scrim.
// Never a click target, aria-hidden="true", respects prefers-reduced-motion.

import React, { useState, useEffect } from 'react';

interface AmbientIdleCompanionProps {
  className?: string;
  videoSrc?: string;
}

export function AmbientIdleCompanion({
  className = '',
  videoSrc = '/media/idle-companion.mp4',
}: AmbientIdleCompanionProps) {
  const [videoFailed, setVideoFailed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden pointer-events-none select-none ${className}`}
    >
      {/* Reduced motion static poster fallback */}
      {prefersReducedMotion ? (
        <div className="absolute inset-0 flex items-center justify-center opacity-20 filter blur-[3px]">
          <OttoStaticFallback />
        </div>
      ) : !videoFailed ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          onError={() => setVideoFailed(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-[5px] contrast-125 saturate-50 pointer-events-none transition-opacity duration-1000"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        /* High-fidelity procedural Otto robot animation fallback if MP4 asset is pending */
        <div className="absolute inset-0 flex items-center justify-center opacity-20 filter blur-[2px] transition-opacity duration-1000">
          <OttoAnimatedFallback />
        </div>
      )}

      {/* Dark overlay scrim to guarantee foreground text/number contrast >= 4.5:1 */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/75 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[#0A0A0C]/40 pointer-events-none" />
    </div>
  );
}

// Procedural SVG rendering matching Otto robot from Video 2
function OttoAnimatedFallback() {
  const [eyeState, setEyeState] = useState<'smile' | 'blink' | 'focus'>('smile');

  useEffect(() => {
    const interval = setInterval(() => {
      setEyeState('blink');
      setTimeout(() => {
        setEyeState(Math.random() > 0.4 ? 'smile' : 'focus');
      }, 250);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-48 h-48 flex items-center justify-center animate-[subtleSway_4s_ease-in-out_infinite]">
      {/* Robot Chassis Head */}
      <div className="relative w-36 h-28 rounded-2xl bg-gradient-to-b from-zinc-200 via-zinc-300 to-zinc-400 p-2 shadow-2xl border border-white/40">
        {/* Head Rim Specular Highlight */}
        <div className="absolute top-1 left-3 right-3 h-2 bg-white/60 rounded-full blur-[1px]" />

        {/* Black Digital Screen Face */}
        <div className="relative w-full h-full rounded-xl bg-[#030305] flex flex-col items-center justify-center p-2 border border-zinc-700/60 shadow-inner">
          {/* Blue Pixel Grid Eyes */}
          <div className="flex items-center gap-4">
            {/* Left Eye */}
            <div className="flex flex-col items-center">
              {eyeState === 'blink' ? (
                <div className="w-4 h-0.5 bg-[#38bdf8] rounded-full shadow-[0_0_8px_#38bdf8]" />
              ) : (
                <div className="w-4 h-3.5 border-t-2 border-r-2 border-l-2 border-[#38bdf8] rounded-t-lg shadow-[0_0_8px_#38bdf8] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#38bdf8] rounded-xs" />
                </div>
              )}
            </div>

            {/* Right Eye */}
            <div className="flex flex-col items-center">
              {eyeState === 'blink' ? (
                <div className="w-4 h-0.5 bg-[#38bdf8] rounded-full shadow-[0_0_8px_#38bdf8]" />
              ) : (
                <div className="w-4 h-3.5 border-t-2 border-r-2 border-l-2 border-[#38bdf8] rounded-t-lg shadow-[0_0_8px_#38bdf8] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#38bdf8] rounded-xs" />
                </div>
              )}
            </div>
          </div>

          {/* Blue Pixel Mouth (Smile) */}
          <div className="mt-1.5 w-3 h-1 border-b-2 border-[#38bdf8] rounded-b-md shadow-[0_0_6px_#38bdf8]" />
        </div>
      </div>
    </div>
  );
}

function OttoStaticFallback() {
  return (
    <div className="w-36 h-28 rounded-2xl bg-zinc-300 p-2 border border-white/30">
      <div className="w-full h-full rounded-xl bg-black flex items-center justify-center">
        <div className="flex gap-4">
          <div className="w-4 h-3 border-t-2 border-cyan-400 rounded-t-lg" />
          <div className="w-4 h-3 border-t-2 border-cyan-400 rounded-t-lg" />
        </div>
      </div>
    </div>
  );
}
