/**
 * LUNARIS REASON // OpenServ Autonomous RWA Terminal
 * Institutional Multi-Agent Bounded Reasoning Cockpit
 * Built for OpenServ AI Agent Hackathon by Joezzy (Joezzy Web3)
 */

import React, { useState, useEffect, Suspense } from 'react';
import { CommandDeckHero } from '@/components/CommandDeckHero';
import { ThreePillarBento } from '@/components/ThreePillarBento';
import { LiveTickerMarquee } from '@/components/LiveTickerMarquee';
import { UsStockExpansionBanner } from '@/components/UsStockExpansionBanner';
import { AutonomousLoopPanel } from '@/components/AutonomousLoopPanel';
import { DebateConsole, normalizeTickerSymbol } from '@/components/DebateConsole';
import { PulseRadarPanel } from '@/components/PulseRadarPanel';
import { DemoModeController } from '@/components/DemoModeController';
import { DeterministicKillSwitch } from '@/components/DeterministicKillSwitch';
import { AgentActivityStream } from '@/components/AgentActivityStream';
import { TradeProposal } from '@/lib/riskVeto';
import { clearAssetShocks } from '@/lib/demoSeedData';

// Code-split heavy sub-systems so initial bundle is cut in half and loads instantly
const VisualAlgoBuilder = React.lazy(() =>
  import('@/components/VisualAlgoBuilder').then((m) => ({ default: m.VisualAlgoBuilder }))
);
const QuantBacktestEngine = React.lazy(() =>
  import('@/components/QuantBacktestEngine').then((m) => ({ default: m.QuantBacktestEngine }))
);
const PaperTradingAuditView = React.lazy(() =>
  import('@/components/PaperTradingAuditView').then((m) => ({ default: m.PaperTradingAuditView }))
);
const RealTimeTradingChart = React.lazy(() =>
  import('@/components/RealTimeTradingChart').then((m) => ({ default: m.RealTimeTradingChart }))
);
const LiquidityDepthHeatmap = React.lazy(() =>
  import('@/components/LiquidityDepthHeatmap').then((m) => ({ default: m.LiquidityDepthHeatmap }))
);
const UnifiedDataConstellation = React.lazy(() =>
  import('@/components/UnifiedDataConstellation').then((m) => ({ default: m.UnifiedDataConstellation }))
);
const CrossAssetMatrix = React.lazy(() =>
  import('@/components/CrossAssetMatrix').then((m) => ({ default: m.CrossAssetMatrix }))
);
const HackathonCreditsModal = React.lazy(() =>
  import('@/components/HackathonCreditsModal').then((m) => ({ default: m.HackathonCreditsModal }))
);
const BitgetApiKeyModal = React.lazy(() =>
  import('@/components/BitgetApiKeyModal').then((m) => ({ default: m.BitgetApiKeyModal }))
);
const BlackSwanDrillModal = React.lazy(() =>
  import('@/components/BlackSwanDrillModal').then((m) => ({ default: m.BlackSwanDrillModal }))
);
const CommandPaletteModal = React.lazy(() =>
  import('@/components/CommandPaletteModal').then((m) => ({ default: m.CommandPaletteModal }))
);
const ProofCertificatesView = React.lazy(() =>
  import('@/components/ProofCertificatesView').then((m) => ({ default: m.ProofCertificatesView }))
);
const OpenServMcpModal = React.lazy(() =>
  import('@/components/OpenServMcpModal').then((m) => ({ default: m.OpenServMcpModal }))
);
const OpenServManifestModal = React.lazy(() =>
  import('@/components/OpenServManifestModal').then((m) => ({ default: m.OpenServManifestModal }))
);
import { PulseContext } from '@/lib/councilDebateEngine';
import {
  toggleTerminalSound,
  getTerminalSoundState,
  playCyberClick,
  toggleTradingFloorAmbience,
  getTradingFloorAmbienceState,
} from '@/lib/soundSynth';
import {
  Activity,
  Cpu,
  Radio,
  Scale,
  Award,
  BookOpen,
  Layers,
  Terminal,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Volume2,
  VolumeX,
  Sparkles,
  Database,
  ArrowRightLeft,
  LayoutDashboard,
  Zap,
  LineChart,
  Bot,
  Compass,
  History,
  Shield,
  Grid,
  ScrollText,
  Key,
  Command,
  Headphones,
  ArrowLeft,
  ChevronLeft,
  FileCheck2,
  FileCode,
} from 'lucide-react';

