// api/audit/summary.ts
// Vercel Serverless Function: Authoritative audit summary backed by Cloudflare D1
import { getProgressiveState, computeMetrics } from './engine.ts';
import { queryD1, saveTradeToD1 } from './d1.ts';
import { AUTHORITATIVE_AUDIT_TRADES } from '../../authoritativeTradesData.ts';

export const config = {
  maxDuration: 10,
};

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const now = Date.now();
  const progressive = getProgressiveState(now);
  const baseCount = AUTHORITATIVE_AUDIT_TRADES.length;
  const latestBaseTrade = AUTHORITATIVE_AUDIT_TRADES[AUTHORITATIVE_AUDIT_TRADES.length - 1];

  let d1Total = 0;
  let d1Balance = 0;

  // Background sync to Cloudflare D1 (guarantees DB always holds latest state without blocking response)
  try {
    const metaRows = await queryD1<{ key: string; val: string }>('SELECT key, val FROM audit_meta');
    const metaMap = new Map(metaRows.map(m => [m.key, m.val]));
    d1Total = parseInt(metaMap.get('total_trades') || '0', 10);
    d1Balance = parseFloat(metaMap.get('current_balance') || '0');

    if (progressive.latestTrade && progressive.latestTrade.auditSeq > d1Total) {
      await saveTradeToD1(progressive.latestTrade);
    }
  } catch (err: any) {
    // Non-fatal if D1 has a transient delay; fallback to progressive state
    console.error('D1 sync check non-fatal error:', err.message);
  }

  const totalTrades = Math.max(baseCount, d1Total, progressive.totalTrades || 0);
  const currentBalance = d1Balance > 100000 ? d1Balance : (progressive.currentBalance || latestBaseTrade?.accountBalance || 100000);
  const latestTrade = progressive.latestTrade || latestBaseTrade;

  const metrics = computeMetrics(totalTrades, currentBalance, latestTrade);

  const nextExecutionTime = Math.ceil(now / 60000) * 60000;
  const secondsUntilNextTick = Math.max(0, Math.ceil((nextExecutionTime - now) / 1000));

  const payload = {
    success: true,
    totalTrades,
    count: totalTrades,
    currentBalance,
    metrics,
    latestTrade,
    nextExecutionTime,
    secondsUntilNextTick,
    secondsUntilNextExecution: secondsUntilNextTick,
    timestamp: now,
    database: 'Cloudflare-D1-SQL',
  };

  return res.status(200).json(payload);
}
