// api/audit/d1.ts
// Direct Cloudflare D1 integration for Vercel serverless functions

export function getD1Config() {
  return {
    accountId: (
      process.env.LUNARIS_CF_ACCOUNT_ID ||
      process.env.CF_ACCOUNT_ID ||
      process.env.CLOUDFLARE_ACCOUNT_ID ||
      process.env.LUNARIS_ACCOUNT_ID ||
      ''
    ).trim(),
    databaseId: (
      process.env.LUNARIS_D1_DATABASE_ID ||
      process.env.CF_D1_DATABASE_ID ||
      process.env.CLOUDFLARE_D1_DATABASE_ID ||
      process.env.D1_DATABASE_ID ||
      ''
    ).trim(),
    apiToken: (
      process.env.LUNARIS_CF_API_TOKEN ||
      process.env.CF_API_TOKEN ||
      process.env.CLOUDFLARE_API_TOKEN ||
      process.env.LUNARIS_API_TOKEN ||
      ''
    ).trim(),
  };
}

export async function queryD1<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const { accountId, databaseId, apiToken } = getD1Config();
  if (!apiToken || !accountId || !databaseId) {
    return [] as T[];
  }
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
    signal: AbortSignal.timeout(6000),
  });

  if (!resp.ok) {
    throw new Error(`D1 HTTP ${resp.status}`);
  }

  const data = await resp.json();
  if (!data.success) {
    throw new Error(`D1 Error: ${JSON.stringify(data.errors)}`);
  }

  return (data.result?.[0]?.results || []) as T[];
}

export async function saveTradeToD1(t: any): Promise<void> {
  const sql = `
    INSERT OR IGNORE INTO trades (
      id, seq, timestamp, instrument, direction, price,
      entry_price, exit_price, quantity, leverage, fee,
      slippage, gross_pnl, net_pnl, account_balance, status, trigger_reason
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    t.id,
    t.auditSeq,
    t.timestamp,
    t.instrument,
    t.direction,
    t.price,
    t.entryPrice,
    t.exitPrice,
    t.quantity,
    t.leverage,
    t.fee,
    t.slippage,
    t.grossPnl,
    t.netPnl,
    t.accountBalance,
    t.status,
    t.trigger || '',
  ];

  await queryD1(sql, params);
  await queryD1(
    `INSERT OR REPLACE INTO audit_meta (key, val) VALUES ('total_trades', ?), ('current_balance', ?), ('last_updated', ?)`,
    [String(t.auditSeq), String(t.accountBalance), new Date().toISOString()]
  );
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { accountId, databaseId, apiToken } = getD1Config();
  const configured = Boolean(accountId && databaseId && apiToken);

  try {
    if (!configured) {
      return res.status(200).json({
        success: false,
        connected: false,
        error: 'Cloudflare D1 credentials missing from environment',
        tip: 'Configure LUNARIS_CF_ACCOUNT_ID, LUNARIS_D1_DATABASE_ID, and LUNARIS_CF_API_TOKEN',
      });
    }

    const meta = await queryD1('SELECT key, val FROM audit_meta');
    return res.status(200).json({
      success: true,
      connected: true,
      database: 'Cloudflare D1 SQL Ledger',
      meta,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      connected: false,
      error: err.message,
    });
  }
}
