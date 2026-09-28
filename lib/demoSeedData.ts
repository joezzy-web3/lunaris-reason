/**
 * LUNARIS Terminal - Seeded Random-Walk Engine & Fallback Market Data
 * Provides reliable, realistic multi-asset pricing with random-walk drift,
 * volatility modeling, and scenario shock capabilities.
 */

export interface AssetSeedConfig {
  ticker: string;
  name: string;
  basePrice: number;
  volatility: number;
  class: 'CX' | 'EQ';
  unitDecimals: number;
}

export const SEEDED_ASSETS: Record<string, AssetSeedConfig> = {
  BTC: { ticker: 'BTC', name: 'Bitcoin', basePrice: 85465.0, volatility: 0.0035, class: 'CX', unitDecimals: 2 },
  ETH: { ticker: 'ETH', name: 'Ethereum', basePrice: 2722.0, volatility: 0.004, class: 'CX', unitDecimals: 2 },
  SOL: { ticker: 'SOL', name: 'Solana', basePrice: 116.9, volatility: 0.0055, class: 'CX', unitDecimals: 2 },
  SUI: { ticker: 'SUI', name: 'Sui Network', basePrice: 0.8502, volatility: 0.006, class: 'CX', unitDecimals: 4 },
  DOGE: { ticker: 'DOGE', name: 'Dogecoin', basePrice: 0.081, volatility: 0.006, class: 'CX', unitDecimals: 5 },
  XRP: { ticker: 'XRP', name: 'Ripple', basePrice: 1.29, volatility: 0.005, class: 'CX', unitDecimals: 4 },
  AVAX: { ticker: 'AVAX', name: 'Avalanche', basePrice: 7.52, volatility: 0.005, class: 'CX', unitDecimals: 2 },
  ADA: { ticker: 'ADA', name: 'Cardano', basePrice: 0.198, volatility: 0.005, class: 'CX', unitDecimals: 4 },
  LINK: { ticker: 'LINK', name: 'Chainlink', basePrice: 11.14, volatility: 0.004, class: 'CX', unitDecimals: 2 },
  NEAR: { ticker: 'NEAR', name: 'Near Protocol', basePrice: 2.79, volatility: 0.006, class: 'CX', unitDecimals: 3 },
  PEPE: { ticker: 'PEPE', name: 'Pepe', basePrice: 0.00000345, volatility: 0.008, class: 'CX', unitDecimals: 8 },
  TAO: { ticker: 'TAO', name: 'Bittensor', basePrice: 226.2, volatility: 0.006, class: 'CX', unitDecimals: 2 },
  APT: { ticker: 'APT', name: 'Aptos', basePrice: 0.575, volatility: 0.006, class: 'CX', unitDecimals: 4 },
  BNB: { ticker: 'BNB', name: 'BNB Chain', basePrice: 592.0, volatility: 0.003, class: 'CX', unitDecimals: 2 },
  BGB: { ticker: 'BGB', name: 'Bitget Token', basePrice: 1.98, volatility: 0.004, class: 'CX', unitDecimals: 4 },
  // Real-World Assets (RWA) & Commodities
  XAU: { ticker: 'XAU', name: 'Gold Spot (Tokenized Oz)', basePrice: 4169.7, volatility: 0.003, class: 'EQ', unitDecimals: 2 },
  PAXG: { ticker: 'PAXG', name: 'Paxos Physical Gold', basePrice: 4146.2, volatility: 0.003, class: 'EQ', unitDecimals: 2 },
  XAG: { ticker: 'XAG', name: 'Silver Spot (Tokenized Oz)', basePrice: 31.85, volatility: 0.004, class: 'EQ', unitDecimals: 2 },
  WTI: { ticker: 'WTI', name: 'Crude Oil (WTI Light Sweet)', basePrice: 71.30, volatility: 0.005, class: 'EQ', unitDecimals: 2 },
  BRENT: { ticker: 'BRENT', name: 'Brent Crude Oil Spot', basePrice: 75.20, volatility: 0.005, class: 'EQ', unitDecimals: 2 },
  COPPER: { ticker: 'COPPER', name: 'High-Grade Copper Futures', basePrice: 4.35, volatility: 0.004, class: 'EQ', unitDecimals: 3 },
  REIT: { ticker: 'REIT', name: 'Commercial Real Estate Pool', basePrice: 88.40, volatility: 0.002, class: 'EQ', unitDecimals: 2 },
  UST10Y: { ticker: 'UST10Y', name: 'US 10-Year Treasury Vault', basePrice: 104.20, volatility: 0.0015, class: 'EQ', unitDecimals: 2 },
  TBILL: { ticker: 'TBILL', name: '3-Month US Treasury Bill Token', basePrice: 100.15, volatility: 0.0005, class: 'EQ', unitDecimals: 2 },
  URANIUM: { ticker: 'URANIUM', name: 'Sprott Physical Uranium Fund', basePrice: 78.50, volatility: 0.004, class: 'EQ', unitDecimals: 2 },
  AGRI: { ticker: 'AGRI', name: 'Global Agricultural Pool', basePrice: 21.40, volatility: 0.003, class: 'EQ', unitDecimals: 2 },
  USDY: { ticker: 'USDY', name: 'Ondo US Dollar Yield (5.2% APY)', basePrice: 1.052, volatility: 0.0002, class: 'EQ', unitDecimals: 3 },
  // Equities & 24/7 rTokens (Updated to Current Market Levels)
  AAPL: { ticker: 'AAPL', name: 'Apple Inc.', basePrice: 339.9, volatility: 0.002, class: 'EQ', unitDecimals: 2 },
  TSLA: { ticker: 'TSLA', name: 'Tesla Inc.', basePrice: 359.5, volatility: 0.006, class: 'EQ', unitDecimals: 2 },
  NVDA: { ticker: 'NVDA', name: 'Nvidia Corp.', basePrice: 230.2, volatility: 0.0045, class: 'EQ', unitDecimals: 2 },
  NVDAon: { ticker: 'NVDAon', name: 'Nvidia Corp (rToken 7x24)', basePrice: 230.2, volatility: 0.0045, class: 'EQ', unitDecimals: 2 },
  TSLAon: { ticker: 'TSLAon', name: 'Tesla Inc (rToken 7x24)', basePrice: 359.5, volatility: 0.006, class: 'EQ', unitDecimals: 2 },
  MSFT: { ticker: 'MSFT', name: 'Microsoft Corp.', basePrice: 511.9, volatility: 0.002, class: 'EQ', unitDecimals: 2 },
  GOOGL: { ticker: 'GOOGL', name: 'Alphabet Inc.', basePrice: 172.6, volatility: 0.0025, class: 'EQ', unitDecimals: 2 },
  AMZN: { ticker: 'AMZN', name: 'Amazon.com Inc.', basePrice: 198.3, volatility: 0.003, class: 'EQ', unitDecimals: 2 },
  META: { ticker: 'META', name: 'Meta Platforms', basePrice: 578.0, volatility: 0.0035, class: 'EQ', unitDecimals: 2 },
  MSTR: { ticker: 'MSTR', name: 'MicroStrategy', basePrice: 160.6, volatility: 0.008, class: 'EQ', unitDecimals: 2 },
  COIN: { ticker: 'COIN', name: 'Coinbase Global', basePrice: 175.3, volatility: 0.007, class: 'EQ', unitDecimals: 2 },
  PLTR: { ticker: 'PLTR', name: 'Palantir Tech', basePrice: 189.2, volatility: 0.005, class: 'EQ', unitDecimals: 2 },
  AMD: { ticker: 'AMD', name: 'Advanced Micro Devices', basePrice: 145.2, volatility: 0.005, class: 'EQ', unitDecimals: 2 },
  MARA: { ticker: 'MARA', name: 'MARA Holdings', basePrice: 12.4, volatility: 0.009, class: 'EQ', unitDecimals: 2 },
  AVGO: { ticker: 'AVGO', name: 'Broadcom Inc.', basePrice: 351.1, volatility: 0.004, class: 'EQ', unitDecimals: 2 },
  QQQ: { ticker: 'QQQ', name: 'Invesco QQQ Trust', basePrice: 738.0, volatility: 0.002, class: 'EQ', unitDecimals: 2 },
};

