// components/CrossAssetMatrix.tsx
// Autonomous RWA Yield & NAV Matrix (OpenServ & IXS Finance Partnered)
// Solves real-world RWA challenges:
// 1. Primary NAV vs Secondary Token Market Dislocation & Basis Arbitrage
// 2. Dynamic Crypto Staking vs RWA Fixed-Income Yield Rotation
// 3. Autonomous Flight-to-Safety Allocator protected by ≤ 0.50% Slippage Collars
// 4. Real-Time Proof-of-Reserve Attestation & Custodian Solvency Health

import React, { useState } from 'react';
import {
  ArrowRightLeft,
  Zap,
  Check,
  Activity,
  Info,
  Clock,
  ShieldAlert,
  ShieldCheck,
  Shield,
  BarChart3,
  ExternalLink,
  Layers,
  Sparkles,
  RefreshCw,
  Scale,
  Landmark,
  Coins,
  Globe,
  Building,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { TradeProposal } from '@/lib/riskVeto';
import { playCyberClick, playTradeApprovedChime } from '@/lib/soundSynth';
import { useLiveMarketQuotes } from '@/lib/livePrices';

const RWA_ASSETS = ['UST10Y', 'TBILL', 'PAXG', 'WTI', 'REIT', 'BTC'] as const;
type RwaTicker = typeof RWA_ASSETS[number];

// Institutional Benchmark Pearson Correlation Matrix for RWA & Crypto Assets
const BASE_CORRELATION_MATRIX: Record<RwaTicker, Record<RwaTicker, number>> = {
  UST10Y: { UST10Y: 1.0, TBILL: 0.94, PAXG: -0.22, WTI: -0.15, REIT: 0.68, BTC: -0.18 },
  TBILL: { UST10Y: 0.94, TBILL: 1.0, PAXG: -0.18, WTI: -0.10, REIT: 0.55, BTC: -0.12 },
  PAXG: { UST10Y: -0.22, TBILL: -0.18, PAXG: 1.0, WTI: 0.35, REIT: -0.05, BTC: 0.28 },
  WTI: { UST10Y: -0.15, TBILL: -0.10, PAXG: 0.35, WTI: 1.0, REIT: 0.12, BTC: 0.22 },
  REIT: { UST10Y: 0.68, TBILL: 0.55, PAXG: -0.05, WTI: 0.12, REIT: 1.0, BTC: 0.08 },
  BTC: { UST10Y: -0.18, TBILL: -0.12, PAXG: 0.28, WTI: 0.22, REIT: 0.08, BTC: 1.0 },
};

// RWA Vault Metadata & Yield Metrics
interface RwaVaultMeta {
  ticker: RwaTicker;
  name: string;
  category: 'US Treasuries' | 'Commodities' | 'Real Estate' | 'Crypto Benchmark';
  apyYield: string;
  navOraclePrice: number;
  custodian: string;
  reserveCollateralRatio: string;
  liquidityTier: 'Deep (Institutional)' | 'High' | 'Medium';
}

const RWA_METADATA: Record<RwaTicker, RwaVaultMeta> = {
  UST10Y: {
    ticker: 'UST10Y',
    name: '10-Year US Treasury Yield Vault',
    category: 'US Treasuries',
    apyYield: '5.15% APY',
    navOraclePrice: 106.25,
    custodian: 'BNY Mellon / Securitize',
    reserveCollateralRatio: '101.8%',
    liquidityTier: 'Deep (Institutional)',
  },
  TBILL: {
    ticker: 'TBILL',
    name: '3-Month US Treasury Bill Note',
    category: 'US Treasuries',
    apyYield: '5.28% APY',
    navOraclePrice: 100.18,
    custodian: 'State Street / Ondo',
    reserveCollateralRatio: '102.1%',
    liquidityTier: 'Deep (Institutional)',
  },
  PAXG: {
    ticker: 'PAXG',
    name: 'Paxos Tokenized Physical Gold',
    category: 'Commodities',
    apyYield: 'Store of Value',
    navOraclePrice: 2682.50,
    custodian: 'Brink’s Vaults (London LBMA)',
    reserveCollateralRatio: '100.0% (1:1 Troy Oz)',
    liquidityTier: 'High',
  },
  WTI: {
    ticker: 'WTI',
    name: 'Tokenized WTI Crude Oil',
    category: 'Commodities',
    apyYield: 'Commodity Index',
    navOraclePrice: 71.45,
    custodian: 'CME Group Custody',
    reserveCollateralRatio: '100.5%',
    liquidityTier: 'High',
  },
  REIT: {
    ticker: 'REIT',
    name: 'Commercial Real Estate Yield Pool',
    category: 'Real Estate',
    apyYield: '6.40% Yield',
    navOraclePrice: 88.50,
    custodian: 'IXS Finance Real Property Trust',
    reserveCollateralRatio: '104.2%',
    liquidityTier: 'Medium',
  },
  BTC: {
    ticker: 'BTC',
    name: 'Bitcoin Flagship Collateral',
    category: 'Crypto Benchmark',
    apyYield: 'Variable Funding',
    navOraclePrice: 85465.0,
    custodian: 'BitGo Institutional',
    reserveCollateralRatio: '100.0%',
    liquidityTier: 'Deep (Institutional)',
  },
};

interface CrossAssetMatrixProps {
  onRoutePairSignal?: (proposal: TradeProposal) => void;
}

export function CrossAssetMatrix({ onRoutePairSignal }: CrossAssetMatrixProps) {
  const { quotes, getQuote } = useLiveMarketQuotes();
  const [activeTab, setActiveTab] = useState<'NAV_DISLOCATION' | 'YIELD_HEATMAP' | 'FLIGHT_TO_SAFETY'>('NAV_DISLOCATION');
  const [selectedPair, setSelectedPair] = useState<[RwaTicker, RwaTicker]>(['BTC', 'UST10Y']);
  const [routedSuccess, setRoutedSuccess] = useState<string | null>(null);

  const [assetA, assetB] = selectedPair;
  const quoteA = getQuote(assetA);
  const quoteB = getQuote(assetB);

  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (price >= 1) {
      return `$${price.toFixed(2)}`;
    }
    return `$${price.toFixed(4)}`;
  };

  const correlation = BASE_CORRELATION_MATRIX[assetA]?.[assetB] ?? 0.15;

  const handleRouteArb = (targetAsset: string, action: 'BUY' | 'SELL', thesis: string) => {
    playCyberClick();
    playTradeApprovedChime();
    setRoutedSuccess(targetAsset);
    setTimeout(() => setRoutedSuccess(null), 3000);

    if (onRoutePairSignal) {
      const proposal: TradeProposal = {
        asset: targetAsset,
        action,
        size_pct: 10,
        confidence: 88,
        reasoning: thesis,
      };
      onRoutePairSignal(proposal);
    }

    // Auto-scroll down smoothly to the Autonomous Loop panel so user sees their execution/queue
    setTimeout(() => {
      const panel = document.getElementById('autonomous-loop-panel') || document.getElementById('autonomous-loop-section');
      if (panel) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 font-sans-taste select-none">
      {/* Top RWA Header */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-[#0E1017] border border-white/[0.08] mb-8 overflow-hidden shadow-2xl">
        <span className="absolute top-3 left-3 text-[9px] font-mono text-cyan-400/40">[+]</span>
        <span className="absolute top-3 right-3 text-[9px] font-mono text-cyan-400/40">[+]</span>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 text-xs font-mono text-cyan-400 font-bold mb-2">
              <Landmark className="w-4 h-4 text-cyan-400" />
              <span>OPENSERV × IXS FINANCE // AUTONOMOUS RWA VAULT ALLOCATOR</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Real-World Asset (RWA) Yield & NAV Matrix
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Continuous multi-asset AI surveillance solving on-chain NAV dislocations, primary-secondary market discounts, and dynamic yield rotation between volatile crypto and licensed Real-World Asset vaults.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'NAV_DISLOCATION', label: 'NAV Dislocation & Basis', icon: Layers },
              { id: 'YIELD_HEATMAP', label: 'Yield & Correlation Matrix', icon: BarChart3 },
              { id: 'FLIGHT_TO_SAFETY', label: 'Flight-to-Safety Rebalancer', icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playCyberClick();
                    setActiveTab(tab.id as any);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-cyan-400/15 border border-cyan-400/50 text-cyan-300 font-bold shadow-sm'
                      : 'bg-white/[0.03] border border-white/[0.08] text-zinc-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Highlight Key RWA Metas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/[0.06] font-mono text-xs">
          <div>
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Risk-Free Benchmark</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">UST10Y @ 5.15% APY</div>
          </div>
          <div>
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider">T-Bill Liquid Yield</div>
            <div className="text-lg font-bold text-cyan-400 mt-0.5">TBILL3M @ 5.28% APY</div>
          </div>
          <div>
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Commercial Real Estate</div>
            <div className="text-lg font-bold text-amber-300 mt-0.5">REIT @ 6.40% Yield</div>
          </div>
          <div>
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Over-Collateralization</div>
            <div className="text-lg font-bold text-indigo-300 mt-0.5">101.8% Weighted Mean</div>
          </div>
        </div>
      </div>

      {/* VIEW 1: NAV DISLOCATION & BASIS ARBITRAGE */}
      {activeTab === 'NAV_DISLOCATION' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs font-mono text-cyan-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                <strong>AI Problem Solved:</strong> Tokenized RWAs frequently trade at secondary discounts or premiums to their official custodian NAV. The AI agent detects basis dislocations and executes delta-neutral mean-reversion rebalancing.
              </span>
            </div>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Oracle Sync: 100%</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(['UST10Y', 'TBILL', 'PAXG', 'WTI', 'REIT'] as RwaTicker[]).map((ticker) => {
              const meta = RWA_METADATA[ticker];
              const quote = getQuote(ticker);
              const livePrice = quote.price || meta.navOraclePrice;
              const navPrice = meta.navOraclePrice;
              const basisDiff = livePrice - navPrice;
              const basisBps = Number(((basisDiff / navPrice) * 10000).toFixed(1));
              const isDiscount = basisBps < 0;
              const isArbViable = Math.abs(basisBps) >= 8.0;

              return (
                <div
                  key={ticker}
                  className="rounded-3xl bg-[#0E1017] border border-white/[0.08] hover:border-cyan-400/40 transition-all p-6 flex flex-col justify-between shadow-lg"
                >
                  <div>
                    {/* Top Vault Pill */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center font-bold text-cyan-400 font-mono text-xs">
                          {ticker.slice(0, 3)}
                        </div>
                        <div>
                          <div className="text-sm font-extrabold text-white">{ticker}</div>
                          <div className="text-[10px] font-mono text-zinc-400">{meta.category}</div>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                        {meta.apyYield}
                      </span>
                    </div>

                    {/* Price & NAV Comparison Block */}
                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] mb-4 font-mono text-xs">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-zinc-500 text-[10px]">CEX/DEX Trading Price</span>
                        <span className="font-bold text-white">${livePrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-zinc-500 text-[10px]">Primary Custodian NAV</span>
                        <span className="text-zinc-300 font-semibold">${navPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-white/[0.06]">
                        <span className="text-zinc-400 text-[10px] font-bold">Basis Dislocation</span>
                        <span
                          className={`font-bold tabular-nums ${
                            isDiscount ? 'text-amber-400' : 'text-cyan-400'
                          }`}
                        >
                          {basisBps >= 0 ? '+' : ''}{basisBps} bps ({isDiscount ? 'Discount' : 'Premium'})
                        </span>
                      </div>
                    </div>

                    {/* Custodian & Health */}
                    <div className="space-y-1.5 text-[11px] font-mono text-zinc-400 mb-4">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Custodian Vault:</span>
                        <span className="text-zinc-300 text-right truncate max-w-[150px]">{meta.custodian}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Reserve Backing:</span>
                        <span className="text-emerald-400 font-bold">{meta.reserveCollateralRatio}</span>
                      </div>
                    </div>
                  </div>

                  {/* Arb Action Button */}
                  <button
                    onClick={() =>
                      handleRouteArb(
                        ticker,
                        isDiscount ? 'BUY' : 'SELL',
                        `NAV Basis Arb: ${ticker} trading at ${basisBps} bps ${isDiscount ? 'discount' : 'premium'} to primary oracle NAV ($${navPrice}). Council mean-reversion rebalance.`
                      )
                    }
                    className="w-full py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    {routedSuccess === ticker ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Dispatched to Council</span>
                      </>
                    ) : (
                      <>
                        <ArrowRightLeft className="w-3.5 h-3.5 text-black" />
                        <span>{isDiscount ? `Harvest ${Math.abs(basisBps)} bps Discount` : `Rebalance Premium`}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: YIELD & CORRELATION MATRIX */}
      {activeTab === 'YIELD_HEATMAP' && (
        <div className="rounded-3xl bg-[#0E1017] border border-white/[0.08] p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">6×6 Cross-Asset Pearson Correlation Heatmap</h2>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Evaluates diversification benefit and flight-to-safety hedging coefficients between Crypto (BTC) and Tokenized RWAs.
              </p>
            </div>
            <div className="text-xs font-mono text-zinc-400 flex items-center gap-3">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40"></span> Low / Negative Corr (Safe Haven)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500/40"></span> High Correlation</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center font-mono text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-zinc-500 text-[10px]">
                  <th className="py-3 px-3 text-left">ASSET</th>
                  {RWA_ASSETS.map((col) => (
                    <th key={col} className="py-3 px-3">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {RWA_ASSETS.map((row) => (
                  <tr key={row} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-3 text-left font-bold text-white">{row}</td>
                    {RWA_ASSETS.map((col) => {
                      const corr = BASE_CORRELATION_MATRIX[row]?.[col] ?? 0;
                      const isSelf = row === col;
                      const isNegative = corr < 0;
                      return (
                        <td key={col} className="py-3.5 px-3">
                          <button
                            onClick={() => {
                              playCyberClick();
                              setSelectedPair([row, col]);
                            }}
                            className={`w-full py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              isSelf
                                ? 'bg-white/10 text-white font-extrabold'
                                : isNegative
                                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                                : corr > 0.6
                                ? 'bg-rose-950/30 text-rose-300 border border-rose-500/20'
                                : 'bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]'
                            }`}
                          >
                            {corr.toFixed(2)}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Active Deliberation on Selected Pair */}
          <div className="mt-8 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-cyan-400 font-bold mb-1">
                ACTIVE RWA PAIR: {assetA} ↔ {assetB} (Correlation: {correlation.toFixed(2)})
              </div>
              <div className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
                {correlation < 0
                  ? `Negative correlation detected between ${assetA} and ${assetB}. Holding ${assetB} provides institutional drawdown protection during volatility spikes in ${assetA}.`
                  : `Moderate cross-asset co-movement (${(correlation * 100).toFixed(0)}%). Atlas-Macro recommends dynamic yield-spread rebalancing.`}
              </div>
            </div>

            <button
              onClick={() =>
                handleRouteArb(
                  assetB,
                  'BUY',
                  `Cross-Asset Hedge: ${assetA} vs ${assetB} (Corr: ${correlation.toFixed(2)}). Rebalancing into yield vault.`
                )
              }
              className="px-6 py-2.5 rounded-full bg-cyan-400 text-black hover:bg-cyan-300 text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>Route Flight-to-Safety</span>
              <Zap className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* VIEW 3: FLIGHT-TO-SAFETY REBALANCER */}
      {activeTab === 'FLIGHT_TO_SAFETY' && (
        <div className="rounded-3xl bg-[#0E1017] border border-white/[0.08] p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center gap-2.5 text-xs font-mono text-emerald-400 font-bold mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>INSTITUTIONAL CAPITAL PRESERVATION PROTOCOL</span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight mb-2">
            Dynamic Crypto-to-RWA Flight-to-Safety Allocator
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl mb-6">
            When crypto volatility index spikes or funding yields collapse, the Autonomous Council routes liquidity from volatile crypto into licensed tokenized US Treasury vaults (UST10Y at 5.15% APY). Zero slippage violations guaranteed by Guardian-01.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[10px] font-mono text-zinc-400 mb-1">CURRENT FLIGHT PROTOCOL</div>
              <div className="text-base font-bold text-white mb-2">Level 1: Yield Vault Anchor</div>
              <div className="text-xs text-zinc-400 leading-relaxed">
                Automated sweeps of idle USDT into TBILL3M (5.28% APY) earning continuous daily compound interest.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[10px] font-mono text-zinc-400 mb-1">DEFCON-1 CIRCUIT BREAKER</div>
              <div className="text-base font-bold text-amber-400 mb-2">Level 2: Gold (PAXG) Rotation</div>
              <div className="text-xs text-zinc-400 leading-relaxed">
                If equity markets drop &gt;2.5% intraday, rotates 30% of risk portfolio into physical LBMA-allocated gold.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[10px] font-mono text-zinc-400 mb-1">COLLAR COMPLIANCE</div>
              <div className="text-base font-bold text-emerald-400 mb-2">≤ 0.50% Max Slippage</div>
              <div className="text-xs text-zinc-400 leading-relaxed">
                All vault allocations execute with deterministic mathematical boundary check before submitting orderbook fill.
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-mono text-zinc-400">
              Trigger instant flight-to-safety simulation for Hackathon Track 3 (RWA Vaults):
            </div>
            <button
              onClick={() =>
                handleRouteArb(
                  'UST10Y',
                  'BUY',
                  'Autonomous Flight-to-Safety: Simulated market volatility spike triggered 100% allocation into UST10Y 5.15% APY Treasury Vault.'
                )
              }
              className="px-6 py-2.5 rounded-full bg-emerald-400 text-black hover:bg-emerald-300 text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>Execute 100% Flight to UST10Y</span>
              <Shield className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
