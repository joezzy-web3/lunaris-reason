// components/ProofCertificatesView.tsx
// Dedicated Proof-of-Reasoning Certificates inspection view
// Displays SHA-256 reason hashes, 4-agent quorum signatures, and deterministic collar validation.

import React, { useState } from 'react';
import { useAutopilot } from '@/context/AutopilotContext';
import { PaperTradeRecord } from '@/lib/paperTradingAudit';
import { TradeProofModal } from './TradeProofModal';
import {
  ShieldCheck,
  FileCheck2,
  Lock,
  Hash,
  Scale,
  Sparkles,
  Download,
  ExternalLink,
  Search,
  SlidersHorizontal,
  Layers,
  Cpu,
  ArrowRight,
} from 'lucide-react';
import { playCyberClick } from '@/lib/soundSynth';

interface ProofCertificatesViewProps {
  onOpenCouncil: (ticker?: string) => void;
  onOpenAuditLedger: () => void;
}

export function ProofCertificatesView({ onOpenCouncil, onOpenAuditLedger }: ProofCertificatesViewProps) {
  const { ledger } = useAutopilot();
  const [selectedTrade, setSelectedTrade] = useState<PaperTradeRecord | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  // Map ledger entries to PaperTradeRecords if any exist
  const certificateTrades: PaperTradeRecord[] = ledger.map((item, idx) => ({
    id: item.id || `PT-V2-${idx + 1}`,
    timestamp: item.utcTimestamp || new Date().toISOString(),
    instrument: `${item.ticker}/USDT`,
    direction: item.type === 'BUY' ? 'LONG' : 'SHORT',
    price: item.price || 100,
    entryPrice: item.price || 100,
    exitPrice: item.type === 'TAKE_PROFIT' || item.type === 'STOP_LOSS' ? item.price : undefined,
    quantity: item.totalUsd || 3000,
    leverage: 1,
    balanceChange: item.realizedPnl || 0,
    balanceChangePct: item.realizedPnlPct || 0,
    accountBalance: item.balanceAfter || 100000,
    trigger: item.notes || 'Autonomous Council Quorum Execution',
    status: item.type === 'TAKE_PROFIT' ? 'TAKE_PROFIT' : item.type === 'STOP_LOSS' ? 'STOP_LOSS' : 'OPEN',
  }));

  const filtered = certificateTrades.filter(
    (c) =>
      c.instrument.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.trigger.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 font-sans-taste select-none">
      {/* View Header with 1px Rail Framing (§3c design grammar) */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-[#0E1017] border border-white/[0.08] mb-8 overflow-hidden">
        {/* Reticles */}
        <span className="absolute top-3 left-3 text-[9px] font-mono text-cyan-400/30">[+]</span>
        <span className="absolute top-3 right-3 text-[9px] font-mono text-cyan-400/30">[+]</span>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 text-xs font-mono text-emerald-400 font-bold mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>CRYPTOGRAPHIC PROOF-OF-REASONING REGISTRY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Reason Certificates & Quorum Proofs
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Every autonomous order in LUNARIS REASON generates an immutable certificate containing the SHA-256 reasoning digest, multi-agent quorum vote signatures, and deterministic 0.5% slippage collar enforcement.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playCyberClick();
                onOpenCouncil('BTC');
              }}
              className="px-5 py-2.5 rounded-full bg-white text-black hover:bg-zinc-200 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Cpu className="w-3.5 h-3.5 text-black" />
              <span>Convene Council</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/[0.06] font-mono text-xs">
          <div>
            <div className="text-[10px] text-zinc-400">CERTIFICATES ISSUED</div>
            <div className="text-lg font-bold text-white tabular-nums mt-0.5">{certificateTrades.length}</div>
          </div>
          <div>
            <div className="text-[10px] text-zinc-400">SIGNATURE SCHEME</div>
            <div className="text-lg font-bold text-cyan-400 mt-0.5">SHA-256 + ECDSA</div>
          </div>
          <div>
            <div className="text-[10px] text-zinc-400">QUORUM ARBITERS</div>
            <div className="text-lg font-bold text-indigo-400 mt-0.5">4 Personas</div>
          </div>
          <div>
            <div className="text-[10px] text-zinc-400">SLIPPAGE COLLAR</div>
            <div className="text-lg font-bold text-emerald-400 tabular-nums mt-0.5">≤ 0.50% Max</div>
          </div>
        </div>
      </div>

      {/* Main List / Table */}
      <div className="rounded-3xl bg-[#0E1017] border border-white/[0.08] overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, instrument, reason..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-cyan-400/50 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-400 focus:outline-hidden font-mono"
            />
          </div>

          <div className="text-xs font-mono text-zinc-400">
            Showing <span className="text-white font-bold tabular-nums">{filtered.length}</span> certificates
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4 text-zinc-400">
              <FileCheck2 className="w-6 h-6 text-zinc-400" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">0 Proof Certificates in V2 Namespace</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed mb-6 font-mono">
              In accordance with hard isolation (§2), the V2 ledger starts at zero records. Run an autonomous council debate to generate your first signed certificate.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  playCyberClick();
                  onOpenCouncil('BTC');
                }}
                className="px-6 py-2.5 rounded-full bg-cyan-400 text-black hover:bg-cyan-300 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer font-mono"
              >
                <span>Trigger Alpha Deliberation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  playCyberClick();
                  onOpenAuditLedger();
                }}
                className="px-6 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-white text-xs font-bold transition-all cursor-pointer font-mono"
              >
                <span>View Empty Ledger</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.01] text-zinc-400 text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4">Proof Certificate ID</th>
                  <th className="py-3 px-4">Instrument</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Execution Price</th>
                  <th className="py-3 px-4">Realized PnL</th>
                  <th className="py-3 px-4">Council Quorum</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((cert) => (
                  <tr
                    key={cert.id}
                    onClick={() => {
                      playCyberClick();
                      setSelectedTrade(cert);
                    }}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {cert.id}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-300 font-semibold">{cert.instrument}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          cert.direction === 'LONG'
                            ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-950/40 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {cert.direction}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-300 tabular-nums">
                      ${cert.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 tabular-nums">
                      <span
                        className={`font-semibold ${
                          cert.balanceChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {cert.balanceChange >= 0 ? '+' : ''}${cert.balanceChange.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 max-w-[220px] truncate">{cert.trigger}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-[11px] text-cyan-400 group-hover:underline">Inspect Proof →</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Interactive Certificate Modal */}
      {selectedTrade && <TradeProofModal trade={selectedTrade} onClose={() => setSelectedTrade(null)} />}
    </div>
  );
}
