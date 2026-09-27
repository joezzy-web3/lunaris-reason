// components/CommandDeckHero.tsx
// LUNARIS REASON — Re-Architected Command Deck Hero
// Incorporating §3a Ambient Light Sweep, Glass macOS Window, Session-Grouped History Rail,
// Quick-Command Chips, Animated Infinity Loop, Wireframe Sphere, and §3b Idle Companion Layer.

import React, { useState } from 'react';
import { WireframeSphere } from './WireframeSphere';
import { AmbientLightSweep } from './AmbientLightSweep';
import { AmbientIdleCompanion } from './AmbientIdleCompanion';
import { MacGlassWindow } from './MacGlassWindow';
import { InfinityLoopMark } from './InfinityLoopMark';
import {
  Sparkles,
  Bell,
  CheckSquare,
  Clock,
  Users,
  Play,
  RotateCcw,
  FileCheck2,
  Layers,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Cpu,
  Activity,
  Compass,
} from 'lucide-react';
import { playCyberClick } from '@/lib/soundSynth';
import { useAutopilot } from '@/context/AutopilotContext';

interface CommandDeckHeroProps {
  onLaunchCouncil: (ticker?: string) => void;
  onOpenMatrix: () => void;
  onOpenAuditLedger: () => void;
  onOpenProofCertificates: () => void;
  onTriggerVetoDrill: () => void;
}

