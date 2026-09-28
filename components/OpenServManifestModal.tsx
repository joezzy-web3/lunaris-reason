import React, { useState, useEffect } from 'react';
import {
  X,
  FileCode,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Globe,
  Coins,
  RefreshCw,
} from 'lucide-react';
import { playCyberClick, playTradeApprovedChime } from '@/lib/soundSynth';

interface OpenServManifestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMcpTools?: () => void;
}

export const OpenServManifestModal: React.FC<OpenServManifestModalProps> = ({
  isOpen,
  onClose,
  onOpenMcpTools,
}) => {
  const [manifest, setManifest] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'RAW' | 'SUMMARY'>('SUMMARY');

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch('/.well-known/openserv-agent.json')
      .then((res) => res.json())
      .then((data) => {
        setManifest(data);
        setLoading(false);
      })
      .catch(() => {
        fetch('/api/openserv/manifest')
          .then((res) => res.json())
          .then((data) => {
            setManifest(data);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    playCyberClick();
    if (!manifest) return;
    navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
    setCopied(true);
    playTradeApprovedChime();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-mono animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#08090f] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.15)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0d0f1a] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                  OpenServ Agent Discovery Manifest
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                  v2.4.0 COMPLIANT
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Standardized <code className="text-cyan-300">/.well-known/openserv-agent.json</code> discovery schema for external AI agents
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy JSON manifest"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Toggle Bar */}
        <div className="px-5 py-2.5 bg-[#090a13] border-b border-white/[0.06] flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playCyberClick();
                setActiveTab('SUMMARY');
              }}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer font-bold ${
                activeTab === 'SUMMARY'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Structured Overview
            </button>
            <button
              onClick={() => {
                playCyberClick();
                setActiveTab('RAW');
              }}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer font-bold ${
                activeTab === 'RAW'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Raw Discovery JSON
            </button>
          </div>

          <a
            href="/.well-known/openserv-agent.json"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline"
          >
            <span>Open raw endpoint</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-zinc-400 gap-3">
              <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
              <span className="text-xs">Loading OpenServ agent registry manifest...</span>
            </div>
          ) : activeTab === 'SUMMARY' ? (
            <div className="space-y-4">
              {/* Agent Identity Card */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider">Agent Identity</div>
                    <div className="text-base font-bold text-white mt-0.5">
                      {manifest?.agent?.name || 'LUNARIS REASON'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                      ID: {manifest?.agent?.id || 'lunaris-reason'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-purple-950/60 text-purple-300 border border-purple-500/30">
                      Framework: {manifest?.agent?.framework || 'OpenServ AgentKit'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {manifest?.agent?.description}
                </p>
              </div>

              {/* Protocol Escrow & Economic Terms */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25">
                  <div className="text-[10px] text-amber-400/80 uppercase font-semibold flex items-center gap-1.5">
                    <Coins className="w-3 h-3" />
                    <span>AgentKit Escrow Micro-Toll</span>
                  </div>
                  <div className="text-lg font-bold text-amber-300 mt-1">
                    {manifest?.economicTerms?.performanceMicroToll || '10%'}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Routed autonomously on realized profits
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25">
                  <div className="text-[10px] text-cyan-400/80 uppercase font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Deterministic Collar Gate</span>
                  </div>
                  <div className="text-lg font-bold text-cyan-300 mt-1">
                    ≤ 0.50% Max
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Guardian-01 mathematical hard clamp
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/25">
                  <div className="text-[10px] text-purple-400/80 uppercase font-semibold flex items-center gap-1.5">
                    <Cpu className="w-3 h-3" />
                    <span>Reasoning Architecture</span>
                  </div>
                  <div className="text-lg font-bold text-purple-300 mt-1">
                    4-Node DAG
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    SHA-256 reason fingerprints on all trades
                  </div>
                </div>
              </div>

              {/* Supported OpenServ Tracks */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <div className="text-xs text-zinc-400 uppercase tracking-wider mb-2 font-bold">
                  Verified Hackathon Tracks
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {(manifest?.supportedTracks || []).map((track: string, i: number) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-black/40 border border-white/[0.06] flex items-center gap-2 text-zinc-200"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{track}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Registered Callable Tools */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs text-zinc-400 uppercase tracking-wider font-bold">
                    Callable MCP Tools ({manifest?.capabilities?.tools?.length || 6})
                  </div>
                  {onOpenMcpTools && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenMcpTools();
                      }}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer hover:underline"
                    >
                      <span>Open Live Tool Tester</span>
                      <Zap className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {(manifest?.capabilities?.tools || []).map((t: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-black/40 border border-white/[0.06] hover:border-cyan-500/30 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-cyan-300 font-mono">
                          {t.name}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {t.endpoint || 'POST /api/mcp/execute'}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-1">
                        {t.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <pre className="p-4 rounded-xl bg-black/70 border border-white/[0.08] text-xs text-cyan-300 font-mono overflow-x-auto leading-relaxed selection:bg-cyan-500/30">
                {JSON.stringify(manifest, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-[#0d0f1a] flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Discoverable by any OpenServ Network Agent & Orchestrator</span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenMcpTools && (
              <button
                onClick={() => {
                  onClose();
                  onOpenMcpTools();
                }}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Test Tools Live</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
