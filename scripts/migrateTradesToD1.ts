// scripts/migrateTradesToD1.ts
// Comprehensive Migration Script: Moves the full authoritative audit ledger to Cloudflare D1
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

interface D1Config {
  accountId: string;
  databaseId: string;
  apiToken: string;
}

function getCredentials(): D1Config {
  const accountId = (
    process.env.LUNARIS_CF_ACCOUNT_ID ||
    process.env.CF_ACCOUNT_ID ||
    process.env.CLOUDFLARE_ACCOUNT_ID ||
    ''
  ).trim();
  const databaseId = (
    process.env.LUNARIS_D1_DATABASE_ID ||
    process.env.CF_D1_DATABASE_ID ||
    process.env.CLOUDFLARE_D1_DATABASE_ID ||
    ''
  ).trim();
  const apiToken = (
    process.env.LUNARIS_CF_API_TOKEN ||
    process.env.CF_API_TOKEN ||
    process.env.CLOUDFLARE_API_TOKEN ||
    ''
  ).trim();

  if (!accountId || !databaseId || !apiToken) {
    console.error('\n❌ Missing required Cloudflare D1 environment variables!');
    console.error('Please ensure the following are set in your .env file or environment:');
    if (!accountId) console.error('  - CLOUDFLARE_ACCOUNT_ID (or LUNARIS_CF_ACCOUNT_ID / CF_ACCOUNT_ID)');
    if (!databaseId) console.error('  - CLOUDFLARE_D1_DATABASE_ID (or LUNARIS_D1_DATABASE_ID / CF_D1_DATABASE_ID)');
    if (!apiToken) console.error('  - CLOUDFLARE_API_TOKEN (or LUNARIS_CF_API_TOKEN / CF_API_TOKEN)');
    console.error('\nExample usage:');
    console.error('  CLOUDFLARE_ACCOUNT_ID=xxx CLOUDFLARE_D1_DATABASE_ID=yyy CLOUDFLARE_API_TOKEN=zzz npm run migrate:d1\n');
    process.exit(1);
  }

  return { accountId, databaseId, apiToken };
}

