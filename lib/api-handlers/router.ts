// lib/api-handlers/router.ts
// Unified Edge API Router for LUNARIS Terminal
// Consolidates all 16 endpoints into a single unified serverless function for Vercel Hobby plan compliance.

import tradesHandler from './audit/trades.ts';
import allTradesHandler from './audit/all-trades.ts';
import summaryHandler from './audit/summary.ts';
import exportCsvHandler from './audit/export-csv.ts';
import exportJsonHandler from './audit/export-json.ts';
import triggerDaemonHandler from './audit/trigger-daemon.ts';
import d1Handler from './audit/d1.ts';
import bitgetTickersHandler from './bitget/tickers.ts';
import bitgetOrderbookHandler from './bitget/orderbook.ts';
import marketQuoteHandler from './market/quote.ts';
import openservManifestHandler, { getOpenServAgentManifest } from './openserv/manifest.ts';
import openservRunHandler from './openserv/run.ts';
import openservEscrowHandler from './openserv/escrow-stats.ts';
import openservDebateHandler from './openserv/debate.ts';
import mcpToolsHandler from './mcp/tools.ts';
import mcpExecuteHandler from './mcp/execute.ts';
import autopilotStateHandler from './autopilot/state.ts';

export const config = {
  maxDuration: 30,
};

export default async function unifiedRouter(req: any, res: any) {
  // CORS Preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Determine the route path from req.query.slug, req.headers, or req.url
  let rawPath = '';

  if (Array.isArray(req.query?.slug)) {
    rawPath = req.query.slug.join('/');
  } else if (typeof req.query?.slug === 'string') {
    rawPath = req.query.slug;
  } else {
    const rawUrl =
      req.headers?.['x-matched-path'] ||
      req.headers?.['x-forwarded-uri'] ||
      req.headers?.['x-now-route-matches'] ||
      req.url ||
      '';
    const cleanUrl = String(rawUrl).split('?')[0];
    rawPath = cleanUrl.replace(/^\/api\/?/, '');
  }

  // Normalize path (lowercase, strip leading/trailing slashes)
  const normalized = rawPath.replace(/^\/+|\/+$/g, '').toLowerCase();

  switch (normalized) {
    // --- AUDIT & CLOUDFLARE D1 ROUTES ---
    case 'audit/trades':
      return tradesHandler(req, res);

    case 'audit/all-trades':
      return allTradesHandler(req, res);

    case 'audit/summary':
      return summaryHandler(req, res);

    case 'audit/export-csv':
      return exportCsvHandler(req, res);

    case 'audit/export-json':
      return exportJsonHandler(req, res);

    case 'audit/trigger-daemon':
      return triggerDaemonHandler(req, res);

    case 'audit/d1':
      return d1Handler(req, res);

    // --- BITGET & MARKET QUOTES ---
    case 'bitget/tickers':
      return bitgetTickersHandler(req, res);

    case 'bitget/orderbook':
      return bitgetOrderbookHandler(req, res);

    case 'market/quote':
      return marketQuoteHandler(req, res);

    // --- OPENSERV SPEC & AGENT RUNNER ---
    case 'openserv/manifest':
      return openservManifestHandler(req, res);

    case 'openserv/run':
      return openservRunHandler(req, res);

    case 'openserv/debate':
    case 'gemini/debate':
      return openservDebateHandler(req, res);

    case 'openserv/escrow-stats':
    case 'openserv/escrow':
      return openservEscrowHandler(req, res);

    case 'autopilot/state':
      return autopilotStateHandler(req, res);

    // --- MODEL CONTEXT PROTOCOL (MCP) ---
    case 'mcp/tools':
      return mcpToolsHandler(req, res);

    case 'mcp/execute':
      return mcpExecuteHandler(req, res);

    // --- HEALTH & ROOT DISCOVERY ---
    case '':
    case 'index':
    case 'health':
      return res.status(200).json({
        status: 'HEALTHY',
        service: 'LUNARIS Unified Edge Router',
        architecture: 'OpenServ AgentKit + BRAID / Cloudflare D1 SQL Ledger',
        serverlessPlan: 'Vercel Hobby Single-Function Compliant (1 / 12 functions)',
        endpoints: [
          '/api/audit/trades',
          '/api/audit/all-trades',
          '/api/audit/summary',
          '/api/audit/export-csv',
          '/api/audit/export-json',
          '/api/audit/trigger-daemon',
          '/api/audit/d1',
          '/api/bitget/tickers',
          '/api/bitget/orderbook',
          '/api/market/quote',
          '/api/openserv/manifest',
          '/api/openserv/run',
          '/api/openserv/escrow-stats',
          '/api/mcp/tools',
          '/api/mcp/execute',
        ],
        timestamp: new Date().toISOString(),
      });

    default:
      return res.status(404).json({
        error: 'Endpoint not found',
        requestedPath: `/api/${rawPath}`,
        normalizedPath: normalized,
        availablePrefixes: ['/api/audit/*', '/api/bitget/*', '/api/market/*', '/api/openserv/*', '/api/mcp/*'],
      });
  }
}
export { getOpenServAgentManifest };
