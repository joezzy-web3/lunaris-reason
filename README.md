# ⚡ LUNARIS REASON — OpenServ Autonomous RWA Terminal
### Institutional Real-World Asset (RWA) Allocator & Multi-Agent Bounded Reasoning Engine
**Built for the OpenServ "SERV Hackathon Edition 01" (September 14–28, 2026)**  
**Author / Lead Architect:** Joezzy (@JoezzyWeb3 / `joezzyweb3@gmail.com`)  
**Live Production Deployment:** [https://lunaris-reason.vercel.app/](https://lunaris-reason.vercel.app/)  
**Full Technical Documentation:** See [`TECHNICAL_DOCUMENTATION.md`](./TECHNICAL_DOCUMENTATION.md)

---

## ⚡ JUDGE QUICK-START (EVALUATE IN UNDER 90 SECONDS)

1. **Launch the Live Cockpit:** Open the [Production Deployment URL](https://lunaris-reason.vercel.app/) in any browser.
2. **Mandatory Hackathon Telemetry Verification ("Collection is on"):** 
   * In your [OpenServ Organization Settings](https://console.openserv.ai/settings/organization), select **"Collection is on"**.
   * In the top navigation bar of LUNARIS, click **"OpenServ MCP"** → switch to **"2. Official SERV API Runner (Hackathon Verification)"** (or run `npm run serv:run`).
   * Trigger the full agent reasoning cycle. The inference call is dispatched directly to OpenServ's native reasoning engine (`https://inference-api.openserv.ai/v1`, model: `serv-mini`), returning a multi-agent consensus trade verdict and registering the verified run in your OpenServ organization telemetry.
3. **Inspect OpenServ Agent Manifest:** Click the green **"SERV Manifest"** pill in the top header (or navigate directly to `/.well-known/openserv-agent.json`) to view the standardized OpenServ agent registry discovery schema, supported tracks, and economic escrow terms.
4. **Execute Live OpenServ MCP Tool RPC:** Click the **"OpenServ MCP"** pill button in the top navigation bar. Select any of the 6 registered MCP tools (e.g. `evaluate_rwa_yield_spread` or `enforce_slippage_collar`), and click **"Execute Tool RPC"** to see live sub-100ms JSON-RPC responses with cryptographic `servAttestation` proofs.
5. **Inspect Reason Attestations in "Proof Certificates":** Navigate to the **Proof Certificates** tab in the main navigation. Browse through live and historical Proof-of-Reasoning certificates generated across both the 24/7 audit ledger and Autopilot sessions. Click **"Inspect Sheet"** on any trade to verify its SHA-256 reason fingerprint, 4-node DAG quorum, and exact fee/slippage math.
6. **Audit Ledger & Immutable Invariant Check:** Navigate to the **Audit Ledger** tab. Click the **"RWA Vaults"** filter pill to isolate tokenized sovereign debt (`UST10Y`, `TBILL3M`), tokenized physical gold (`PAXG`), and commercial real estate (`REIT`). Click the **"DAILY AUTO-AUDIT: ACTIVE"** badge in the header to run an instant on-demand invariant audit across all settled trades (vets SHA-256 hashes, zero edits, and isolates rather than deletes any anomalous trades to quarantine).
7. **Run Mathematical Invariant Tests:** Clone this repo and run `npm test` — 24/24 unit tests strictly verify that Net Realized PnL strictly equals Gross PnL minus fees and slippage, and that the 0.50% slippage collar is clamped mathematically.

---

## 🛰️ OPENSERV SERV REASONING API & TELEMETRY PROTOCOL

LUNARIS REASON is powered directly by the official OpenServ inference engine:

* **Endpoint:** `https://inference-api.openserv.ai/v1/chat/completions`
* **Default Model:** `serv-mini` (OpenServ Native Reasoning Engine)
* **OpenAI & Claude Compatible:** Conforms to standard JSON completions with mandatory system prompt framing.
* **Bounded Reasoning DAG:** Ingests live market oracles, calculates Kelly-criterion position sizing, enforces Guardian-01's 0.50% slippage collar, and outputs structured execution/veto decisions.
* **CLI Runner Script:**
  ```bash
  # Execute one full verified reasoning run
  npx tsx scripts/runServAgent.ts <YOUR_OPENSERV_API_KEY>
  # Or via package script
  OPENSERV_API_KEY=serv_... npm run serv:run
  ```
* **Production Environment Variable:** Set `OPENSERV_API_KEY` in Vercel to route all serverless autonomous trading loops through OpenServ's inference network with zero secret leakage.

---

## 🌟 EXECUTIVE OVERVIEW & HACKATHON ALIGNMENT

**LUNARIS REASON** is an autonomous cross-asset AI trading node and Real-World Asset (RWA) allocator built on the **OpenServ platform** and aligned with the **IXS Finance** RWA DEX partner track. 

Most AI trading bots fail because they grant probabilistic Large Language Models direct, unchecked API execution rights. When an LLM hallucinates or encounters an illiquid orderbook, it causes catastrophic capital destruction.

**LUNARIS fundamentally solves this by enforcing a strict architectural separation between Reasoning and Execution:**
- **Reasoning Layer (OpenServ BRAID):** A 4-agent adversarial Directed Acyclic Graph (DAG) deliberates macro catalyst velocity, orderbook bid/ask density, and RWA yield spreads.
- **Execution Firewall (Guardian-01):** A pure, deterministic TypeScript mathematical gate (non-LLM) that enforces non-negotiable risk bounds: hard 0.50% slippage collars, 5x max leverage, 25% single-asset caps, and automated reserve solvency audits.
- **OpenServ Model Context Protocol (MCP):** Exposes LUNARIS as an open, callable tool provider on the OpenServ network via standard JSON-RPC 2.0 endpoints.
- **Protocol Escrow:** Autonomously monetizes performance by routing a 10% micro-toll on all realized profits directly to the OpenServ Protocol Escrow.

---

### Hackathon Track Submission Matrix

| OpenServ Track | How LUNARIS REASON Solves It | Core Artifact / API |
| :--- | :--- | :--- |
| **Track 3: RWA Vaults** *(Primary Focus)* | Autonomous capital deployment and rotation across licensed RWA yield vaults (`UST10Y` 5.15% APY, `TBILL3M` 5.28% APY, `PAXG` Physical Gold, `REIT` 6.40% Yield). Solves primary NAV vs secondary market basis dislocations. | `/matrix` (RWA Yield & NAV Matrix)<br>`/api/rwa/vaults` |
| **Track 1: Mainnet & MCP** | Exposes institutional trading and risk-check tools via OpenServ Model Context Protocol (MCP) endpoints for external AI agents. | `GET /api/mcp/tools`<br>`POST /api/mcp/execute` |
| **Track 2: AgentKit & Escrow** | Autonomous revenue generation: every profitable rebalance and trade automatically routes a 10% performance micro-toll to the OpenServ Protocol Escrow. | `GET /api/openserv/escrow`<br>`/auditlog` (Escrow Badge) |
| **Track 4: SERV Reasoning** | Eliminates unbounded LLM hallucinations by forcing all decisions through a 4-node DAG. Every trade mints an immutable cryptographic Proof Certificate with SHA-256 fingerprint. | `/certificates` (Proof Certificates Gallery) |

---

## 🔬 CRITICAL RWA PROBLEMS SOLVED WITH AI & SERV REASONING

1. **Primary Oracle NAV vs. Secondary Token Market Dislocation (IXS Finance Alignment)**:
   - Tokenized RWAs frequently deviate from their underlying Net Asset Value (NAV) on secondary DEX/CEX venues due to fragmented liquidity.
   - **AI Solution:** Continuous multi-asset NAV surveillance detects basis spreads ($\Delta \text{Bps}$). When an RWA trades at a secondary discount ($\le -8 \text{ bps}$), the agent executes delta-neutral mean-reversion rebalancing.
2. **Dynamic Crypto Staking vs. RWA Fixed Income Yield Rotation**:
   - Crypto funding rates fluctuate unpredictably. Holding idle capital in low-yield crypto destroys risk-adjusted returns (Sharpe ratio drops).
   - **AI Solution:** Atlas-Macro continuously evaluates the yield differential between crypto staking/funding APY and the risk-free RWA rate (`UST10Y` at 5.15% APY), autonomously rotating capital into tokenized US Treasuries when crypto yields lag.
3. **Liquidity Depth & Slippage Collapse on Thin RWA Books**:
   - Institutional orders into tokenized RWAs can suffer devastating slippage if executed carelessly.
   - **AI Solution:** **Guardian-01 Deterministic Slippage Gate** enforces a non-probabilistic, mathematical $\le 0.50\%$ slippage collar. Orders exceeding 0.5% are hard-vetoed before hitting the orderbook.
4. **Reserve Solvency Forensics**:
   - Live monitoring of custodian reserve backing (e.g. 101.8% over-collateralized), custodian vault audits (BNY Mellon, State Street, Brink's London LBMA), and health indices.

---

## 🏛️ FOUR-NODE BOUNDED REASONING GRAPH (DAG)

Unlike probabilistic chatbot prompts, every autonomous decision in LUNARIS REASON must traverse an invariant 4-stage Directed Acyclic Graph:

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  NODE 1: QUANT  │ ────► │  NODE 2: NEXUS  │ ────► │  NODE 3: ATLAS  │ ────► │ NODE 4: GAVEL   │
│  L2 & NAV Data  │       │  Adversarial    │       │  Macro & RWA    │       │ Deterministic   │
│  Ingestion      │       │  Chaos Trap     │       │  Yield Spread   │       │ Slippage Gate   │
└─────────────────┘       └─────────────────┘       └─────────────────┘       └─────────────────┘
                                                                                       │
                                                                                       ▼
                                                                            [ PROOF CERTIFICATE ]
                                                                            • SHA-256 Digest
                                                                            • 4/4 Quorum Signatures
                                                                            • ≤ 0.50% Collar Met
                                                                            • 10% Escrow Fee Routed
```

- **Node 1: Quant-Omega (Technical Lead):** Analyzes L2 orderbook bid/ask depth, relative strength, and momentum signals.
- **Node 2: NEXUS-RED (Adversarial Red Team):** Hunts for liquidity traps, crowded funding rates, and oracle lag.
- **Node 3: Atlas-Macro (RWA Yield Lead):** Evaluates Treasury yield curves, CPI catalysts, and secondary NAV basis spreads.
- **Node 4: Guardian-01 (Deterministic Risk Gavel):** Pure mathematical code gate (non-LLM) enforcing 5x max leverage, 25% single-asset cap, and 0.50% max slippage collar.

---

## 🛡️ DAILY AUTOMATED SELF-AUDIT & IMMUTABLE LEDGER ARCHITECTURE

LUNARIS REASON operates on an institutional, banking-grade **Append-Only Immutable Ledger** paired with an active **24-Hour Automated Self-Audit Daemon** running continuously in background:

### 1. Strict Immutability & Zero-Edit Policy
- **No Retroactive Edits:** Once an autonomous or manual trade settles into the canonical audit ledger (`/data/audit_trades.json` and Cloud Firestore `audit_trades`), it is **strictly immutable**. The system code contains zero `UPDATE` or `DELETE` endpoints for settled canonical records.
- **Append-Only History:** New settlements receive a monotonically increasing, unbroken sequence index (`#Seq 1, #Seq 2, ... #Seq N`), creating a continuous audit trail that cannot be reordered or spliced.

### 2. Tamper-Evident SHA-256 Cryptographic Hashing Mechanism
Every single trade record is cryptographically sealed with a deterministic SHA-256 fingerprint (`proofHash`):
$$\text{proofHash} = \text{SHA-256}\Big(\text{id} \parallel \text{timestamp} \parallel \text{instrument} \parallel \text{entryPrice} \parallel \text{exitPrice} \parallel \text{netPnl} \parallel \text{reasonDigest}\Big)$$
- **Mathematical Verifiability:** Anyone can re-hash the trade fields to verify that the stored `proofHash` matches the cryptographic digest.
- **Tamper Detection:** If any historical field (e.g. entry price, fee, or slippage) is altered by even a single digit, the SHA-256 hash immediately fails verification during the audit run.

### 3. Zero-Deletion Quarantine & Forensic Isolation
Most trading applications silently delete or sweep anomalous trades under the rug. **LUNARIS enforces a strict Non-Destructive Quarantine Policy:**
- **Trades Are NEVER Deleted:** If a trade violates mathematical invariants (e.g. fee calculation mismatch), or if an anomalous tick is rejected at the ingestion boundary, **it is never deleted, scrubbed, or purged**.
- **Segregation into Forensic Quarantine:** The daily audit daemon isolates anomalous trades into a dedicated archive (`/data/quarantine/` and Firestore `audit_trades_quarantine`).
- **Complete Judge & Auditor Forensic Transparency:** Quarantined records remain permanently exportable and verifiable via:
  - `GET /api/audit/quarantine-archive` (Full forensic JSON or CSV export with root-cause reason breakdown)
  - `GET /api/audit/reconciliation-status` (Real-time checkpoint statistics, backup logs, and database status)

### 4. 5 Core Mathematical Invariants Enforced Daily
Every 24 hours (and immediately on-demand via `POST /api/audit/run-self-audit`), the self-audit engine vets 100% of trades against:
1. **Net Realized PnL Invariant:** $\text{Net PnL} \equiv \text{Gross PnL} - \text{Protocol Fee} - \text{L2 Slippage}$ down to the exact cent ($< \$0.05$ threshold).
2. **0.50% Slippage Collar Invariant:** Max exit price deviation clamped to $\le 0.50\%$.
3. **ROI Mathematical Integrity:** $\text{balanceChangePct} \equiv (\text{Net PnL} / \text{Margin Collateral}) \times 100$.
4. **Monotonic Sequence Continuity:** Canonical `#Seq` IDs must be continuous with zero gaps or duplicate keys.
5. **Cryptographic Attestation Verification:** Validates that 4/4 agent signatures in the Bounded Reasoning DAG produced matching SHA-256 hashes.

> **Try It Live:** In the **Audit Ledger** or **Proof Certificates** views, click the **"DAILY AUTO-AUDIT: ACTIVE"** badge to trigger an instant on-demand invariant audit across all settled trades.

---

## 🔌 OPENSERV MODEL CONTEXT PROTOCOL (MCP) API REFERENCE

LUNARIS REASON serves as an autonomous tool provider on the OpenServ network.

### 1. List Registered Tools
```http
GET /api/mcp/tools
```
Returns standardized JSON schemas for:
- `get_rwa_vault_yields`: Live APYs, benchmark NAVs, and basis spreads.
- `enforce_slippage_collar`: Evaluates proposed execution against Guardian-01's 0.50% collar.
- `evaluate_rwa_yield_spread`: Calculates yield delta between crypto staking and UST10Y Treasuries.
- `verify_serv_reasoning_proof`: Cryptographically verifies SHA-256 reason fingerprints.
- `execute_rwa_rebalance`: Routes capital to licensed RWA yield vaults with 10% escrow fee.
- `get_live_market_quotes`: Ingests real-time prices for Crypto, US Equities, and RWA Vaults.

### 2. Execute MCP Tool
```http
POST /api/mcp/execute
Content-Type: application/json

{
  "tool": "enforce_slippage_collar",
  "arguments": {
    "instrument": "UST10Y/USD",
    "direction": "LONG",
    "expectedPrice": 106.20,
    "proposedExecutionPrice": 106.45
  }
}
```
Response:
```json
{
  "success": true,
  "tool": "enforce_slippage_collar",
  "evaluation": {
    "instrument": "UST10Y/USD",
    "direction": "LONG",
    "slippagePct": 0.235,
    "maxCollarAllowedPct": 0.50,
    "collarPassed": true,
    "verdict": "APPROVED"
  },
  "servAttestation": {
    "step": "GUARDIAN_COLLAR_INSPECTION",
    "timestamp": "2026-09-27T23:15:00.000Z",
    "signature": "serv_collar_gate_pass_1790547300000"
  }
}
```

### 3. OpenServ AgentKit Protocol Escrow Telemetry
```http
GET /api/openserv/escrow
```
Tracks cumulative performance micro-tolls (10% of realized profits) generated autonomously by the node.

---

## 💎 HARD MATHEMATICAL INVARIANTS

1. **Net Realized PnL Identity**:
   $$\text{Net Realized PnL} = \text{Gross PnL} - \text{Protocol Fee} - \text{L2 Slippage}$$
   Every trade audit entry strictly verifies this arithmetic equality down to the exact cent.
2. **0.50% Max Slippage Collar**:
   $$\text{Deviation} = \frac{|\text{Exit Price} - \text{Entry Price}|}{\text{Entry Price}} \le 0.0050$$
   Any order attempting to fill outside this collar is clamped or rejected.
3. **Universal UTC 60-Second Cadence**:
   The autonomous daemon ticks on universal UTC 60-second boundaries (`60,000ms`), ensuring zero drift between client views and server-authoritative persistence.

---

## 🚀 LOCAL SETUP & TESTING

```bash
# 1. Install dependencies
npm install

# 2. Run invariant test suites (24 tests covering PnL math, collars, and auth)
npm test

# 3. Validate TypeScript compilation & linting
npm run lint

# 4. Start the node (Vite + Express on Port 3000)
npm run dev
```

---

## 👥 CREATOR & CREDITS
- **Lead Architect:** Joezzy (Joezzy Web3)
- **Email:** `joezzyweb3@gmail.com`
- **Hackathon:** OpenServ SERV Hackathon Edition 01 (September 2026)
- **Partnership Focus:** IXS Finance (Licensed RWA Vaults & Secondary Liquidity), OpenServ AgentKit (Revenue Escrow)
