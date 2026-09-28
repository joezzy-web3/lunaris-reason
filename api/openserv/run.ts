// api/openserv/run.ts
// Direct SERV Reasoning API Agent Runner for Hackathon Verification
// Calls https://inference-api.openserv.ai/v1/chat/completions

export const config = {
  maxDuration: 30,
};

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Retrieve API key from Header, Body, or Environment
  const authHeader = req.headers?.authorization || '';
  const bearerKey = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const apiKey =
    req.body?.apiKey ||
    bearerKey ||
    process.env.OPENSERV_API_KEY ||
    process.env.SERV_API_KEY ||
    '';

  if (!apiKey) {
    return res.status(400).json({
      success: false,
      error: 'Missing OpenServ API Key. Please provide OPENSERV_API_KEY or SERV_API_KEY.',
      instruction:
        'Generate an API key at https://console.openserv.ai and ensure "Collection is on" is enabled in your Organization settings (https://console.openserv.ai/settings/organization).',
    });
  }

  const model = req.body?.model || 'serv-mini';
  const customPrompt =
    req.body?.prompt ||
    'Analyze the current market regime for BTC/USDT and UST10Y RWA yield vault (5.15% APY). Run a multi-agent consensus debate between Atlas-Macro (macro liquidity), Chronos (technical momentum), and Guardian-01 (0.5% risk collar). Formulate an approved trade or flight-to-safety capital allocation.';

  try {
    const response = await fetch('https://inference-api.openserv.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content:
              'You are LUNARIS REASON, an autonomous multi-agent quantitative trading and RWA capital allocator agent operating on OpenServ BRAID reasoning architecture. You enforce strict 0.5% slippage collars, Kelly criterion risk budgeting, and 10% performance micro-tolls.',
          },
          {
            role: 'user',
            content: customPrompt,
          },
        ],
        temperature: 0.2,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data?.error?.message || 'OpenServ API returned an error',
        raw: data,
      });
    }

    const agentReasoning = data.choices?.[0]?.message?.content || '';

    return res.status(200).json({
      success: true,
      verified: true,
      servApiRunCompleted: true,
      modelUsed: data.model || model,
      telemetryNotice:
        'This inference run was routed through OpenServ SERV Reasoning API. If "Collection is on" was active in console.openserv.ai/settings/organization, this run is officially logged and verified for hackathon submission.',
      usage: data.usage,
      agentResponse: agentReasoning,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to connect to OpenServ Inference API',
    });
  }
}
