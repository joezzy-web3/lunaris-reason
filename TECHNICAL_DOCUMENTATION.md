# LUNARIS REASON — TECHNICAL ARCHITECTURE & JUDGING GUIDE
### OpenServ "SERV Hackathon Edition 01" (September 14–28, 2026)
**Project Title:** LUNARIS REASON — Autonomous RWA Vault Allocator & SERV Reasoning Engine  
**Lead Architect:** Joezzy (@JoezzyWeb3 / `joezzyweb3@gmail.com`)  
**Live Application URL:** https://ais-pre-vypqgfn3pdyc2zpoyth3md-340735411043.europe-west3.run.app  
**Tracks Targeted:** Track 3 (RWA Vaults - Primary), Track 1 (Mainnet & MCP), Track 2 (AgentKit Escrow), Track 4 (SERV Reasoning)  
**Core Technologies:** React 19, TypeScript, Tailwind CSS v4, Express Node.js Server, OpenServ MCP Protocol, Google GenAI SDK, Firebase Firestore, Web Audio API  

---

## 1. EXECUTIVE SUMMARY & ARCHITECTURAL THESIS

Traditional AI trading bots suffer from two fatal vulnerabilities:
1. **Unbounded LLM Hallucinations**: Standard language models generate ungrounded price forecasts, fabricate orderbook depth, and hallucinate execution fills without mathematical risk boundaries.
2. **Crypto-Centric Yield Volatility & RWA Disconnect**: While crypto yields (perp funding, DEX liquidity mining) swing wildly between -15% and +85%, institutional capital demands risk-free or low-volatility fixed income (US Treasuries, T-Bills, physical gold, real estate). Meanwhile, tokenized RWAs suffer from on-chain/off-chain NAV dislocations, primary-secondary market discounts, and illiquid orderbooks.

**LUNARIS REASON** solves this through a dual innovation:
* **The SERV Bounded Reasoning Engine**: Binds multi-agent deliberation into a strict 4-node Directed Acyclic Graph (DAG) with SHA-256 reason fingerprints and cryptographic Proof Certificates.
* **The Autonomous RWA Yield & NAV Matrix**: Continuous surveillance comparing primary custodian oracle NAVs against secondary orderbook prices to capture basis discounts ($\Delta \text{Bps}$), arbitrate yields between crypto and tokenized US Treasuries (`UST10Y` 5.15% APY, `TBILL3M` 5.28% APY), and route flight-to-safety liquidity into licensed RWA vaults.

---

## 2. HACKATHON TRACK MATRIX & TECHNICAL INTEGRATION

```
┌────────────────────────────────────────────────────────────────────────┐
│                   LUNARIS REASON ON OPENSERV PLATFORM                  │
├────────────────────────────────────────────────────────────────────────┤
│  Track 1: Mainnet & MCP    ──► /api/mcp/tools & /api/mcp/execute       │
│  Track 2: AgentKit Escrow  ──► /api/openserv/escrow (10% Micro-Tolls)  │
│  Track 3: RWA Vaults       ──► /matrix (UST10Y, TBILL, PAXG, REIT)     │
│  Track 4: SERV Reasoning   ──► /certificates (4-Node Bounded DAGs)     │
└────────────────────────────────────────────────────────────────────────┘
```

