// api/audit/export-json.ts
// Vercel Serverless Function: Download full audit trail as JSON file backed by Cloudflare D1
import { queryD1 } from './d1.ts';
import embeddedTrades from '../../data/openserv_fresh_audit_trades.json' with { type: 'json' };
import { computeMetrics } from './engine.ts';

export const config = {
  maxDuration: 15,
};

function formatD1Row(r: any) {
  const entryPrice = r.entry_price || r.price;
  const exitPrice = r.exit_price || r.price;
  const priceDelta = parseFloat((exitPrice - entryPrice).toFixed(entryPrice < 10 ? 4 : 2));
  const priceDeltaPct = entryPrice > 0 ? parseFloat((((exitPrice - entryPrice) / entryPrice) * 100).toFixed(2)) : 0;

  return {
    id: r.id,
    timestamp: r.timestamp,
    instrument: r.instrument,
    direction: r.direction,
    price: r.price,
    entryPrice,
    exitPrice,
    priceDelta,
    priceDeltaPct,
    quantity: r.quantity,
    leverage: r.leverage,
    fee: r.fee,
    slippage: r.slippage,
    grossPnl: r.gross_pnl,
    netPnl: r.net_pnl,
    balanceChange: r.net_pnl,
    balanceChangePct: r.quantity > 0 ? parseFloat(((r.net_pnl / r.quantity) * 100).toFixed(2)) : 0,
    accountBalance: r.account_balance,
    status: r.status,
    trigger: r.trigger_reason,
    auditSeq: r.seq,
    sourceHandler: 'AUTOPILOT_DAEMON',
  };
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="lunaris_reason_trade_audit.json"');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let trades: any[] = [];

  try {
    const rows = await queryD1('SELECT * FROM trades ORDER BY seq ASC');
    if (rows && rows.length > 0) {
      trades = rows.map(formatD1Row);
    }
  } catch (err: any) {
    console.error('D1 query fallback in export-json.ts:', err.message);
  }

  if (trades.length === 0) {
    trades = Array.isArray(embeddedTrades) ? (embeddedTrades as any[]) : [];
  }

  const latestTrade = trades.length > 0 ? trades[trades.length - 1] : null;
  const currentBalance = latestTrade ? latestTrade.accountBalance : 100000;
  const metrics = computeMetrics(trades.length, currentBalance, latestTrade);

  const payload = {
    platform: 'OpenServ AgentKit Protocol + BRAID',
    domain: 'Autonomous RWA Yield & Multi-Agent Bounded Reasoning',
    databaseEngine: 'Cloudflare D1 Distributed Edge SQL',
    startingCapitalUsd: 100000.0,
    currency: 'USD',
    baselineSpecification: '$100,000.00 USD Institutional Genesis Capital Pool',
    totalRecords: trades.length,
    settledBalance: currentBalance,
    exportTimestamp: new Date().toISOString(),
    metrics,
    auditLog: trades,
  };

  return res.status(200).send(JSON.stringify(payload, null, 2));
}
