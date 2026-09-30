/**
 * Test script for 24/7 Autopilot Cron Trigger
 * Tests /api/audit/trigger-daemon and Cloudflare D1 integration
 *
 * Usage:
 *   npx tsx scripts/testCronTrigger.ts
 */

import dotenv from 'dotenv';
dotenv.config();

async function main() {
  console.log('===========================================================');
  console.log('⚡ Testing 24/7 Autopilot Cron Trigger (/api/audit/trigger-daemon)');
  console.log('===========================================================\n');

  const targetUrl = process.env.TARGET_API_URL || process.env.BACKEND_API_URL || 'http://127.0.0.1:3000';
  const endpoint = `${targetUrl.replace(/\/+$/, '')}/api/audit/trigger-daemon`;

  console.log(`Pinging endpoint: ${endpoint}`);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Cloudflare-Worker-Cron-Test/1.0',
      },
      body: JSON.stringify({
        source: 'MANUAL_CLI_TEST',
        timestamp: new Date().toISOString(),
      }),
    });

    console.log(`HTTP Status: ${res.status} ${res.statusText}`);
    const data = await res.json();
    console.log('\nResponse Data:');
    console.log(JSON.stringify(data, null, 2));

    if (data.success && data.trade) {
      console.log('\n✅ Cron Heartbeat Succeeded!');
      console.log(`Executed Trade: ${data.trade.id} (${data.trade.instrument} ${data.trade.direction})`);
      console.log(`PnL: $${data.trade.netPnl} | Account Balance: $${data.trade.accountBalance}`);
      console.log(`Total Trades in Ledger: ${data.count}`);
    } else {
      console.log('\n⚠️ Trigger returned non-trade response:', data);
    }
  } catch (err: any) {
    console.error('\n❌ Failed to ping endpoint:', err.message);
    console.log('Make sure the dev server or deployed app is running.');
  }
}

main();