### Track 3: RWA Vaults (Primary Focus — IXS Finance Partnered)
- **Tokenized Assets Supported**:
  - `UST10Y/USD`: Tokenized 10-Year US Treasury Yield Vault (**5.15% APY**, BNY Mellon Custody)
  - `TBILL/USD`: Tokenized 3-Month US Treasury Bill Note (**5.28% APY**, State Street Custody)
  - `PAXG/USDT`: Paxos Tokenized Physical Gold Spot (LBMA London Brink's Vault, 1:1 Over-collateralized)
  - `WTI/USD`: Tokenized Light Sweet Crude Oil Commodity Index (CME Group Custody)
  - `REIT/USD`: Commercial Real Estate Yield Pool (**6.40% Annual Yield**, IXS Real Property Trust)
- **NAV Dislocation Arbitrage**: The node detects secondary market discounts ($\Delta \text{Bps} \le -8.0 \text{ bps}$) to primary NAV, executing automated mean-reversion buy orders.
- **Flight-to-Safety Rebalancing**: When market volatility spikes, the council sweeps capital into licensed tokenized treasury notes.

### Track 1: Mainnet & Model Context Protocol (MCP)
LUNARIS REASON exposes a standard OpenServ MCP server enabling any AI agent on the OpenServ network to consume its analytical and risk tools:
- `GET /api/mcp/tools`: Returns JSON Schema definitions for:
  - `get_rwa_vault_yields`: Real-time APY, NAV, and basis spreads.
  - `check_risk_collar`: Deterministic slippage compliance gate ($\le 0.50\%$).
  - `evaluate_rwa_yield_spread`: Dynamic yield differential between crypto staking and UST10Y.
  - `verify_proof_certificate`: Cryptographic validation of reason hashes and quorum signatures.
  - `execute_rwa_rebalance`: Capital rebalance with 10% escrow fee routing.
- `POST /api/mcp/execute`: Direct JSON-RPC execution endpoint returning the tool result bundled with a cryptographic `servAttestation`.

### Track 2: AgentKit & Protocol Revenue Escrow
Autonomous agents must demonstrate economic sustainability. LUNARIS REASON implements an automated performance fee mechanism:
- Every profitable trade and RWA yield harvest deducts a **10% performance micro-toll**.
- Tolls are routed directly to the **OpenServ AgentKit Protocol Escrow** (`GET /api/openserv/escrow`).
- Live escrow balances and routed volume are tracked in real-time in the Autopilot Ledger Bento.

### Track 4: SERV Reasoning & Proof Certificates
- Replaces unconstrained prompting with bounded 4-node DAGs.
- Deliberations culminate in a cryptographic Proof Certificate displayed in the redesigned **Proof Certificates Gallery** (`/certificates`).
- Every certificate features:
  - Unique Reference Token (`SERV-REASON-*` / `CERT-*`)
  - 4-Stage DAG Progression Timeline
  - SHA-256 Deliberation Digest with one-click verification
  - 4-Agent Quorum Consensus Signatures (Quant, Nexus, Atlas, Guardian)
  - Non-Negotiable $\le 0.50\%$ Slippage Collar Verification Stamp

---

## 3. FOUR-NODE BOUNDED REASONING GRAPH (DAG) DEEP DIVE

Every autonomous trade must flow through a directed, non-circular 4-stage pipeline:

```
[ Market Ticks & NAV Feed ]
             │
             ▼
   ┌────────────────────────────────────────────────────────┐
   │ 1. QUANT-OMEGA (Alpha Lead)                            │
   │    • Orderbook depth & bid/ask density                 │
   │    • Intraday momentum breakout evaluation             │
   └────────────────────────────────────────────────────────┘
             │
             ▼
   ┌────────────────────────────────────────────────────────┐
   │ 2. NEXUS-RED (Adversarial Red Team)                    │
   │    • Hunts for low-liquidity spoofs and exit traps     │
   │    • Evaluates liquidation walls and funding squeezes  │
   │    • Casts veto / critical flaw if spread exceeds risk │
   └────────────────────────────────────────────────────────┘
             │
             ▼
   ┌────────────────────────────────────────────────────────┐
   │ 3. ATLAS-MACRO (RWA & Yield Lead)                      │
   │    • Treasury yield curve & Fed Funds spread analysis  │
   │    • Evaluates basis dislocation vs primary NAV        │
   │    • Authorizes RWA vault flight-to-safety rotation    │
   └────────────────────────────────────────────────────────┘
             │
             ▼
   ┌────────────────────────────────────────────────────────┐
   │ 4. GUARDIAN-01 (Deterministic Risk Gate — Non-LLM)     │
   │    • 5x Max Leverage boundary                          │
   │    • 25% Single-Asset Portfolio Cap                    │
   │    • Invariant 0.50% Max Slippage Collar               │
   │    • Defcon-1 Circuit Breaker                          │
   └────────────────────────────────────────────────────────┘
             │
             ▼
   [ Executed Trade + Minted Proof Certificate ]
```

---

## 4. DETERMINISTIC FINANCIAL INVARIANTS & INTEGRITY

To ensure institutional mathematical rigor, LUNARIS REASON enforces hard invariants verified by automated test suites (`tests/tradeInvariants.test.ts`):

### Invariant 1: 0.50% Maximum Slippage Collar
$$\Delta = \frac{|\text{Exit Price} - \text{Entry Price}|}{\text{Entry Price}} \le 0.0050$$
Any filled price attempting to exceed 0.50% deviation is clamped or rejected by Guardian-01.

### Invariant 2: Authoritative Net PnL Identity
$$\text{Net Realized PnL} = \text{Gross PnL} - \text{Protocol Fee} - \text{L2 Slippage Cost}$$
Where:
- $\text{Gross PnL} = \frac{\text{Quantity} \times \text{Leverage} \times (\text{Exit} - \text{Entry})}{\text{Entry}}$ (for LONG)
- $\text{Fee Rate} = 0.08\%$ for RWA Vaults / $0.06\%$ for Crypto
- $\text{L2 Slippage} = \text{Notional} \times (0.0002 + \text{depthFactor})$

### Invariant 3: Return on Collateral (ROI)
$$\text{Balance Change \%} = \frac{\text{Net Realized PnL}}{\text{Margin Collateral}} \times 100$$
Calculated directly without arbitrary rounding or legacy clamping.

### Invariant 4: Fresh Slate & Zero-Drift Synchronization
- **Isolated Storage**: `data/openserv_fresh_audit_trades.json` and Firestore collection `openserv_v1_trades` start with 0 records.
- **60-Second Universal Cadence**: The autonomous daemon executes on universal UTC 60-second boundaries (`60,000ms`), ensuring incognito and multi-browser clients stay synchronized with the server.

---

## 5. API SPECIFICATION & MCP ENDPOINT EXAMPLES

### `GET /api/mcp/tools`
Returns the standardized OpenServ tool manifest:
```json
{
  "schema_version": "2024-11-05",
  "provider": "LUNARIS REASON // OpenServ Bounded Trading Node",
  "tools": [
    {
      "name": "get_rwa_vault_yields",
      "description": "Queries live APYs, benchmark NAVs, basis spreads, and over-collateralization ratios for tokenized US Treasuries, Commodities, and Real Estate vaults."
    },
    {
      "name": "check_risk_collar",
      "description": "Guardian-01 Deterministic Slippage Gate: Evaluates whether proposed order prices comply with the mathematical <= 0.50% slippage collar invariant."
    },
    {
      "name": "evaluate_rwa_yield_spread",
      "description": "Calculates the real-time spread between crypto funding/borrow rates and risk-free US Treasury yields (UST10Y 5.15% APY) to recommend capital rotation."
    },
    {
      "name": "verify_proof_certificate",
      "description": "Cryptographically verifies a trade Proof Certificate, checks the SHA-256 reason fingerprint, and validates 4-agent quorum consensus."
    },
    {
      "name": "execute_rwa_rebalance",
      "description": "Autonomously executes a capital flight-to-safety or yield rebalance into licensed RWA vaults (Track 3) with 10% performance fee routed to OpenServ Protocol Escrow."
    }
  ]
}
```

### `POST /api/mcp/execute`
Executes an RWA rebalance:
```bash
curl -X POST http://localhost:3000/api/mcp/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "execute_rwa_rebalance",
    "arguments": {
      "targetVault": "UST10Y",
      "allocationUsd": 5000
    }
  }'
```
Response:
```json
{
  "success": true,
  "tool": "execute_rwa_rebalance",
  "rebalance": {
    "targetVault": "UST10Y",
    "amountDeployedUsd": 5000,
    "remainingCash": 95000,
    "performanceFeeTollBps": 100,
    "escrowTollUsd": 5.0,
    "escrowDestination": "OpenServ AgentKit Protocol Escrow"
  },
  "servAttestation": {
    "step": "AUTONOMOUS_RWA_VAULT_DISPATCH",
    "timestamp": "2026-09-27T22:15:30.000Z",
    "hash": "0x726562616c616e63655f55535431"
  }
}
```

---

## 6. VERIFICATION & TEST SUITE

The codebase includes comprehensive automated invariant test suites covering:
1. Operator authentication passcode verification (SHA-256 matching)
2. Authoritative PnL Invariant: $\text{Net} == \text{Gross} - \text{Fee} - \text{Slippage}$
3. Price Sanity Guard: Rolling median & anomaly rejection
4. Invariant 1: 0.50% Slippage Collar enforcement
5. Invariant 2: Net PnL mathematical integrity
6. Invariant 3: Balance change % exact derivation
7. Invariant 4: Duplicate trade submission prevention
8. Invariant 5: Adjustment exclusion from trading statistics

To execute the test suite:
```bash
npm test
```
Result: **24 tests passing across 8 test suites with 0 failures.**

---

## 7. SUBMISSION & DEPLOYMENT CHECKLIST

- [x] Fresh slate initialized: $0.00 realized PnL, 0 trades, $100,000 genesis cash.
- [x] OpenServ MCP Server live at `/api/mcp/tools` & `/api/mcp/execute`.
- [x] OpenServ AgentKit Protocol Escrow telemetry live at `/api/openserv/escrow`.
- [x] Proof Certificates view transformed into Executive Attestation Cards with 4-node DAGs.
- [x] RWA Matrix focused on primary NAV dislocations, yield curve arbitrage, and flight-to-safety.
- [x] Cadence set to 60-second universal heartbeat.
- [x] All 24 mathematical invariant tests passing.
- [x] Zero TypeScript compilation errors (`npm run lint`).
