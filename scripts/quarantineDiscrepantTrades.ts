import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface AuditTrade {
  id: string;
  auditSeq?: number;
  timestamp: string;
  instrument: string;
  direction: 'LONG' | 'SHORT';
  price: number;
  entryPrice?: number;
  exitPrice?: number;
  quantity?: number;
  leverage?: number;
  fee?: number;
  slippage?: number;
  grossPnl?: number;
  netPnl?: number;
  balanceChange?: number;
  balanceChangePct?: number;
  accountBalance: number;
  status: string;
  trigger?: string;
  notes?: string;
  sourceHandler?: string;
  [key: string]: any;
}

const AUDIT_FILE = path.join(process.cwd(), 'data', 'openserv_fresh_audit_trades.json');
const AUTOPILOT_FILE = path.join(process.cwd(), 'data', 'openserv_fresh_autopilot_state.json');
const QUARANTINE_DIR = path.join(process.cwd(), 'data', 'quarantine');
const BACKUP_DIR = path.join(process.cwd(), 'data', 'backups');

const QUARANTINE_FILE = path.join(QUARANTINE_DIR, 'quarantine_trades_1790609515332.json');
const BACKUP_FILE = path.join(BACKUP_DIR, `audit_trades_backup_pre_quarantine_${Date.now()}.json`);

