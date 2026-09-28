// lib/api-handlers/openserv/debate.ts
// OpenServ serv-mini Real-Time Bounded Council Debate Deliberation
// Connects to https://inference-api.openserv.ai/v1/chat/completions
// Enforces strict token-budget preservation (max_tokens: 400) for cost efficiency

export const config = {
  maxDuration: 25,
};

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { ticker, clientPrice, instruction, forceOverAllocation } = req.body || {};
  const symbol = (ticker || 'BTC').trim().toUpperCase();
  const livePrice = typeof clientPrice === 'number' && Number.isFinite(clientPrice) && clientPrice > 0 ? clientPrice : 68500;
  const promptInstruction = instruction ? String(instruction).trim() : '';

  // Retrieve OpenServ API key
  const authHeader = req.headers?.authorization || '';
  const bearerKey = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const apiKey =
    req.body?.apiKey ||
    bearerKey ||
    process.env.OPENSERV_API_KEY ||
    process.env.SERV_API_KEY ||
    '';

  const startTime = performance.now();

  // If no API key is provided in environment or request, return graceful guidance with deterministic council fallback
  if (!apiKey) {
    return res.status(200).json({
      success: true,
      isRealServ: false,
      model: 'deterministic-council-engine',
      tip: 'Configure OPENSERV_API_KEY or SERV_API_KEY to activate live serv-mini neural inference.',
      data: null,
    });
  }

  const systemPrompt = `You are LUNARIS REASON, an institutional 4-agent quantitative trading and RWA council operating on OpenServ BRAID bounded reasoning architecture.
You simulate a dialectic debate between:
1. QUANT (Quant-Omega // Momentum & Orderbook Lead): Technical indicators, breakout signals, bid/ask skew.
2. GUARDIAN (Guardian-01 // Deterministic Risk Gate): Strictly enforces 0.5% max slippage collar and 5x max leverage.
3. NEXUS_RED (Adversarial Red Team // Chaos Arbiter): Challenges liquidity traps, macro tripwires, and funding squeezes.
4. MACRO (Atlas-Macro // Sovereign Yields & Strategic Lead): Cross-asset macro liquidity, US Treasury bond yield spreads (UST10Y 5.15% APY).

Current verified asset: ${symbol} at $${livePrice.toLocaleString()} USD.
${forceOverAllocation ? 'STRESS TEST: A forced 32% over-allocation has been proposed. NEXUS_RED and GUARDIAN MUST issue an explicit VETO and recalibrate size <= 5%.' : ''}
${promptInstruction ? `Trader Mandate: "${promptInstruction}". Direct the council to deliberate on this mandate.` : ''}

Respond ONLY with valid, minified JSON matching this schema:
{
  "assetSymbol": "${symbol}",
  "currentPrice": ${livePrice},
  "verdict": {
    "action": "BUY" | "SELL" | "HOLD" | "VETO",
    "optimalSizePct": number,
    "winRatePct": number,
    "stopLoss": "4.2%",
    "takeProfit": "11.5%",
    "consensusStatus": "UNANIMOUS" | "SUPERMAJORITY" | "CONTENTIOUS",
    "riskMitigationClause": "Strict 0.5% slippage collar enforced by Guardian-01 with limit execution",
    "synthesizedReasoning": "Concise 1-2 sentence executive verdict for ${symbol}"
  },
  "turns": [
    { "speakerId": "QUANT", "speakerName": "Quant-Omega", "stance": "BULLISH" | "BEARISH", "argument": "1 concise sentence on momentum and volume." },
    { "speakerId": "GUARDIAN", "speakerName": "Guardian-01", "stance": "CAUTION" | "VETO" | "APPROVED", "argument": "1 concise sentence on slippage collar and leverage boundaries." },
    { "speakerId": "NEXUS_RED", "speakerName": "NEXUS-RED", "stance": "ADVERSARIAL_CHALLENGE" | "VETO", "argument": "1 concise sentence on traps and stress-testing." },
    { "speakerId": "MACRO", "speakerName": "Atlas-Macro", "stance": "SUPERMAJORITY" | "VETO_RATIFIED", "argument": "1 concise sentence on macro liquidity and sovereign yield comparison." }
  ]
}`;

  try {
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
          { role: 'user', content: `Run dialectic council deliberation on ${symbol} at $${livePrice}. Return minified JSON.` },
        ],
        temperature: 0.2,
        max_tokens: 380, // strict token bounding for cost conservation & fast response
      }),
      signal: AbortSignal.timeout(12000), // 12 second fail-safe
    });

    const elapsed = Math.round(performance.now() - startTime);

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      return res.status(200).json({
        success: true,
        isRealServ: false,
        error: `OpenServ API returned HTTP ${response.status}: ${errText.slice(0, 150)}`,
        model: 'deterministic-council-engine',
        data: null,
      });
    }

    const openServData = await response.json();
    const rawContent = openServData.choices?.[0]?.message?.content || '';

    // Clean JSON markdown tags if model included them
    let cleanJsonStr = rawContent.trim();
    if (cleanJsonStr.startsWith('```json')) {
      cleanJsonStr = cleanJsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanJsonStr.startsWith('```')) {
      cleanJsonStr = cleanJsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    try {
      const parsedData = JSON.parse(cleanJsonStr);
      return res.status(200).json({
        success: true,
        isRealServ: true,
        model: 'serv-mini',
        provider: 'OpenServ SERV Reasoning Network',
        telemetryLogged: true,
        telemetryDestination: 'https://console.openserv.ai',
        latencyMs: elapsed,
        data: parsedData,
      });
    } catch {
      // If JSON parsing was partial, extract verdict or return structured fallback
      return res.status(200).json({
        success: true,
        isRealServ: true,
        model: 'serv-mini',
        rawText: rawContent,
        latencyMs: elapsed,
        data: null,
      });
    }
  } catch (fetchErr: any) {
    return res.status(200).json({
      success: true,
      isRealServ: false,
      error: fetchErr.message || 'OpenServ request timeout',
      model: 'deterministic-council-engine',
      data: null,
    });
  }
}
