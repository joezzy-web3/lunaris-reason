import React, { useState, useEffect } from 'react';
import { useLiveMarketQuotes, AssetQuote } from '@/lib/livePrices';
import { playCyberClick } from '@/lib/soundSynth';
import {
  Sparkles,
  X,
  ChevronRight,
  Clock,
  Landmark,
  ShieldCheck,
} from 'lucide-react';

interface UsStockExpansionBannerProps {
  onSelectTicker?: (ticker: string) => void;
  onNavigateTab?: (tab: 'TERMINAL' | 'AUTOPILOT' | 'COUNCIL' | 'AUDIT' | 'MATRIX') => void;
}

// OpenServ Hackathon Edition 01 Window: Active through judging
const ANNOUNCEMENT_EXPIRY_TIMESTAMP = new Date('2026-10-05T23:59:59Z').getTime();
const STORAGE_KEY = 'OPENSERV_RWA_EXPANSION_BANNER_DISMISSED_V1';

const RWA_TICKERS = [
  { ticker: 'UST10Y', name: 'US 10Y Treasury Vault', tag: '5.15% APY' },
  { ticker: 'TBILL', name: '3M T-Bill Note', tag: '5.28% APY' },
  { ticker: 'PAXG', name: 'Physical Gold Spot', tag: 'LBMA Vault' },
  { ticker: 'REIT', name: 'Commercial Property', tag: '6.40% Yield' },
  { ticker: 'WTI', name: 'Crude Oil RWA', tag: 'Commodity' },
];

export const UsStockExpansionBanner: React.FC<UsStockExpansionBannerProps> = ({
  onSelectTicker,
  onNavigateTab,
}) => {
  const [isExpired, setIsExpired] = useState<boolean>(() => Date.now() >= ANNOUNCEMENT_EXPIRY_TIMESTAMP);

  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [hoursRemaining, setHoursRemaining] = useState<number>(24);
  const { quotes, getQuote } = useLiveMarketQuotes();

  // Compute countdown to submission deadline (Sep 28, 2026 00:00 UTC)
  useEffect(() => {
    const deadline = new Date('2026-09-28T00:00:00Z').getTime();
    const updateCountdown = () => {
      const now = Date.now();
      const msLeft = Math.max(0, deadline - now);
      const hours = Math.floor(msLeft / (60 * 60 * 1000));
      setHoursRemaining(hours);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    playCyberClick();
    setIsDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {}
  };

  const handleReopen = () => {
    playCyberClick();
    setIsDismissed(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  if (isExpired) {
    return null;
  }

  if (isDismissed) {
    return (
      <div className="w-full bg-[#0a0c14]/90 border-b border-cyan-500/20 py-1.5 px-4 text-xs font-mono flex items-center justify-between text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F0FF]"></span>
          </span>
          <span className="text-zinc-300 font-semibold">OpenServ RWA Engine:</span>
          <span>Tokenized Real-World Asset (RWA) Vaults (UST10Y, TBILL, PAXG, REIT)</span>
        </div>
        <button
          onClick={handleReopen}
          className="text-cyan-400 hover:text-white transition-colors cursor-pointer text-[11px] underline"
        >
          Expand Details
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-[#070b14] via-[#091224] to-[#070b14] border-b border-cyan-500/25 py-2.5 px-4 text-xs font-mono relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 relative z-10">
        {/* Left Badge + Title */}
        <div className="flex items-center gap-2.5">
          <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-bold border border-cyan-400/30 text-[10px] flex items-center gap-1.5 shadow-sm">
            <Landmark className="w-3 h-3 text-cyan-400" />
            <span>OPENSERV // AUTONOMOUS RWA VAULTS</span>
          </span>
          <span className="text-zinc-200 hidden sm:inline font-semibold">
            Licensed Yield Vaults & Primary NAV Arbitrage Live
          </span>
        </div>

        {/* Ticker Badges */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1">
          {RWA_TICKERS.map((item) => {
            const quote = getQuote(item.ticker);
            const priceStr = quote.price >= 100 ? `$${quote.price.toFixed(2)}` : `$${quote.price.toFixed(4)}`;

            return (
              <button
                key={item.ticker}
                onClick={() => {
                  playCyberClick();
                  onSelectTicker?.(item.ticker);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-cyan-500/10 border border-white/[0.08] hover:border-cyan-400/40 text-zinc-300 hover:text-white transition-all cursor-pointer text-[11px] shrink-0"
              >
                <span className="font-bold text-white">{item.ticker}</span>
                <span className="text-cyan-400 font-semibold">{item.tag}</span>
                <span className="text-zinc-400 text-[10px] tabular-nums">{priceStr}</span>
              </button>
            );
          })}
        </div>

        {/* Right CTA + Dismiss */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playCyberClick();
              onNavigateTab?.('MATRIX');
            }}
            className="text-cyan-400 hover:text-white transition-colors cursor-pointer text-[11px] font-bold flex items-center gap-1 shrink-0"
          >
            <span>View RWA Matrix</span>
            <ChevronRight className="w-3 h-3" />
          </button>
          <button
            onClick={handleDismiss}
            className="text-zinc-400 hover:text-zinc-200 p-1 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
            title="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