export function runQuarantine() {
  if (!fs.existsSync(AUDIT_FILE)) {
    console.error('Audit file does not exist:', AUDIT_FILE);
    return;
  }

  if (!fs.existsSync(QUARANTINE_DIR)) {
    fs.mkdirSync(QUARANTINE_DIR, { recursive: true });
  }
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const raw = fs.readFileSync(AUDIT_FILE, 'utf8');
  const allTrades: AuditTrade[] = JSON.parse(raw);
  console.log(`Initial trade count in active ledger: ${allTrades.length}`);

  // Create pre-quarantine backup
  fs.writeFileSync(BACKUP_FILE, raw, 'utf8');
  console.log(`Pre-quarantine backup saved to: ${BACKUP_FILE}`);

  const targetAnomalyIds = new Set([
    'PT-20260928-0299', 'PT-20260928-0355', 'PT-20260928-0352',
    'PT-20260928-0044', 'PT-20260928-0051', 'PT-20260928-0063', 'PT-20260928-0129',
    'PT-20260928-0090', 'PT-20260928-0170', 'PT-20260928-0181',
    'PT-20260928-0070', 'PT-20260928-0103',
    'PT-20260928-0056', 'PT-20260928-0065', 'PT-20260928-0111', 'PT-20260928-0207',
    'PT-20260928-0049', 'PT-20260928-0132',
    'PT-20260928-0003', 'PT-20260928-0353',
    'PT-20260928-0057', 'PT-20260928-0086', 'PT-20260928-0126', 'PT-20260928-0146', 'PT-20260928-0162', 'PT-20260928-0201',
    'PT-20260928-0046', 'PT-20260928-0052', 'PT-20260928-0087', 'PT-20260928-0116',
    'PT-20260928-0217', 'PT-20260928-0043',
  ]);

  const quarantinedRecords: any[] = [];
  const cleanTrades: AuditTrade[] = [];

  for (let i = 0; i < allTrades.length; i++) {
    const t = allTrades[i];
    const p = Number(t.price || t.entryPrice || 0);
    const sym = String(t.instrument || '').toUpperCase();
    let isDiscrepant = false;
    let reason = '';

    if (targetAnomalyIds.has(t.id)) {
      isDiscrepant = true;
      reason = `Targeted anomaly audit match for ID ${t.id}`;
    } else if (p === 100 && !sym.includes('TBILL') && !sym.includes('UST10Y')) {
      isDiscrepant = true;
      reason = `Discrepant $100 placeholder entry price detected for ${sym}`;
    } else if (sym.includes('XAG') && p > 45) {
      isDiscrepant = true;
      reason = `XAG/USD spiked to $${p} against baseline series`;
    } else if (sym.includes('QQQ') && p < 600) {
      isDiscrepant = true;
      reason = `QQQ/USDT entered at stale fallback $${p} instead of live market ~$740`;
    } else if (sym.includes('SOL') && p < 110) {
      isDiscrepant = true;
      reason = `SOL/USDT entered at stale fallback $${p} instead of live market ~$118.50`;
    } else if (sym.includes('BGB') && p < 1.7) {
      isDiscrepant = true;
      reason = `BGB/USDT entered at stale fallback $${p} instead of live market ~$1.98`;
    } else if (sym.includes('NVDA') && p < 200) {
      isDiscrepant = true;
      reason = `NVDAon/USDT entered at stale fallback $${p} instead of live market ~$228`;
    } else if (sym.includes('PAXG') && p < 3500) {
      isDiscrepant = true;
      reason = `PAXG/USDT entered at stale fallback $${p} instead of live market ~$4,150`;
    } else if (sym.includes('PLTR') && p < 100) {
      isDiscrepant = true;
      reason = `PLTR/USDT entered at stale fallback $${p} instead of live market ~$188`;
    } else if (sym.includes('AVGO') && p < 250) {
      isDiscrepant = true;
      reason = `AVGO/USDT entered at stale fallback $${p} instead of live market ~$352`;
    } else if (sym.includes('MSFT') && p < 450) {
      isDiscrepant = true;
      reason = `MSFT/USDT entered at stale fallback $${p} instead of live market ~$505`;
    } else if (sym.includes('TSLA') && p < 300) {
      isDiscrepant = true;
      reason = `TSLAon/USDT entered at stale fallback $${p} instead of live market ~$372`;
    } else if (sym.includes('MARA') && p > 16) {
      isDiscrepant = true;
      reason = `MARA/USDT entered at stale fallback $${p} instead of live market ~$12.35`;
    } else if (sym.includes('MSTR') && p < 145) {
      isDiscrepant = true;
      reason = `MSTR/USDT entered at stale fallback $${p} instead of live market ~$156`;
    }

    if (isDiscrepant) {
      const sha256Hash = crypto.createHash('sha256').update(JSON.stringify(t)).digest('hex');
      quarantinedRecords.push({
        quarantinedAt: new Date().toISOString(),
        reason,
        sha256ForensicProof: sha256Hash,
        trade: t,
      });
    } else {
      cleanTrades.push(t);
    }
  }

  console.log(`Quarantined count: ${quarantinedRecords.length}`);
  console.log(`Clean trades remaining: ${cleanTrades.length}`);

  // Re-chain clean trades sequentially from $100,000.00
  let currentBalance = 100000.0;
  const reChainedTrades: AuditTrade[] = [];

  for (let i = 0; i < cleanTrades.length; i++) {
    const trade = cleanTrades[i];
    const netPnl = Number(trade.netPnl ?? trade.balanceChange ?? 0);
    const newBalance = parseFloat((currentBalance + netPnl).toFixed(2));

    reChainedTrades.push({
      ...trade,
      auditSeq: i + 1,
      accountBalance: newBalance,
      audited: true,
      auditVersion: 2,
      lastAuditedAt: new Date().toISOString(),
    });

    currentBalance = newBalance;
  }

  // Save quarantine records
  fs.writeFileSync(QUARANTINE_FILE, JSON.stringify(quarantinedRecords, null, 2), 'utf8');
  console.log(`Quarantined records saved to: ${QUARANTINE_FILE}`);

  // Save re-chained clean active trades
  fs.writeFileSync(AUDIT_FILE, JSON.stringify(reChainedTrades, null, 2), 'utf8');
  console.log(`Re-chained active ledger saved to: ${AUDIT_FILE}`);
  console.log(`Ending confirmed balance: $${currentBalance.toLocaleString()}`);

  // Update autopilot state if exists
  if (fs.existsSync(AUTOPILOT_FILE)) {
    try {
      const apState = JSON.parse(fs.readFileSync(AUTOPILOT_FILE, 'utf8'));
      apState.cashBalance = currentBalance;
      apState.lastUpdated = new Date().toISOString();
      fs.writeFileSync(AUTOPILOT_FILE, JSON.stringify(apState, null, 2), 'utf8');
      console.log(`Autopilot state synchronized to $${currentBalance.toLocaleString()}`);
    } catch (e: any) {
      console.warn('Could not update autopilot state:', e?.message);
    }
  }

  console.log('Quarantine & reconciliation completed successfully.');
}

runQuarantine();
