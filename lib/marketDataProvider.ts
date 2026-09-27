/**
 * Generic Market Data Provider Interface
 * Decouples market data ingestion (orderbook, 24h tickers, live quotes)
 * from upstream vendor implementations (institutional liquidity feeds).
 */

export interface MarketQuote {
  ticker: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume: string;
  class: 'CX' | 'EQ';
}

export interface OrderbookDepth {
  symbol: string;
  timestamp: number;
  bids: [string, string][];
  asks: [string, string][];
  source?: string;
}

export interface MarketDataProvider {
  name: string;
  getTickers(): Promise<Record<string, MarketQuote>>;
  getQuote(ticker: string): Promise<MarketQuote | null>;
  getOrderbook(symbol: string, limit?: number): Promise<OrderbookDepth | null>;
}

/**
 * Default Institutional Liquidity Feed Implementation
 * Proxies live market feeds via the terminal's gateway endpoints.
 */
class InstitutionalGatewayProvider implements MarketDataProvider {
  public name = 'Institutional Liquidity Feed';

  async getTickers(): Promise<Record<string, MarketQuote>> {
    try {
      const res = await fetch('/api/bitget/tickers');
      if (res.ok) {
        const json = await res.json();
        if (json?.data) return json.data;
      }
    } catch {
      // Handled by local fallback
    }
    return {};
  }

  async getQuote(ticker: string): Promise<MarketQuote | null> {
    try {
      const res = await fetch(`/api/market/quote?ticker=${encodeURIComponent(ticker)}`);
      if (res.ok) {
        const json = await res.json();
        if (json?.quote) return json.quote;
      }
    } catch {
      // Fallback
    }
    return null;
  }

  async getOrderbook(symbol: string, limit = 8): Promise<OrderbookDepth | null> {
    try {
      const res = await fetch(`/api/bitget/orderbook?symbol=${encodeURIComponent(symbol)}&limit=${limit}`);
      if (res.ok) {
        const json = await res.json();
        if (json?.bids && json?.asks) {
          return {
            symbol: json.symbol || symbol,
            timestamp: json.timestamp || Date.now(),
            bids: json.bids,
            asks: json.asks,
            source: 'Institutional Liquidity Gateway',
          };
        }
      }
    } catch {
      // Fallback
    }
    return null;
  }
}

export const defaultMarketDataProvider: MarketDataProvider = new InstitutionalGatewayProvider();
