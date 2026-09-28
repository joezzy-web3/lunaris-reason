// scripts/seedD1.ts
import fs from 'fs';
import path from 'path';
import { executeD1Query } from '../lib/cloudflareD1.ts';

async function main() {
  console.log('Seeding authoritative trade batch into Cloudflare D1...');

  const auditPath = path.join(process.cwd(), 'data', 'openserv_fresh_audit_trades.json');
  let trades: any[] = [];
  if (fs.existsSync(auditPath)) {
    trades = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
  }

  if (!Array.isArray(trades) || trades.length === 0) {
    console.error('No trades found in', auditPath);
    return;
  }

  console.log(`Writing ${trades.length} trades to Cloudflare D1...`);

  let inserted = 0;
  for (const t of trades) {
    const sql = `
      INSERT OR REPLACE INTO trades (
        id, seq, timestamp, instrument, direction, price,
        entry_price, exit_price, quantity, leverage, fee,
        slippage, gross_pnl, net_pnl, account_balance, status, trigger_reason
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      t.id,
      t.auditSeq ?? 0,
      t.timestamp,
      t.instrument,
      t.direction,
      t.price ?? t.entryPrice,
      t.entryPrice ?? t.price,
      t.exitPrice ?? t.price,
      t.quantity ?? 1,
      t.leverage ?? 1,
      t.fee ?? 0,
      t.slippage ?? 0,
      t.grossPnl ?? 0,
      t.netPnl ?? 0,
      t.accountBalance ?? 100000,
      t.status || 'CLOSED',
      t.trigger || t.trigger_reason || '',
    ];

    try {
      await executeD1Query(sql, params);
      inserted++;
    } catch (err: any) {
      console.error(`Failed to insert trade ${t.id}:`, err.message);
    }
  }

  const latestTrade = trades[trades.length - 1];
  const totalCount = trades.length;
  const currentBalance = latestTrade ? latestTrade.accountBalance : 100000;

  // Update audit_meta with aggregate stats
  await executeD1Query(
    `INSERT OR REPLACE INTO audit_meta (key, val) VALUES ('total_trades', ?), ('current_balance', ?), ('last_updated', ?)`,
    [String(totalCount), String(currentBalance), new Date().toISOString()]
  );

  console.log(`Successfully seeded ${inserted} trades and metadata into Cloudflare D1!`);

  // Verify
  const rows = await executeD1Query('SELECT COUNT(*) as count, MAX(seq) as max_seq FROM trades');
  console.log('Verification query from Cloudflare D1:', rows);
}

main().catch(console.error);
