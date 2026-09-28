// components/SlideToConvene.tsx
// Institutional "Slide to Authenticate" (Anti-Bot Human Verification)
// Prevents automated bot scripts from spamming the OpenServ inference API
// Implements full pointer and touch tracking with spring reset physics

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronsRight, ShieldCheck, Sparkles, Lock } from 'lucide-react';
import { playCyberClick, playTradeApprovedChime } from '@/lib/soundSynth';

interface SlideToConveneProps {
  onVerified: () => void;
  isDebating: boolean;
  disabled?: boolean;
  ticker: string;
}

export function SlideToConvene({ onVerified, isDebating, disabled = false, ticker }: SlideToConveneProps) {
  const [sliderPosition, setSliderPosition] = useState<number>(0); // 0 to 100%
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const resetSlider = useCallback(() => {
    setSliderPosition(0);
    setIsDragging(false);
    setIsSuccess(false);
  }, []);

  const handleStart = (clientX: number) => {
    if (disabled || isDebating || isSuccess) return;
    setIsDragging(true);
    playCyberClick();
  };

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging || disabled || isDebating || isSuccess) return;
      if (!trackRef.current) return;

      const rect = trackRef.current.getBoundingClientRect();
      const thumbWidth = 44;
      const availableWidth = rect.width - thumbWidth;
      const offsetX = clientX - rect.left - thumbWidth / 2;

      let pct = (offsetX / availableWidth) * 100;
      pct = Math.max(0, Math.min(100, pct));
      setSliderPosition(pct);

      if (pct >= 90) {
        // Human threshold reached - authenticate!
        setIsDragging(false);
        setIsSuccess(true);
        setSliderPosition(100);
        playTradeApprovedChime();
        onVerified();

        // Auto-reset after deliberation starts
        setTimeout(() => {
          resetSlider();
        }, 3000);
      }
    },
    [isDragging, disabled, isDebating, isSuccess, onVerified, resetSlider]
  );

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (sliderPosition < 90) {
      // Spring back to 0
      setSliderPosition(0);
    }
  }, [isDragging, sliderPosition]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onMouseUp = () => handleEnd();
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handleMove(e.touches[0].clientX);
    };
    const onTouchEnd = () => handleEnd();

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  // When debating completes, ensure reset
  useEffect(() => {
    if (!isDebating) {
      resetSlider();
    }
  }, [isDebating, resetSlider]);

  return (
    <div
      ref={trackRef}
      className={`relative h-9 select-none rounded-md overflow-hidden border transition-all duration-150 ${
        isDebating
          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
          : isSuccess
          ? 'bg-emerald-900/40 border-emerald-400 text-white'
          : disabled
          ? 'bg-white/[0.02] border-white/5 opacity-50 cursor-not-allowed'
          : 'bg-[#080b11] border-white/15 hover:border-emerald-500/50 shadow-inner'
      }`}
      style={{ minWidth: '220px' }}
      title="Anti-bot proof-of-human slider: drag right to authenticate and convene the OpenServ council"
    >
      {/* Dynamic Fill Progress Bar */}
      <div
        className={`absolute inset-y-0 left-0 transition-all ${
          isSuccess || isDebating ? 'bg-emerald-500/20' : 'bg-gradient-to-r from-emerald-500/10 to-emerald-500/30'
        }`}
        style={{ width: `${isDebating ? 100 : sliderPosition}%` }}
      />

      {/* Track Instruction Label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-3">
        {isDebating ? (
          <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-300 tracking-wider animate-pulse">
            <Sparkles className="w-3.5 h-3.5 fill-emerald-400" />
            CONVENING OPENSERV COUNCIL...
          </span>
        ) : isSuccess ? (
          <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-300 tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            HUMAN AUTHENTICATED
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] font-mono tracking-wide text-zinc-400 font-semibold group-hover:text-zinc-200">
            <Lock className="w-2.5 h-2.5 text-emerald-400/80 mr-0.5" />
            SLIDE TO CONVENE {ticker || 'COUNCIL'} &gt;&gt;
          </span>
        )}
      </div>

      {/* Draggable Slider Thumb */}
      {!isDebating && (
        <div
          onMouseDown={(e) => handleStart(e.clientX)}
          onTouchStart={(e) => {
            if (e.touches.length > 0) handleStart(e.touches[0].clientX);
          }}
          className={`absolute top-0.5 bottom-0.5 w-10 rounded flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform ${
            isSuccess
              ? 'bg-emerald-400 text-black shadow-[0_0_10px_rgba(52,211,153,0.8)]'
              : disabled
              ? 'bg-zinc-800 text-zinc-600'
              : 'bg-white hover:bg-emerald-300 text-black shadow-md hover:shadow-[0_0_8px_rgba(255,255,255,0.4)]'
          }`}
          style={{
            left: `calc(${sliderPosition}% * (1 - 42px / 100%))`,
            transform: isDragging ? 'scale(1.04)' : 'scale(1)',
          }}
        >
          {isSuccess ? (
            <ShieldCheck className="w-4 h-4 text-black" />
          ) : (
            <ChevronsRight className="w-4 h-4 text-black animate-pulse" />
          )}
        </div>
      )}
    </div>
  );
}
