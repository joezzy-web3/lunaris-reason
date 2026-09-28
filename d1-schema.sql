-- Cloudflare D1 SQL Schema for Lunaris Terminal Audit Ledger
-- Execute this in Cloudflare Dashboard > Workers & D1 > D1 > [Your Database] > Console
-- Or via Wrangler CLI: wrangler d1 execute <database-name> --file=./d1-schema.sql

-- 1. Trades Table
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

-- 2. Indexes for high-speed chronological queries
CREATE INDEX IF NOT EXISTS idx_trades_seq ON trades(seq DESC);
CREATE INDEX IF NOT EXISTS idx_trades_timestamp ON trades(timestamp DESC);

-- 3. Audit Metadata Table for High-Water Mark & Live Portfolio State
CREATE TABLE IF NOT EXISTS audit_meta (
  key TEXT PRIMARY KEY,
  val TEXT NOT NULL
);

-- Initial metadata defaults
INSERT OR REPLACE INTO audit_meta (key, val) VALUES 
  ('total_trades', '0'),
  ('current_balance', '100000'),
  ('last_updated', datetime('now'));