export type TerminalTab = 'DECK' | 'COUNCIL' | 'MATRIX' | 'AUDIT' | 'CERTIFICATES';

const TAB_LABELS: Record<TerminalTab, string> = {
  DECK: 'Command Deck',
  COUNCIL: 'Council Debate',
  MATRIX: 'Cross-Asset Matrix',
  AUDIT: 'Audit Ledger',
  CERTIFICATES: 'Proof Certificates',
};

const TAB_PATHS: Record<TerminalTab, string> = {
  DECK: '/',
  COUNCIL: '/council',
  MATRIX: '/matrix',
  AUDIT: '/auditlog',
  CERTIFICATES: '/certificates',
};

export function getInitialTab(): TerminalTab {
  if (typeof window === 'undefined') return 'DECK';
  const path = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, '');
  const search = new URLSearchParams(window.location.search);
  const tabParam = search.get('tab')?.toLowerCase();
  const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '');

  const matchTarget = tabParam || path || hash;

  if (['audit', 'auditlog', 'audit-log', 'audit_log', 'ledger', 'trades'].includes(matchTarget)) {
    return 'AUDIT';
  }
  if (['council', 'debate', 'quorum'].includes(matchTarget)) {
    return 'COUNCIL';
  }
  if (['matrix', 'rwa', 'vaults', 'statarb', 'terminal', 'cockpit'].includes(matchTarget)) {
    return 'MATRIX';
  }
  if (['certificates', 'proof', 'proofs', 'certificate'].includes(matchTarget)) {
    return 'CERTIFICATES';
  }
  return 'DECK';
}

