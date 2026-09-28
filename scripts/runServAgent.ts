// scripts/runServAgent.ts
// Executes a full agent reasoning cycle via OpenServ SERV Reasoning API (https://inference-api.openserv.ai/v1)
// Logs the run to your Organization in OpenServ Console when "Collection is on" is enabled.

import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const apiKey =
    process.argv[2] ||
    process.env.OPENSERV_API_KEY ||
    process.env.SERV_API_KEY ||
    '';

  if (!apiKey) {
    console.error('\n❌ Missing OpenServ API Key!');
    console.error('Usage:');
    console.error('  npx tsx scripts/runServAgent.ts <YOUR_OPENSERV_API_KEY>');
    console.error('  OR');
    console.error('  OPENSERV_API_KEY=serv_... npx tsx scripts/runServAgent.ts\n');
    console.error('Note: Ensure "Collection is on" is selected at https://console.openserv.ai/settings/organization');
    process.exit(1);
  }

  console.log('===========================================================');
  console.log('🚀 Triggering Official LUNARIS REASON Run on OpenServ API');
  console.log('Endpoint: https://inference-api.openserv.ai/v1/chat/completions');
  console.log('Model: serv-mini (OpenServ Native Reasoning Engine)');
  console.log('===========================================================\n');

  const systemPrompt =
    'You are LUNARIS REASON, an autonomous quantitative trading and RWA capital allocation agent. Perform a full 4-node reasoning cycle (Atlas-Macro, Chronos-Momentum, Yield-Oracle, Guardian-01). Formulate an approved rebalance or risk-vetoed action.';

  const userPrompt =
    'Ingest live market status: BTC at $64,200 (+1.8%), ETH at $2,640 (-0.4%), UST10Y yield at 5.15% APY, TBILL at 5.28% APY. Evaluate momentum vs sovereign yield arbitrage. Verify 0.5% max slippage collar and Kelly risk envelope. Output final execution decision.';

  try {
    const start = Date.now();
    const response = await fetch('https://inference-api.openserv.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'serv-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
      }),
    });

    const elapsedMs = Date.now() - start;
    const data = await response.json();

    if (!response.ok) {
      console.error(`\n❌ OpenServ API HTTP ${response.status}:`, data);
      process.exit(1);
    }

    console.log(`✅ Run Completed in ${elapsedMs}ms!`);
    console.log('Model Used:', data.model);
    console.log('Tokens Used:', data.usage);
    console.log('\n--- Agent Reasoning Output ---');
    console.log(data.choices?.[0]?.message?.content);
    console.log('------------------------------\n');
    console.log('🎉 Verification Status: COMPLETED');
    console.log('If "Collection is on" is enabled in your OpenServ Organization Settings, this run is now recorded and verifiable by hackathon judges!\n');
  } catch (err: any) {
    console.error('❌ Network error connecting to OpenServ API:', err.message);
    process.exit(1);
  }
}

main();