async function queryD1(config: D1Config, sql: string, params: any[] = []): Promise<any> {
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/d1/database/${config.databaseId}/query`;

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
  });

  if (!resp.ok) {
    const errorText = await resp.text();
    throw new Error(`D1 HTTP ${resp.status}: ${errorText}`);
  }

  const data = await resp.json();
  if (!data.success) {
    throw new Error(`D1 Query Error: ${JSON.stringify(data.errors || data.messages)}`);
  }

  return data.result?.[0]?.results || [];
}

async function main() {
  console.log('====================================================');
  console.log('🚀 Lunaris Terminal -> Cloudflare D1 Migration Tool');
  console.log('====================================================\n');

  const config = getCredentials();
  console.log(`✓ Cloudflare Account ID: ${config.accountId.slice(0, 6)}...${config.accountId.slice(-4)}`);
  console.log(`✓ Cloudflare Database ID: ${config.databaseId.slice(0, 6)}...${config.databaseId.slice(-4)}`);
  console.log(`✓ API Token: [Configured via env]\n`);

  // Step 1: Ensure Schema Exists
  console.log('📦 Step 1/3: Verifying and creating D1 database schema...');
  const createTablesSql = `
    CREATE TABLE IF NOT EXISTS trades (
      id TEXT PRIMARY KEY,
      seq INTEGER NOT NULL,
      timestamp TEXT NOT NULL,
      instrument TEXT NOT NULL,
      direction TEXT NOT NULL,
      price REAL NOT NULL,
      entry_price REAL NOT NULL,
      exit_price REAL NOT NULL,
      quantity REAL NOT NULL,
      leverage INTEGER DEFAULT 1,
      fee REAL DEFAULT 0,
      slippage REAL DEFAULT 0,
      gross_pnl REAL DEFAULT 0,
      net_pnl REAL DEFAULT 0,
      account_balance REAL NOT NULL,
      status TEXT NOT NULL,
      trigger_reason TEXT
    );
  `;
  await queryD1(config, createTablesSql);
  await queryD1(config, `CREATE INDEX IF NOT EXISTS idx_trades_seq ON trades(seq DESC);`);
  await queryD1(config, `CREATE INDEX IF NOT EXISTS idx_trades_timestamp ON trades(timestamp DESC);`);
  await queryD1(config, `
    CREATE TABLE IF NOT EXISTS audit_meta (
      key TEXT PRIMARY KEY,
      val TEXT NOT NULL
    );
  `);
  console.log('✓ Tables `trades` and `audit_meta` are ready on Cloudflare D1.\n');

  // Step 2: Read Local Authoritative Ledger
  console.log('📂 Step 2/3: Reading local authoritative audit ledger...');
  const auditPath = path.join(process.cwd(), 'data', 'openserv_fresh_audit_trades.json');
  if (!fs.existsSync(auditPath)) {
    throw new Error(`Audit file not found at ${auditPath}`);
  }

  const rawTrades = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
  if (!Array.isArray(rawTrades) || rawTrades.length === 0) {
    throw new Error('No trades found in audit file to migrate');
  }

  console.log(`✓ Found ${rawTrades.length} trades in local audit ledger.`);

  // Step 3: Batch Insert Trades into Cloudflare D1
  console.log('\n⚡ Step 3/3: Uploading trades to Cloudflare D1 in optimized chunks...');
  const BATCH_SIZE = 25;
  let inserted = 0;

  for (let i = 0; i < rawTrades.length; i += BATCH_SIZE) {
    const chunk = rawTrades.slice(i, i + BATCH_SIZE);
    
    // Construct multi-row INSERT OR REPLACE
    const valuePlaceholders: string[] = [];
    const params: any[] = [];

    for (const t of chunk) {
      valuePlaceholders.push('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
      params.push(
        t.id,
        t.auditSeq ?? (i + params.length / 17),
        t.timestamp || new Date().toISOString(),
        t.instrument || 'BTC/USDT',
        t.direction || 'LONG',
        t.price ?? t.entryPrice ?? 0,
        t.entryPrice ?? t.price ?? 0,
        t.exitPrice ?? t.price ?? 0,
        t.quantity ?? 1,
        t.leverage ?? 1,
        t.fee ?? 0,
        t.slippage ?? 0,
        t.grossPnl ?? 0,
        t.netPnl ?? 0,
        t.accountBalance ?? 100000,
        t.status || 'CLOSED',
        t.trigger || t.trigger_reason || ''
      );
    }

    const insertSql = `
      INSERT OR REPLACE INTO trades (
        id, seq, timestamp, instrument, direction, price,
        entry_price, exit_price, quantity, leverage, fee,
        slippage, gross_pnl, net_pnl, account_balance, status, trigger_reason
      ) VALUES ${valuePlaceholders.join(', ')}
    `;

    try {
      await queryD1(config, insertSql, params);
      inserted += chunk.length;
      process.stdout.write(`\r  Progress: ${inserted} / ${rawTrades.length} trades synchronized...`);
    } catch (err: any) {
      console.error(`\n  ❌ Error inserting chunk ${i}-${i + chunk.length}:`, err.message);
      // Fallback: try individual inserts for this chunk
      for (const t of chunk) {
        try {
          const singleSql = `
            INSERT OR REPLACE INTO trades (
              id, seq, timestamp, instrument, direction, price,
              entry_price, exit_price, quantity, leverage, fee,
              slippage, gross_pnl, net_pnl, account_balance, status, trigger_reason
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          await queryD1(config, singleSql, [
            t.id,
            t.auditSeq ?? 0,
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
          ]);
          inserted++;
        } catch (singleErr: any) {
          console.error(`    Skipped trade ${t.id}:`, singleErr.message);
        }
      }
    }
  }

  console.log(`\n\n✓ Successfully processed ${inserted} trades into Cloudflare D1!`);

  // Update audit_meta with aggregate stats
  const latestTrade = rawTrades[rawTrades.length - 1];
  const totalCount = rawTrades.length;
  const currentBalance = latestTrade ? latestTrade.accountBalance : 100000;

  await queryD1(
    config,
    `INSERT OR REPLACE INTO audit_meta (key, val) VALUES ('total_trades', ?), ('current_balance', ?), ('last_updated', ?)`,
    [String(totalCount), String(currentBalance), new Date().toISOString()]
  );
  console.log(`✓ Updated audit metadata: Total Trades = ${totalCount}, Balance = $${currentBalance}`);

  // Verification Query
  console.log('\n🔍 Verifying Cloudflare D1 database state...');
  const stats = await queryD1(
    config,
    `SELECT COUNT(*) as count, MIN(seq) as min_seq, MAX(seq) as max_seq, MAX(account_balance) as max_balance FROM trades`
  );
  console.log('✓ D1 Verification Query Result:', stats);

  const sample = await queryD1(
    config,
    `SELECT id, seq, instrument, direction, net_pnl, account_balance, status FROM trades ORDER BY seq DESC LIMIT 3`
  );
  console.log('\n✓ Latest 3 trades in Cloudflare D1:');
  console.table(sample);

  console.log('\n====================================================');
  console.log('🎉 Migration to Cloudflare D1 complete!');
  console.log('Now ensure the following env variables are set in your Vercel Project Settings:');
  console.log('  1. CLOUDFLARE_ACCOUNT_ID');
  console.log('  2. CLOUDFLARE_D1_DATABASE_ID');
  console.log('  3. CLOUDFLARE_API_TOKEN');
  console.log('Once set, your Vercel deployment will serve all live trades directly from Cloudflare D1.');
  console.log('====================================================\n');
}

main().catch((err) => {
  console.error('\n❌ Migration failed:', err.message);
  process.exit(1);
});
