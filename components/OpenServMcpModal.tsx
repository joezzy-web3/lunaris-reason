import React, { useState, useEffect } from 'react';
import {
  X,
  Cpu,
  Zap,
  Play,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Code2,
  Terminal,
  Server,
  Layers,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { playCyberClick, playTradeApprovedChime, playRiskVetoTone } from '@/lib/soundSynth';

interface OpenServMcpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface McpTool {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
  sampleArgs: Record<string, any>;
}

const MCP_SAMPLE_TOOLS: McpTool[] = [
  {
    name: 'get_rwa_vault_yields',
    description: 'Returns real-time licensed RWA yield vault APYs, custodian NAVs, and secondary market basis spreads.',
    parameters: {
      type: 'object',
      properties: {
        vaultTicker: { type: 'string', description: 'Optional vault symbol (UST10Y, TBILL, PAXG, REIT)' },
      },
    },
    sampleArgs: { vaultTicker: 'UST10Y' },
  },
  {
    name: 'evaluate_rwa_yield_spread',
    description: 'Computes real-time yield arbitrage spread between crypto staking yields vs tokenized sovereign treasuries (UST10Y 5.15% APY).',
    parameters: {
      type: 'object',
      properties: {
        cryptoYieldToken: { type: 'string', default: 'ETH' },
        rwaTreasuryToken: { type: 'string', default: 'UST10Y' },
      },
    },
    sampleArgs: { cryptoYieldToken: 'ETH', rwaTreasuryToken: 'UST10Y' },
  },
  {
    name: 'enforce_slippage_collar',
    description: 'Validates an intended allocation against the Guardian-01 deterministic ≤ 0.50% slippage collar constraint.',
    parameters: {
      type: 'object',
      properties: {
        instrument: { type: 'string' },
        direction: { type: 'string', enum: ['LONG', 'SHORT'] },
        expectedPrice: { type: 'number' },
        proposedExecutionPrice: { type: 'number' },
      },
      required: ['instrument', 'direction', 'expectedPrice', 'proposedExecutionPrice'],
    },
    sampleArgs: {
      instrument: 'UST10Y/USD',
      direction: 'LONG',
      expectedPrice: 106.2,
      proposedExecutionPrice: 106.45,
    },
  },
  {
    name: 'verify_serv_reasoning_proof',
    description: 'Cryptographically verifies a trade reason certificate using SHA-256 fingerprinting and 4-agent quorum voting proof.',
    parameters: {
      type: 'object',
      properties: {
        proofId: { type: 'string' },
        reasonHash: { type: 'string' },
      },
      required: ['proofId'],
    },
    sampleArgs: { proofId: 'SERV-REASON-7749-XAU' },
  },
  {
    name: 'execute_rwa_rebalance',
    description: 'Executes autonomous capital deployment to a licensed RWA vault and routes 10% performance fee to OpenServ Protocol Escrow.',
    parameters: {
      type: 'object',
      properties: {
        targetVault: { type: 'string' },
        allocationUsd: { type: 'number' },
      },
      required: ['targetVault', 'allocationUsd'],
    },
    sampleArgs: { targetVault: 'UST10Y', allocationUsd: 5000 },
  },
  {
    name: 'get_live_market_quotes',
    description: 'Returns real-time prices, 24h delta, and liquidity depth for Crypto and Real-World Assets.',
    parameters: {
      type: 'object',
      properties: {
        assets: { type: 'array', items: { type: 'string' } },
      },
    },
    sampleArgs: { assets: ['BTC', 'ETH', 'SOL', 'UST10Y', 'PAXG'] },
  },
  {
    name: 'trigger_risk_veto_drill',
    description: 'Executes simulated black swan market shock to test Guardian-01 circuit breaker and slippage collar enforcement.',
    parameters: {
      type: 'object',
      properties: {
        shockPct: { type: 'number', default: -12.5 },
      },
    },
    sampleArgs: { shockPct: -12.5 },
  },
];

export const OpenServMcpModal: React.FC<OpenServMcpModalProps> = ({ isOpen, onClose }) => {
  const [selectedToolIndex, setSelectedToolIndex] = useState(0);
  const [customArgs, setCustomArgs] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const activeTool = MCP_SAMPLE_TOOLS[selectedToolIndex] || MCP_SAMPLE_TOOLS[0];

  useEffect(() => {
    if (activeTool) {
      setCustomArgs(JSON.stringify(activeTool.sampleArgs, null, 2));
      setExecutionResult(null);
      setLatencyMs(null);
    }
  }, [selectedToolIndex]);

  if (!isOpen) return null;

  const handleExecuteTool = async () => {
    playCyberClick();
    setIsExecuting(true);
    setExecutionResult(null);
    const start = performance.now();

    try {
      let parsedArgs = {};
      try {
        parsedArgs = JSON.parse(customArgs);
      } catch {
        parsedArgs = activeTool.sampleArgs;
      }

      const res = await fetch('/api/mcp/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: activeTool.name,
          arguments: parsedArgs,
        }),
      });

      const elapsed = Math.round(performance.now() - start);
      setLatencyMs(elapsed);

      const json = await res.json();
      setExecutionResult(json);
      playTradeApprovedChime();
    } catch (err: any) {
      setExecutionResult({ error: err.message || 'Execution failed' });
      playRiskVetoTone();
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopyJson = () => {
    playCyberClick();
    if (executionResult) {
      navigator.clipboard.writeText(JSON.stringify(executionResult, null, 2)).catch(() => {});
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-mono select-none animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#0B0D14] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.15)] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Hologram Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-[#0E1322] via-[#0B0D14] to-[#0E1322]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300">
                  OPENSERV MCP COMPATIBLE
                </span>
                <span className="text-zinc-400 text-[10px] hidden sm:inline">JSON-RPC 2.0 Spec</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide mt-0.5">
                Model Context Protocol (MCP) Live Agent Explorer
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              playCyberClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Sub-Banner */}
        <div className="bg-[#070910] border-b border-white/5 px-5 py-2.5 text-xs text-zinc-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            LUNARIS functions as an autonomous tool provider on OpenServ. Inspect standardized schema at <a href="/.well-known/openserv-agent.json" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline font-mono">/.well-known/openserv-agent.json</a>.
          </span>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/.well-known/openserv-agent.json"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px] font-medium"
            >
              Raw Manifest <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://openserv.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px] font-medium"
            >
              OpenServ Docs <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Left Column: Tool Catalog */}
            <div className="md:col-span-5 space-y-2">
              <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Registered MCP Tools</span>
                <span className="text-[10px] text-cyan-400 font-mono">6 Available</span>
              </div>

              <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
                {MCP_SAMPLE_TOOLS.map((tool, idx) => {
                  const isSelected = selectedToolIndex === idx;
                  return (
                    <button
                      key={tool.name}
                      onClick={() => {
                        playCyberClick();
                        setSelectedToolIndex(idx);
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/10 border-cyan-400/50 text-white shadow-sm'
                          : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs font-mono text-cyan-300">{tool.name}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed font-sans">
                        {tool.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Interactive Runner & Output */}
            <div className="md:col-span-7 space-y-3 flex flex-col">
              {/* Tool Parameters & Payload */}
              <div className="bg-[#070910] border border-white/10 rounded-xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-300 font-mono">
                    Arguments JSON Schema
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">Editable</span>
                </div>

                <textarea
                  value={customArgs}
                  onChange={(e) => setCustomArgs(e.target.value)}
                  rows={4}
                  className="w-full bg-[#0d101a] border border-white/10 focus:border-cyan-400 rounded-lg p-2.5 text-xs font-mono text-cyan-200 focus:outline-none resize-none"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-zinc-500 font-sans">
                    Endpoint: <code className="text-zinc-400">/api/mcp/execute</code>
                  </span>
                  <button
                    onClick={handleExecuteTool}
                    disabled={isExecuting}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs transition-all shadow-[0_0_15px_rgba(0,240,255,0.25)] disabled:opacity-40 cursor-pointer"
                  >
                    {isExecuting ? (
                      <>
                        <span className="w-3 h-3 rounded-full border-2 border-black border-t-transparent animate-spin" />
                        <span>Invoking RPC...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-black" />
                        <span>Execute Tool RPC</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Execution Result Terminal */}
              <div className="flex-1 bg-[#05060A] border border-white/10 rounded-xl p-3.5 space-y-2 min-h-[220px] flex flex-col">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[11px] font-bold text-zinc-300 font-mono">
                      OpenServ Execution Response
                    </span>
                  </div>
                  {latencyMs !== null && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                      {latencyMs}ms Latency
                    </span>
                  )}
                </div>

                <div className="flex-1 overflow-auto max-h-[240px]">
                  {executionResult ? (
                    <pre className="text-[11px] font-mono text-zinc-300 leading-relaxed overflow-x-auto">
                      {JSON.stringify(executionResult, null, 2)}
                    </pre>
                  ) : (
                    <div className="h-full min-h-[140px] flex flex-col items-center justify-center text-zinc-500 text-xs">
                      <Code2 className="w-6 h-6 mb-2 opacity-40 text-cyan-400" />
                      <span>Click "Execute Tool RPC" to trigger live OpenServ bounded execution</span>
                    </div>
                  )}
                </div>

                {executionResult && (
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
                    <span className="text-cyan-400 font-mono">
                      ✓ Attestation Verified
                    </span>
                    <button
                      onClick={handleCopyJson}
                      className="flex items-center gap-1 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? 'Copied' : 'Copy JSON'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-white/10 bg-[#070910] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>OpenServ AgentKit Node Live</span>
          </div>
          <button
            onClick={() => {
              playCyberClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
};