export function CommandDeckHero({
  onLaunchCouncil,
  onOpenMatrix,
  onOpenAuditLedger,
  onOpenProofCertificates,
  onTriggerVetoDrill,
}: CommandDeckHeroProps) {
  const { ledger } = useAutopilot();
  const [activeRailNav, setActiveRailNav] = useState<'ACTIVITY' | 'ALERTS' | 'COUNCIL' | 'TASKS'>('ACTIVITY');

  // Bucket trades by Today / Yesterday / This Week from the V2 ledger
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const yesterday = new Date(now.getTime() - 86400000).toISOString().slice(0, 10);

  const todayEntries = ledger.filter((l) => l.utcTimestamp?.startsWith(todayStr));
  const yesterdayEntries = ledger.filter((l) => l.utcTimestamp?.startsWith(yesterday));
  const thisWeekEntries = ledger.filter(
    (l) => !l.utcTimestamp?.startsWith(todayStr) && !l.utcTimestamp?.startsWith(yesterday)
  );

  return (
    <div className="relative w-full min-h-[780px] pt-4 pb-12 px-3 sm:px-6 select-none overflow-hidden font-sans-taste">
      {/* Ambient Sweeping Directional Light-Beam (§3a reference) */}
      <AmbientLightSweep intensity="hero" />

      {/* Decorative Otto Companion Background Layer in idle hero zone (§3b reference) */}
      <div className="absolute right-0 top-10 w-[420px] h-[420px] pointer-events-none opacity-20 filter blur-[4px]">
        <AmbientIdleCompanion />
      </div>

      <div className="relative max-w-6xl mx-auto z-10 pt-4">
        {/* Hero Title Section Above Window (Exact Video Inspiration) */}
        <div className="text-center mb-8 sm:mb-12 animate-fadeIn">
          {/* Top Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md mb-4 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold tracking-wider text-zinc-300 uppercase">
              AI Agentic Cross-Asset Trading Terminal
            </span>
          </div>

          {/* Big Bold Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Trade Faster, Reason Deeper, Ship Alpha
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-zinc-400 mt-3 max-w-2xl mx-auto font-normal leading-relaxed">
            Autonomous multi-agent quorum deliberation bridging crypto momentum, 24/7 tokenized equities, and licensed RWA vaults.
          </p>
        </div>

        {/* Hero Glass Application Window (Exact Mya UI Video Reference) */}
        <MacGlassWindow
          title="LUNARIS COCKPIT"
          subtitle="AUTONOMOUS CROSS-ASSET ENGINE"
          headerRight={
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] text-zinc-300 border border-white/[0.1] text-[11px] font-mono font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                V2 SANDBOX ACTIVE
              </span>
            </div>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
            {/* Left Rail: Circular Navigation Icons + Time-Bucketed History */}
            <div className="lg:col-span-4 border-r border-white/[0.06] pr-0 lg:pr-6 flex flex-col justify-between">
              <div>
                {/* Circular Action Icons Rail Header */}
                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-white/[0.06]">
                  <button
                    onClick={() => {
                      playCyberClick();
                      setActiveRailNav('ACTIVITY');
                    }}
                    title="Activity Stream"
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      activeRailNav === 'ACTIVITY'
                        ? 'bg-white/15 text-white border border-white/30 shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                        : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      playCyberClick();
                      setActiveRailNav('COUNCIL');
                      onLaunchCouncil();
                    }}
                    title="Council Quorum"
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      activeRailNav === 'COUNCIL'
                        ? 'bg-white/15 text-white border border-white/30 shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                        : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      playCyberClick();
                      setActiveRailNav('TASKS');
                      onOpenMatrix();
                    }}
                    title="Cross-Asset Allocations"
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      activeRailNav === 'TASKS'
                        ? 'bg-white/15 text-white border border-white/30 shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                        : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      playCyberClick();
                      setActiveRailNav('ALERTS');
                      onTriggerVetoDrill();
                    }}
                    title="Deterministic Risk Engine"
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      activeRailNav === 'ALERTS'
                        ? 'bg-white/15 text-white border border-white/30 shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                        : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4" />
                  </button>
                </div>

                {/* Session-Grouped History Rail (Exact Video 1 Pattern: Today / Yesterday / This Week) */}
                <div className="space-y-4 font-mono text-xs">
                  {/* Today Bucket */}
                  <div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                      <span className="text-zinc-300">Today</span>
                      <span className="text-[9px] text-zinc-400">{todayEntries.length > 0 ? `${todayEntries.length} events` : 'Ready'}</span>
                    </div>
                    {todayEntries.length === 0 ? (
                      <div className="space-y-1.5">
                        <div className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-zinc-300 text-xs flex items-center gap-2 hover:bg-white/[0.06] transition-colors cursor-pointer" onClick={() => onLaunchCouncil('BTC')}>
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                          <span className="truncate">Orderbook Depth Scan (BTC/SOL)</span>
                        </div>
                        <div className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-zinc-300 text-xs flex items-center gap-2 hover:bg-white/[0.06] transition-colors cursor-pointer" onClick={onOpenMatrix}>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <span className="truncate">RWA Treasury Corridor (5.15% APY)</span>
                        </div>
                        <div className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-zinc-300 text-xs flex items-center gap-2 hover:bg-white/[0.06] transition-colors cursor-pointer" onClick={onTriggerVetoDrill}>
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                          <span className="truncate">Guardian 0.5% Slippage Collar</span>
                        </div>
                        <div className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-zinc-300 text-xs flex items-center gap-2 hover:bg-white/[0.06] transition-colors cursor-pointer" onClick={onOpenProofCertificates}>
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                          <span className="truncate">Reasoning Proof Registry</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {todayEntries.slice(0, 4).map((entry) => (
                          <button
                            key={entry.id}
                            onClick={() => {
                              playCyberClick();
                              onOpenAuditLedger();
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] transition-all flex items-center justify-between group cursor-pointer"
                          >
                            <span className="text-zinc-200 group-hover:text-white truncate max-w-[170px] flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full ${(entry.realizedPnl || 0) >= 0 ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                              <span>{entry.type} {entry.ticker}</span>
                            </span>
                            <span
                              className={`text-[10px] tabular-nums font-semibold ${
                                (entry.realizedPnl || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              {(entry.realizedPnl || 0) >= 0 ? '+' : ''}${Math.abs(entry.realizedPnl || 0).toFixed(2)}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Yesterday Bucket */}
                  <div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                      <span className="text-zinc-400">Yesterday</span>
                      <span className="text-[9px] text-zinc-400">Archived</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="px-3 py-1.5 rounded-lg bg-white/[0.02] text-zinc-400 flex items-center gap-2">
                        <span className="text-zinc-600">✓</span>
                        <span className="truncate">Autonomous Take-Profit on ETH</span>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-white/[0.02] text-zinc-400 flex items-center gap-2">
                        <span className="text-zinc-600">✓</span>
                        <span className="truncate">Rebalance to Tokenized OUSG</span>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-white/[0.02] text-zinc-400 flex items-center gap-2">
                        <span className="text-zinc-600">✓</span>
                        <span className="truncate">Map Feature Dependencies</span>
                      </div>
                    </div>
                  </div>

                  {/* This Week Bucket */}
                  <div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                      <span className="text-zinc-400">This Week</span>
                      <span className="text-[9px] text-zinc-400">Protocol</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="px-3 py-1.5 rounded-lg bg-white/[0.015] text-zinc-400 flex items-center gap-2">
                        <span className="text-zinc-600">•</span>
                        <span className="truncate">OpenServ Revenue Escrow Check</span>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-white/[0.015] text-zinc-400 flex items-center gap-2">
                        <span className="text-zinc-600">•</span>
                        <span className="truncate">Refine Bounded Quorum Model</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Metric */}
              <div className="pt-4 border-t border-white/[0.06] mt-4 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">V2 AUDIT LEDGER:</span>
                <span className="text-white font-bold tabular-nums">{ledger.length} TOTAL RECORDS</span>
              </div>
            </div>

            {/* Center & Right Hero Pane: Infinity Loop, Greeting, Quick Action Chips & Wireframe Sphere */}
            <div className="lg:col-span-8 flex flex-col justify-between pl-0 lg:pl-6">
              <div>
                {/* Center Hero Idle Greeting & Infinity Loop (Exact Video 1 Inspiration) */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6 text-center sm:text-left">
                  <div className="shrink-0 p-2 rounded-2xl bg-white/[0.03] border border-white/[0.08] shadow-inner">
                    <InfinityLoopMark size={64} />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                      Good session, <span className="bg-gradient-to-r from-[#38bdf8] via-[#a855f7] to-[#f472b6] bg-clip-text text-transparent">Alex.</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-normal leading-relaxed">
                      How can the council assist your portfolio execution today?
                    </p>
                  </div>
                </div>

                {/* Pill-shaped Quick-Action Chips in Two Rows (Exact Video 1 Pattern) */}
                <div className="space-y-2.5 mb-6">
                  {/* Row 1 */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        playCyberClick();
                        onLaunchCouncil('BTC');
                      }}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.1] hover:border-cyan-400/50 text-white text-xs font-medium transition-all cursor-pointer group shadow-sm hover:-translate-y-0.5"
                    >
                      <Play className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                      <span>Run Council Debate</span>
                    </button>

                    <button
                      onClick={() => {
                        playCyberClick();
                        onOpenMatrix();
                      }}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.1] hover:border-indigo-400/50 text-white text-xs font-medium transition-all cursor-pointer group shadow-sm hover:-translate-y-0.5"
                    >
                      <Layers className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                      <span>Rebalance to RWA Vaults</span>
                    </button>

                    <button
                      onClick={() => {
                        playCyberClick();
                        onOpenProofCertificates();
                      }}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.1] hover:border-emerald-400/50 text-white text-xs font-medium transition-all cursor-pointer group shadow-sm hover:-translate-y-0.5"
                    >
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span>Export Proof Certificate</span>
                    </button>

                    <button
                      onClick={() => {
                        playCyberClick();
                        onOpenAuditLedger();
                      }}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.1] hover:border-amber-400/50 text-white text-xs font-medium transition-all cursor-pointer group shadow-sm hover:-translate-y-0.5"
                    >
                      <Activity className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                      <span>Today's PnL & Ledger</span>
                    </button>
                  </div>

                  {/* Row 2 */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        playCyberClick();
                        onTriggerVetoDrill();
                      }}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.1] hover:border-rose-400/50 text-white text-xs font-medium transition-all cursor-pointer group shadow-sm hover:-translate-y-0.5"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
                      <span>Stress Test Risk Veto</span>
                    </button>

                    <button
                      onClick={() => {
                        playCyberClick();
                        onLaunchCouncil('SOL');
                      }}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.1] hover:border-purple-400/50 text-white text-xs font-medium transition-all cursor-pointer group shadow-sm hover:-translate-y-0.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
                      <span>Scan SOL / ETH Arbitrage</span>
                    </button>
                  </div>
                </div>

                {/* Preserved Rolling 3D Wireframe Dual-Sphere (Non-Negotiable #2) */}
                <div className="relative rounded-2xl bg-[#07080d]/90 border border-white/[0.08] p-3 overflow-hidden shadow-inner">
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-2 px-1">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      DUAL-ORBIT GEOMETRIC RESONANCE (CRYPTO ↔ RWA MESH)
                    </span>
                    <span className="text-[9px] text-zinc-400 font-bold">CLICK TO INTERACT</span>
                  </div>

                  <WireframeSphere onInteract={() => onLaunchCouncil('BTC')} />
                </div>
              </div>

              {/* Four Agent Personas Quick Badge Strip (§1 Non-negotiable #3 & §6 Role Mapping) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/[0.06] mt-4 font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col">
                  <span className="text-white font-bold text-[11px]">Quant-Omega</span>
                  <span className="text-[10px] text-cyan-400">Bull / Alpha lead</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col">
                  <span className="text-white font-bold text-[11px]">NEXUS-RED</span>
                  <span className="text-[10px] text-rose-400">Bear / skeptic</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col">
                  <span className="text-white font-bold text-[11px]">Atlas-Macro</span>
                  <span className="text-[10px] text-indigo-400">Macro / RWA-vault</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col">
                  <span className="text-white font-bold text-[11px]">Guardian-01</span>
                  <span className="text-[10px] text-emerald-400">Risk veto / gate</span>
                </div>
              </div>
            </div>
          </div>
        </MacGlassWindow>
      </div>
    </div>
  );
}
