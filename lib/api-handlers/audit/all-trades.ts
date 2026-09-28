// api/audit/all-trades.ts
// Vercel Serverless Function: Export audit trades backup backed by Cloudflare D1
import { queryD1 } from './d1.ts';
import { AUTHORITATIVE_AUDIT_TRADES } from '../../authoritativeTradesData.ts';

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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Optional proxy if custom external backend configured
  const backendUrl = process.env.BACKEND_API_URL;
  if (backendUrl) {
    try {
      const url = `${backendUrl.replace(/\/$/, '')}/api/audit/all-trades${req.url?.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;
      const resp = await fetch(url, {
        signal: AbortSignal.timeout(2500),
      });
      if (resp.ok) {
        const json = await resp.json();
        return res.status(200).json(json);
      }
    } catch {}
  }

  const now = Date.now();

  try {
    const metaRows = await queryD1('SELECT key, val FROM audit_meta');
    const metaMap: Record<string, string> = {};
    if (Array.isArray(metaRows)) {
      for (const r of metaRows) {
        if (r && r.key) metaMap[r.key] = r.val;
      }
    }

    const rows = await queryD1('SELECT * FROM trades ORDER BY seq ASC');
    if (rows && rows.length >= AUTHORITATIVE_AUDIT_TRADES.length) {
      const formatted = rows.map(formatD1Row);
      const latestRow = rows[rows.length - 1];
      const totalCount = parseInt(metaMap.total_trades || '', 10) || latestRow.seq || rows.length;
      const currentBalance = parseFloat(metaMap.current_balance || '') || latestRow.account_balance || 100000;

      return res.status(200).json({
        success: true,
        trades: formatted,
        count: formatted.length,
        totalCount,
        currentBalance,
        source: 'Cloudflare-D1-SQL',
        timestamp: now,
      });
    }

    if (rows && rows.length > 0) {
      const formatted = rows.map(formatD1Row);
      const idMap = new Map<string, any>();
      for (const t of AUTHORITATIVE_AUDIT_TRADES) {
        if (t && t.id) idMap.set(t.id, t);
      }
      for (const t of formatted) {
        if (t && t.id) idMap.set(t.id, t);
      }
      const merged = Array.from(idMap.values());
      const latestTrade = merged[merged.length - 1];
      return res.status(200).json({
        success: true,
        trades: merged,
        count: merged.length,
        totalCount: merged.length,
        currentBalance: latestTrade?.accountBalance || 100000,
        source: 'Cloudflare-D1-Merged',
        timestamp: now,
      });
    }
  } catch (err: any) {
    console.error('D1 query fallback in all-trades.ts:', err.message);
  }

  const fallback = AUTHORITATIVE_AUDIT_TRADES;
  const latestTrade = fallback[fallback.length - 1];

  return res.status(200).json({
    success: true,
    trades: fallback,
    count: fallback.length,
    totalCount: fallback.length,
    currentBalance: latestTrade?.accountBalance || 100000,
    source: 'Authoritative-Embedded-Ledger',
    timestamp: now,
  });
}

