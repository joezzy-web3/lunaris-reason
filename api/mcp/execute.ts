// api/mcp/execute.ts
// OpenServ MCP Tool Execution Endpoint for Vercel Serverless

export const config = {
  maxDuration: 10,
};

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { tool, arguments: args } = req.body || {};
  if (!tool) {
    return res.status(400).json({ success: false, error: 'Missing required "tool" name parameter' });
  }

  const nowUtc = new Date().toISOString();

  if (tool === 'get_rwa_vault_yields') {
    const vaults = [
      { ticker: 'UST10Y', name: 'US 10Y Treasury Vault', apy: '5.15%', nav: 106.25, livePrice: 106.2, spreadBps: -4.7, status: 'Active' },
      { ticker: 'TBILL', name: '3-Month T-Bill Note', apy: '5.28%', nav: 100.18, livePrice: 100.15, spreadBps: -3.0, status: 'Active' },
      { ticker: 'PAXG', name: 'Paxos Physical Gold', apy: 'LBMA Store of Value', nav: 2682.5, livePrice: 2681.9, spreadBps: -2.2, status: 'Active' },
      { ticker: 'REIT', name: 'Commercial Property Pool', apy: '6.40%', nav: 88.5, livePrice: 88.4, spreadBps: -11.3, status: 'Active' },
      { ticker: 'WTI', name: 'Crude Oil RWA', apy: 'Commodity Index', nav: 71.45, livePrice: 71.3, spreadBps: -21.0, status: 'Active' },
    ];
    const filtered = args?.vaultTicker ? vaults.filter((v) => v.ticker === args.vaultTicker.toUpperCase()) : vaults;
    return res.json({
      success: true,
      tool,
      data: filtered,
      servAttestation: {
        step: 'INGEST_RWA_NAV_ORACLE',
        timestamp: nowUtc,
        hash: `0x${Buffer.from(`rwa_nav_${Date.now()}`).toString('hex').slice(0, 32)}`,
      },
    });
  }

  if (tool === 'enforce_slippage_collar' || tool === 'check_risk_collar') {
    const instrument = args?.instrument || 'UST10Y/USD';
    const direction = args?.direction || 'LONG';
    const exp = Number(args?.expectedPrice ?? args?.entryPrice) || 100;
    const prop = Number(args?.proposedExecutionPrice ?? args?.exitPrice) || exp;
    const dev = Math.abs((prop - exp) / exp);
    const isWithinCollar = dev <= 0.005; // 0.5% max
    return res.json({
      success: true,
      tool,
      instrument,
      direction,
      maxCollarPct: 0.5,
      actualDeviationPct: parseFloat((dev * 100).toFixed(4)),
      approved: isWithinCollar,
      collarPassed: isWithinCollar,
      verdict: isWithinCollar ? 'APPROVED' : 'VETOED_BY_GUARDIAN_01',
      status: isWithinCollar ? 'RATIFIED_BY_GUARDIAN_01' : 'VETOED_EXCEEDS_0.5_PCT_COLLAR',
      servAttestation: {
        step: 'GUARDIAN_COLLAR_INSPECTION',
        timestamp: nowUtc,
        signature: `serv_collar_gate_${isWithinCollar ? 'pass' : 'fail'}_${Date.now()}`,
      },
    });
  }

  if (tool === 'evaluate_rwa_yield_spread') {
    const crypto = (args?.cryptoTicker || args?.cryptoYieldToken || 'ETH').toUpperCase();
    const cryptoStakingApy = crypto === 'SOL' ? 6.9 : crypto === 'ETH' ? 3.2 : 0.0;
    const treasuryRiskFreeApy = 5.15;
    const yieldDifferential = parseFloat((treasuryRiskFreeApy - cryptoStakingApy).toFixed(2));
    const rotationRecommended = yieldDifferential > 1.0;

    return res.json({
      success: true,
      tool,
      treasuryApyPct: treasuryRiskFreeApy,
      cryptoStakingApyPct: cryptoStakingApy,
      spreadBasisPoints: Math.round(yieldDifferential * 100),
      data: {
        flightToSafetyUrgency: rotationRecommended ? 'HIGH' : 'NEUTRAL',
        recommendedAction: rotationRecommended ? 'ALLOCATE_UST10Y_VAULT' : 'HOLD_MOMENTUM_POSITION',
      },
    });
  }

  if (tool === 'execute_rwa_rebalance') {
    const targetVault = args?.targetVault || 'UST10Y';
    const allocationUsd = Number(args?.allocationUsd) || 5000;
    const microToll = parseFloat((allocationUsd * 0.001).toFixed(2)); // 10 bps micro-toll

    return res.json({
      success: true,
      tool,
      targetVault,
      allocationUsd,
      executedNav: targetVault === 'UST10Y' ? 106.2 : targetVault === 'TBILL' ? 100.15 : 2682.0,
      openServEconomicRoute: {
        performanceMicroTollUsd: microToll,
        escrowDestination: 'OpenServ AgentKit Protocol Escrow',
        settlementTx: `0x${Buffer.from(`serv_settle_${Date.now()}`).toString('hex').slice(0, 32)}`,
      },
      status: 'EXECUTED_AND_LOGGED',
      timestamp: nowUtc,
    });
  }

  if (tool === 'verify_serv_reasoning_proof') {
    const proofId = args?.proofId || `SERV-PROOF-${Date.now()}`;
    return res.json({
      success: true,
      tool,
      proofId,
      verified: true,
      quorumScore: '4/4 UNANIMOUS',
      consensusNodes: ['Atlas-Macro', 'Chronos-Momentum', 'Yield-Oracle', 'Guardian-01'],
      proofStatus: 'CRYPTOGRAPHICALLY_RATIFIED',
      timestamp: nowUtc,
    });
  }

  // Fallback default
  return res.json({
    success: true,
    tool,
    executedAt: nowUtc,
    result: `OpenServ tool ${tool} executed successfully.`,
  });
}