function TerminalLoadingFallback() {
  return (
    <div className="min-h-[440px] w-full flex flex-col items-center justify-center p-8 bg-[#0b0b10] border border-white/10 rounded-2xl animate-pulse">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-10 h-10 rounded-xs bg-gradient-to-tr from-[#00F0FF] via-[#FACC15] to-[#D946EF] rotate-45 animate-spin" style={{ animationDuration: '2.5s' }} />
        <div className="absolute w-5 h-5 rounded-full bg-[#0b0b10]" />
      </div>
      <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>STREAMING QUANT MODULE</span>
      </div>
      <div className="text-[11px] text-gray-400 font-mono mt-2">
        Sub-system streaming on demand...
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TerminalTab>(() => getInitialTab());
  const [tabHistory, setTabHistory] = useState<TerminalTab[]>([]);
  const [cockpitModule, setCockpitModule] = useState<'CHART' | 'STREAM' | 'AUTOPILOT' | 'COUNCIL' | 'PULSE' | 'DEPTH' | 'STATARB' | 'KILLSWITCH' | 'AUDIT'>('CHART');
  const [councilSelectedTicker, setCouncilSelectedTicker] = useState<string>('BTC');
  const [incomingPulseContext, setIncomingPulseContext] = useState<(PulseContext & { ticker: string }) | null>(null);
  const [activityAdvisoryMandate, setActivityAdvisoryMandate] = useState<{
    ticker: string;
    mandate: string;
    source?: string;
    timestamp?: number;
  } | null>(null);
  const [incomingProposal, setIncomingProposal] = useState<TradeProposal | null>(null);
  const [isCreditsModalOpen, setIsCreditsModalOpen] = useState<boolean>(false);
  const [resetKey, setResetKey] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [utcTime, setUtcTime] = useState<string>('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isMcpModalOpen, setIsMcpModalOpen] = useState<boolean>(false);
  const [isOpenServManifestOpen, setIsOpenServManifestOpen] = useState<boolean>(false);
  const [isBlackSwanDrillOpen, setIsBlackSwanDrillOpen] = useState<boolean>(false);
  const [tradingFloorAudio, setTradingFloorAudio] = useState<boolean>(false);
  const [isApiKeyConnected, setIsApiKeyConnected] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('LUNARIS_BITGET_BYOK_CREDENTIALS_V1');
    } catch {
      return false;
    }
  });

  // Global Cmd+K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        playCyberClick();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Live UTC Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().split(' ')[4] || now.toLocaleTimeString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const nextState = toggleTerminalSound();
    setSoundEnabled(nextState);
    if (nextState) {
      playCyberClick();
    }
  };

  const handleToggleTradingFloor = () => {
    playCyberClick();
    const nextAmbience = toggleTradingFloorAmbience();
    setTradingFloorAudio(nextAmbience);
  };

  // Listen to browser forward/back buttons
  useEffect(() => {
    const handlePopState = () => {
      const tab = getInitialTab();
      setActiveTab(tab);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync initial URL if on audit
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initial = getInitialTab();
      const currentPath = window.location.pathname.toLowerCase();
      if (initial === 'AUDIT' && currentPath !== '/auditlog') {
        window.history.replaceState({ tab: 'AUDIT' }, '', '/auditlog');
      }
    }
  }, []);

  // Silently pre-warm heavy lazy modules during browser idle time so tab transitions are instant
  useEffect(() => {
    const prefetchTimer = setTimeout(() => {
      import('@/components/PaperTradingAuditView');
      import('@/components/RealTimeTradingChart');
      import('@/components/VisualAlgoBuilder');
      import('@/components/QuantBacktestEngine');
    }, 2000);
    return () => clearTimeout(prefetchTimer);
  }, []);

  // Navigates to a tab while pushing the current tab onto the history stack and updating the browser URL
  const navigateToTab = (newTab: TerminalTab, pushUrl: boolean = true) => {
    if (newTab === activeTab) return;
    setTabHistory((prev) => [...prev, activeTab]);
    setActiveTab(newTab);

    if (pushUrl && typeof window !== 'undefined') {
      const targetPath = TAB_PATHS[newTab] || '/';
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ tab: newTab }, '', targetPath);
      }
    }
  };

  // Return to the previous tab, or fallback to COMMAND DECK
  const handleGoBack = () => {
    playCyberClick();
    if (tabHistory.length > 0) {
      const prevTab = tabHistory[tabHistory.length - 1];
      setTabHistory((prev) => prev.slice(0, -1));
      setActiveTab(prevTab);
      if (typeof window !== 'undefined') {
        const targetPath = TAB_PATHS[prevTab] || '/';
        window.history.pushState({ tab: prevTab }, '', targetPath);
      }
    } else {
      setActiveTab('DECK');
      if (typeof window !== 'undefined') {
        window.history.pushState({ tab: 'DECK' }, '', '/');
      }
    }
  };

  const previousTab = tabHistory.length > 0 ? tabHistory[tabHistory.length - 1] : 'DECK';

  // Dispatch signal from Council or Matrix directly into Autopilot
  const handleSendToAutopilot = (proposal: TradeProposal) => {
    setIncomingProposal(proposal);
    navigateToTab('MATRIX');
    setTimeout(() => {
      const panel = document.getElementById('autonomous-loop-panel') || document.getElementById('autonomous-loop-section');
      if (panel) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  };

  // Handoff ticker and catalyst instruction from Pulse Radar to Council & auto-redirect
  const handlePulseTickerSelect = (ticker: string, context?: PulseContext) => {
    const sym = ticker.toUpperCase();
    setCouncilSelectedTicker(sym);
    if (context) {
      setIncomingPulseContext({
        ...context,
        ticker: sym,
      });
    }

    navigateToTab('COUNCIL');

    // Scroll directly to the Council section
    setTimeout(() => {
      const councilSection = document.getElementById('council-debate-panel') || document.getElementById('council-messages-stream');
      if (councilSection) {
        councilSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const handleSelectAssetFromMarquee = (ticker: string) => {
    // Reroute buying SOL or any token directly to the Autopilot section (MATRIX / Autonomous Loop)
    setCouncilSelectedTicker(ticker);
    navigateToTab('MATRIX');
  };

  const handleResetPaperAccount = () => {
    clearAssetShocks();
    setIncomingProposal(null);
    setResetKey((prev) => prev + 1);
  };

  const COCKPIT_DOCK_ITEMS = [
    { id: 'CHART', name: 'Real-Time Chart', icon: LineChart, desc: 'Live Green Spike & Red Dip' },
    { id: 'AUTOPILOT', name: 'Autopilot', icon: Bot, desc: 'Autonomous Execution' },
    { id: 'COUNCIL', name: 'Council Debate', icon: Scale, desc: '4-Pillar Quorum & Natural Language' },
    { id: 'STREAM', name: 'Activity Stream', icon: Activity, desc: 'Real-Time Agent Log' },
    { id: 'STATARB', name: 'StatArb Matrix', icon: ArrowRightLeft, desc: 'Cross-Asset Pairs' },
    { id: 'PULSE', name: 'Pulse Radar', icon: Radio, desc: 'Sentiment & Whales' },
    { id: 'DEPTH', name: 'Liquidity Depth', icon: Layers, desc: 'Order Book Heatmap' },
    { id: 'AUDIT', name: 'Audit Ledger', icon: ScrollText, desc: 'Institutional Logs' },
    { id: 'KILLSWITCH', name: 'Kill Switch', icon: Shield, desc: 'Circuit Telemetry' },
  ] as const;

  return (
    <div className="min-h-screen bg-[var(--lunaris-bg)] text-[#e2e8f0] font-mono selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Floating Apple-Style Navigation Header (Exact Video Inspiration) */}
      <header className="border-b border-white/[0.08] bg-[#050508]/80 backdrop-blur-2xl sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Left: Brand Identity & Dedicated Back Button */}
          <div className="flex items-center gap-3 shrink-0">
            {activeTab !== 'DECK' && (
              <button
                id="header-back-button"
                onClick={handleGoBack}
                title={`Back to ${TAB_LABELS[previousTab] || 'previous view'}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12] text-zinc-300 hover:text-white transition-all cursor-pointer text-xs font-semibold group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}

            <button
              onClick={() => {
                playCyberClick();
                navigateToTab('DECK');
              }}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              {/* Restored Signature Vibrant Multi-Color Diamond Glyph */}
              <div className="relative flex items-center justify-center">
                <div className="w-4 h-4 rounded-xs bg-gradient-to-tr from-[#00F0FF] via-[#FACC15] to-[#D946EF] rotate-45 shadow-[0_0_12px_rgba(0,240,255,0.7)] group-hover:rotate-90 transition-transform duration-300" />
                <div className="absolute w-1.5 h-1.5 rounded-full bg-[#050508]" />
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-wide text-white">
                  LUNARIS REASON
                </h1>
              </div>
            </button>
          </div>

          {/* Center: Floating Glass Pill Navbar (Exact Mya Reference) */}
          <nav className="hidden md:flex items-center gap-1 bg-[#11121a]/80 backdrop-blur-xl border border-white/[0.1] rounded-full p-1 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <button
              onClick={() => {
                playCyberClick();
                navigateToTab('DECK');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'DECK'
                  ? 'bg-white/15 text-white font-semibold shadow-inner border border-white/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Command Deck
            </button>

            <button
              onClick={() => {
                playCyberClick();
                navigateToTab('COUNCIL');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'COUNCIL'
                  ? 'bg-white/15 text-white font-semibold shadow-inner border border-white/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Council Debate
            </button>

            <button
              onClick={() => {
                playCyberClick();
                navigateToTab('MATRIX');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'MATRIX'
                  ? 'bg-white/15 text-white font-semibold shadow-inner border border-white/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Cross-Asset Matrix
            </button>

            <button
              id="nav-tab-audit-log"
              onMouseEnter={() => {
                import('@/components/PaperTradingAuditView');
              }}
              onClick={() => {
                playCyberClick();
                navigateToTab('AUDIT');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'AUDIT'
                  ? 'bg-white/15 text-white font-semibold shadow-inner border border-white/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Audit Ledger
            </button>

            <button
              onClick={() => {
                playCyberClick();
                navigateToTab('CERTIFICATES');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'CERTIFICATES'
                  ? 'bg-white/15 text-white font-semibold shadow-inner border border-white/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Proof Certificates
            </button>
          </nav>

          {/* Right: Quick Action Controls & Prominent "Get Demo" Style Pill */}
          <div className="flex items-center gap-2 text-xs">
            {/* OpenServ Discovery Manifest Pill (Standardized /.well-known/openserv-agent.json) */}
            <button
              onClick={() => {
                playCyberClick();
                setIsOpenServManifestOpen(true);
              }}
              title="OpenServ Agent Discovery Manifest (/.well-known/openserv-agent.json)"
              className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-white border border-emerald-500/30 px-2.5 py-1.5 rounded-full text-xs transition-colors cursor-pointer font-mono"
            >
              <FileCode className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline font-bold text-[11px]">SERV Manifest</span>
            </button>

            {/* OpenServ MCP Tools Trigger */}
            <button
              onClick={() => {
                playCyberClick();
                setIsMcpModalOpen(true);
              }}
              title="OpenServ Model Context Protocol (MCP) Live Explorer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs transition-all border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-500/20 hover:text-white cursor-pointer shadow-sm"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono font-bold text-[11px]">OpenServ MCP</span>
            </button>

            {/* BYOK Key Trigger */}
            <button
              onClick={() => {
                playCyberClick();
                setIsApiKeyModalOpen(true);
              }}
              title="Pair API Key"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs transition-colors border cursor-pointer ${
                isApiKeyConnected
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : 'bg-white/[0.04] border-white/[0.1] text-zinc-400 hover:text-white'
              }`}
            >
              <Key className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden lg:inline">{isApiKeyConnected ? 'Paired' : 'Agent Key'}</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={handleToggleSound}
              title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
              className="p-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Prominent High-Contrast "Get Demo" Style Action Pill (Exact Video Inspiration) */}
            <button
              onClick={() => {
                playCyberClick();
                setCouncilSelectedTicker('BTC');
                navigateToTab('COUNCIL');
              }}
              className="px-4 py-1.5 rounded-full bg-white text-black hover:bg-zinc-200 text-xs font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_25px_rgba(255,255,255,0.45)] cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span className="hidden sm:inline">Convene Council</span>
              <span className="sm:hidden">Council</span>
            </button>
          </div>
        </div>
      </header>

      {/* 5-Day US Stocks Expansion Notice Banner */}
      <UsStockExpansionBanner
        onSelectTicker={handleSelectAssetFromMarquee}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.history.pushState(null, '', TAB_PATHS[tab]);
        }}
      />

      {/* Infinite Real-Time Live Ticker Marquee (Crypto & Tokenized Stocks) */}
      <LiveTickerMarquee
        onSelectAsset={handleSelectAssetFromMarquee}
        activeTicker={councilSelectedTicker}
      />

      {/* Main Container */}
      <main className={`mx-auto px-4 py-4 space-y-8 transition-all duration-200 ${activeTab === 'AUDIT' ? 'max-w-[1680px]' : 'max-w-7xl'}`}>
        <Suspense fallback={<TerminalLoadingFallback />}>
          {/* VIEW 1: COMMAND DECK (Hero, Ambient Light Sweep, Companion, Quick Chips, Bento) */}
          {activeTab === 'DECK' && (
            <div className="space-y-8 animate-fadeIn">
              <CommandDeckHero
                onLaunchCouncil={(ticker) => {
                  if (ticker) setCouncilSelectedTicker(ticker);
                  navigateToTab('COUNCIL');
                }}
                onOpenMatrix={() => navigateToTab('MATRIX')}
                onOpenAuditLedger={() => navigateToTab('AUDIT')}
                onOpenProofCertificates={() => navigateToTab('CERTIFICATES')}
                onTriggerVetoDrill={() => setIsBlackSwanDrillOpen(true)}
              />

              {/* 3-Pillar Architecture Showcase */}
              <div id="bento-showcase" className="space-y-3">
                <div className="flex items-center justify-between px-1 text-xs text-zinc-400 font-mono">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    AUTONOMOUS ARCHITECTURE // PILLARS #01 - #03
                  </span>
                  <span className="text-[11px] text-zinc-400 hidden sm:inline">
                    Multi-Agent Quorum & Institutional RWA Vaults
                  </span>
                </div>

                <ThreePillarBento
                  onLaunchTerminal={() => navigateToTab('COUNCIL')}
                  onDeployAlgo={handleSendToAutopilot}
                  onSelectNode={(ticker) => handlePulseTickerSelect(ticker)}
                  onOpenStudio={() => navigateToTab('MATRIX')}
                />
              </div>
            </div>
          )}

          {/* VIEW 2: COUNCIL DEBATE (Quad-Persona Consensus & Courtroom) */}
          {activeTab === 'COUNCIL' && (
            <div key={`council-tab-${resetKey}`} className="space-y-6 animate-fadeIn">
              <DebateConsole
                onSendToAutopilot={handleSendToAutopilot}
                initialTicker={councilSelectedTicker}
                incomingPulseContext={incomingPulseContext}
                onClearPulseContext={() => setIncomingPulseContext(null)}
                advisoryMandate={activityAdvisoryMandate}
                onClearAdvisoryMandate={() => setActivityAdvisoryMandate(null)}
              />
            </div>
          )}

          {/* VIEW 3: CROSS-ASSET MATRIX (Crypto ↔ RWA Vaults, Static/Quiet Background per §5) */}
          {activeTab === 'MATRIX' && (
            <div key={`matrix-tab-${resetKey}`} className="space-y-6 animate-fadeIn">
              <div className="relative rounded-3xl bg-[#0E1017] border border-white/[0.08] p-5 sm:p-6 overflow-hidden">
                <span className="absolute top-2.5 left-3 text-[9px] font-mono text-cyan-400/30">[+]</span>
                <span className="absolute top-2.5 right-3 text-[9px] font-mono text-cyan-400/30">[+]</span>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Cross-Asset Allocation & StatArb Matrix</h2>
                    <p className="text-xs text-zinc-400 mt-1">Spot Crypto ↔ 24/7 Tokenized Equities & RWA Vaults. Background kept fully static for data clarity.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full">
                      Zero-Motion Data Isolation
                    </span>
                  </div>
                </div>

                <CrossAssetMatrix onRoutePairSignal={handleSendToAutopilot} />
              </div>

              {/* Connected Autonomous Loop Panel */}
              <div id="autonomous-loop-section" className="rounded-3xl bg-[#0E1017] border border-white/[0.08] p-5 sm:p-6 scroll-mt-20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    Autonomous Execution Loop (V2 Sandbox)
                  </h3>
                  <span className="text-xs font-mono text-zinc-400 tabular-nums">
                    Max VaR: 0.5% Collar Enforced
                  </span>
                </div>
                <AutonomousLoopPanel
                  key={`auto-loop-${resetKey}`}
                  externalProposal={incomingProposal}
                  onClearExternalProposal={() => setIncomingProposal(null)}
                />
              </div>
            </div>
          )}

          {/* VIEW 4: AUDIT LEDGER (Starts empty per §2 isolation) */}
          {activeTab === 'AUDIT' && (
            <div className="space-y-6 animate-fadeIn">
              <PaperTradingAuditView
                onBack={handleGoBack}
                onNavigateToCockpit={(ticker) => {
                  if (ticker) setCouncilSelectedTicker(ticker);
                  navigateToTab('COUNCIL');
                }}
              />
            </div>
          )}

          {/* VIEW 5: PROOF CERTIFICATES (Dedicated Registry View per §5) */}
          {activeTab === 'CERTIFICATES' && (
            <div className="space-y-6 animate-fadeIn">
              <ProofCertificatesView
                onOpenCouncil={(ticker) => {
                  if (ticker) setCouncilSelectedTicker(ticker);
                  navigateToTab('COUNCIL');
                }}
                onOpenAuditLedger={() => navigateToTab('AUDIT')}
              />
            </div>
          )}
        </Suspense>
      </main>

      {/* Institutional Terminal Footer */}
      <footer className="border-t border-white/[0.08] bg-[#070709] py-6 mt-12 text-xs text-zinc-400 font-sans-taste">
        <div className={`mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-200 ${activeTab === 'AUDIT' ? 'max-w-[1680px]' : 'max-w-7xl'}`}>
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-xs bg-gradient-to-tr from-[#00F0FF] via-[#FACC15] to-[#D946EF] rotate-45 shadow-[0_0_10px_rgba(0,240,255,0.7)]" />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-[#070709]" />
            </div>
            <span className="text-white font-black tracking-wider">LUNARIS REASON</span>
            <span className="text-zinc-600">|</span>
            <span>Autonomous Cross-Asset Reason Engine (V2 Clean Build)</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono">
            <span>Core Protocol: <b className="text-zinc-200">OpenServ BRAID Bounded Reasoning</b></span>
            <span className="text-zinc-600">•</span>
            <span className="text-cyan-400">0.5% Slippage Collar Active</span>
            <span className="text-zinc-600">•</span>
            <span className="text-emerald-400">Isolated V2 Ledger</span>
            <span className="text-zinc-600">•</span>
            <a
              href="https://openserv.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1 font-medium"
            >
              OpenServ Protocol <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Lazy Modals Wrapped in Suspense */}
      <Suspense fallback={null}>
        {/* Hackathon Credits & Certification Modal */}
        <HackathonCreditsModal
          isOpen={isCreditsModalOpen}
          onClose={() => setIsCreditsModalOpen(false)}
        />

        {/* Quick Agentic Command Palette (Cmd + K / Ctrl + K) */}
        <CommandPaletteModal
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onNavigateTab={(tab) => {
            navigateToTab(tab);
          }}
          onNavigateCockpitModule={(mod) => {
            setCockpitModule(mod);
          }}
          onConveneCouncil={(ticker, prompt) => {
            setCouncilSelectedTicker(ticker);
            navigateToTab('COUNCIL');
          }}
          onOpenFlashCrashDrill={() => {
            setIsBlackSwanDrillOpen(true);
          }}
          onOpenAuditLedger={() => {
            navigateToTab('AUDIT');
          }}
          onOpenIntentCompiler={() => {
            navigateToTab('COUNCIL');
          }}
        />

        {/* Institutional Read-Only API Key (BYOK) Modal */}
        <BitgetApiKeyModal
          isOpen={isApiKeyModalOpen}
          onClose={() => setIsApiKeyModalOpen(false)}
          onConnectionStatusChange={(connected) => {
            setIsApiKeyConnected(connected);
          }}
        />

        {/* OpenServ MCP Interactive Explorer Modal */}
        <OpenServMcpModal
          isOpen={isMcpModalOpen}
          onClose={() => setIsMcpModalOpen(false)}
        />

        {/* OpenServ Agent Discovery Manifest Modal (Standardized /.well-known/openserv-agent.json) */}
        <OpenServManifestModal
          isOpen={isOpenServManifestOpen}
          onClose={() => setIsOpenServManifestOpen(false)}
          onOpenMcpTools={() => setIsMcpModalOpen(true)}
        />

        {/* Black Swan / Flash Crash Emergency Drill Modal */}
        <BlackSwanDrillModal
          isOpen={isBlackSwanDrillOpen}
          onClose={() => setIsBlackSwanDrillOpen(false)}
        />
      </Suspense>
    </div>
  );
}