// Internal tracked state for random walk continuous motion
const lastGeneratedPrices: Record<string, number> = {};

// Active market shock multiplier for demo tests (e.g. -12% for stop loss verification)
let activeShockMultiplier: Record<string, number> = {};

export function setAssetShock(ticker: string, multiplier: number) {
  activeShockMultiplier[ticker] = multiplier;
}

export function clearAssetShocks() {
  activeShockMultiplier = {};
}

/**
 * Returns seeded price with realistic random walk drift and strict deviation sanity guard.
 */
export function getSeededPrice(ticker: string, currentPrice?: number): number {
  const raw = (ticker || 'BTC').trim();
  const upper = raw.toUpperCase();
  const cleanKey = upper
    .replace(/\/(USDT|USD)$/i, '')
    .replace(/-(USDT|USD)$/i, '')
    .trim();
  const normTicker = cleanKey === 'NVDAON' ? 'NVDAon' : cleanKey === 'TSLAON' ? 'TSLAon' : cleanKey;
  const asset = SEEDED_ASSETS[normTicker] || SEEDED_ASSETS[cleanKey] || SEEDED_ASSETS[upper] || SEEDED_ASSETS[raw];
  
  const candidate = currentPrice || lastGeneratedPrices[normTicker] || lastGeneratedPrices[cleanKey] || lastGeneratedPrices[raw];

  // Derive target base price from asset configuration, candidate price, or domain heuristics
  let fallbackBase = 100;
  if (upper.includes('BTC')) fallbackBase = 85465;
  else if (upper.includes('ETH')) fallbackBase = 2722;
  else if (upper.includes('SOL')) fallbackBase = 116.9;
  else if (upper.includes('GOLD') || upper.includes('XAU') || upper.includes('PAXG')) fallbackBase = 4169.7;
  else if (upper.includes('SILVER') || upper.includes('XAG')) fallbackBase = 31.85;
  else if (upper.includes('OIL') || upper.includes('WTI')) fallbackBase = 71.30;
  else if (upper.includes('BRENT')) fallbackBase = 75.20;
  else if (upper.includes('COPPER')) fallbackBase = 4.35;
  else if (upper.includes('REIT')) fallbackBase = 88.40;
  else if (upper.includes('UST10Y')) fallbackBase = 104.20;
  else if (upper.includes('TBILL')) fallbackBase = 100.15;
  else if (upper.includes('URANIUM')) fallbackBase = 78.50;
  else if (upper.includes('AGRI')) fallbackBase = 21.40;
  else if (upper.includes('USDY')) fallbackBase = 1.052;
  else if (upper.includes('NVDA')) fallbackBase = 230.2;
  else if (upper.includes('TSLA')) fallbackBase = 359.5;
  else if (upper.includes('PLTR')) fallbackBase = 189.2;
  else if (upper.includes('QQQ')) fallbackBase = 738.0;

  const targetBase = asset ? asset.basePrice : (candidate && candidate > 0 ? candidate : fallbackBase);
  
  // Strict Sanity Check: If currentPrice or cached price is corrupt or drifted > 25%, snap back to targetBase
  let base = targetBase;
  if (candidate && Number.isFinite(candidate) && candidate > 0) {
    const deviation = Math.abs(candidate - targetBase) / targetBase;
    if (deviation <= 0.25 || !asset) {
      base = candidate;
    }
  }

  const vol = asset ? asset.volatility : 0.004;

  // Box-Muller normal distribution approximation
  const u1 = Math.max(0.0001, Math.random());
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

  // Strong mean reversion towards basePrice to avoid runaway drift
  const meanReversion = (targetBase - base) * 0.05;
  const step = base * (vol * z0 + meanReversion);

  let newPrice = Math.max(0.0001, base + step);

  // Apply active scenario shock if configured (e.g. flash crash)
  if (activeShockMultiplier[ticker]) {
    newPrice *= activeShockMultiplier[ticker];
  }

  const decimals = asset ? asset.unitDecimals : 2;
  const rounded = Number(newPrice.toFixed(decimals));
  lastGeneratedPrices[ticker] = rounded;
  return rounded;
}
