# ⚡ LUNARIS REASON — OpenServ RWA & Autonomous Trading Node
### Autonomous Real-World Asset (RWA) Vault Allocator & SERV Reasoning Engine
**Built for the OpenServ "SERV Hackathon Edition 01" (September 14–28, 2026)**  
**Author / Lead Architect:** Joezzy (@JoezzyWeb3 / `joezzyweb3@gmail.com`)  
**Live Application URL:** https://ais-pre-vypqgfn3pdyc2zpoyth3md-340735411043.europe-west3.run.app  
**Full Technical Documentation:** See [`TECHNICAL_DOCUMENTATION.md`](./TECHNICAL_DOCUMENTATION.md)

---

## 🌟 EXECUTIVE OVERVIEW & HACKATHON ALIGNMENT

**LUNARIS REASON** is an autonomous cross-asset AI trading node and Real-World Asset (RWA) allocator built on the **OpenServ platform**. It solves the critical disconnect between high-volatility crypto yields and tokenized real-world assets through **bounded directed acyclic graph (DAG) reasoning**, **Model Context Protocol (MCP)** tool execution, and **deterministic risk invariants**.

### Hackathon Track Submission Matrix

| OpenServ Track | How LUNARIS REASON Solves It | Core Artifact / API |
| :--- | :--- | :--- |
| **Track 3: RWA Vaults** *(Primary)* | Autonomous capital rotation between volatile crypto funding and licensed RWA yield vaults (UST10Y 5.15% APY, TBILL3M 5.28% APY, PAXG Physical Gold, REIT 6.40% Yield). Solves on-chain NAV discount/premium dislocations. | `/matrix` (RWA Yield & NAV Matrix) |
| **Track 1: Mainnet & MCP** | Exposes institutional trading and risk-check tools via standard OpenServ Model Context Protocol (MCP) endpoints for external AI agents. | `GET /api/mcp/tools`<br>`POST /api/mcp/execute` |
| **Track 2: AgentKit & Escrow** | Autonomous revenue generation: every profitable rebalance and trade automatically routes a 10% performance micro-toll to the OpenServ Protocol Escrow. | `GET /api/openserv/escrow`<br>`/auditlog` (Escrow Badge) |
| **Track 4: SERV Reasoning** | Eliminates unbounded LLM hallucinations by forcing all decisions through a 4-node DAG. Every trade mints an immutable cryptographic Proof Certificate with SHA-256 fingerprint. | `/certificates` (Proof Certificates Gallery) |

---

## 🔬 CRITICAL RWA PROBLEMS SOLVED WITH AI & SERV REASONING

1. **Primary Oracle NAV vs Secondary Token Market Dislocation**:
   - Tokenized RWAs frequently deviate from their underlying Net Asset Value (NAV) on secondary DEX/CEX venues due to liquidity fragmentation.
   - **AI Solution**: Continuous multi-asset NAV surveillance detects basis spreads ($\Delta \text{Bps}$). When an RWA trades at a discount ($\le -8 \text{ bps}$), the agent executes delta-neutral mean-reversion rebalancing.

2. **Dynamic Crypto Staking vs. RWA Fixed Income Yield Rotation**:
   - Crypto funding rates fluctuate unpredictably. Holding idle capital in low-yield crypto destroys risk-adjusted returns (Sharpe ratio drops).
   - **AI Solution**: Atlas-Macro continuously evaluates the yield differential between crypto staking/funding APY and the risk-free RWA rate (UST10Y at 5.15% APY), autonomously rotating capital into tokenized US Treasuries when crypto yields lag.

3. **Liquidity Depth & Slippage Collapse on Thin RWA Books**:
   - Institutional orders into tokenized RWAs can suffer devastating slippage if executed carelessly.
   - **AI Solution**: **Guardian-01 Deterministic Slippage Gate** enforces a non-probabilistic, mathematical $\le 0.50\%$ slippage collar. Orders exceeding 0.5% are hard-vetoed before hitting the orderbook.

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
```

- **Node 1: Quant-Omega (Technical Lead)**: Analyzes orderbook depth, relative strength, and momentum signals.
- **Node 2: NEXUS-RED (Adversarial Red Team)**: Hunts for liquidity traps, crowded funding rates, and oracle lag.
- **Node 3: Atlas-Macro (RWA Yield Lead)**: Checks treasury yield curves, CPI catalysts, and asset allocation spreads.
- **Node 4: Guardian-01 (Deterministic Risk Gavel)**: Pure mathematical code gate (non-LLM) enforcing 5x max leverage, 25% single-asset cap, and 0.50% max slippage collar.

---

## 🔌 OPENSERV MODEL CONTEXT PROTOCOL (MCP) API REFERENCE

LUNARIS REASON serves as an autonomous tool provider on the OpenServ network.

### 1. List Registered Tools
```http
GET /api/mcp/tools
```
Returns standardized schemas for:
- `get_rwa_vault_yields`: Live APYs, benchmark NAVs, and basis spreads.
- `check_risk_collar`: Evaluates proposed execution against Guardian-01's 0.50% collar.
- `evaluate_rwa_yield_spread`: Calculates yield delta between crypto staking and UST10Y Treasuries.
- `verify_proof_certificate`: Cryptographically verifies SHA-256 reason fingerprints.
- `execute_rwa_rebalance`: Routes capital to licensed RWA yield vaults with 10% escrow fee.

### 2. Execute MCP Tool
```http
POST /api/mcp/execute
Content-Type: application/json

{
  "tool": "check_risk_collar",
  "arguments": {
    "instrument": "UST10Y/USD",
    "direction": "LONG",
    "entryPrice": 106.20,
    "exitPrice": 106.45
  }
}
```
Response:
```json
{
  "success": true,
  "tool": "check_risk_collar",
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
    "timestamp": "2026-09-27T22:15:00.000Z",
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
3. **Fresh Slate & Zero-Drift 60-Second Cadence**:
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
- **Architect:** Joezzy (Joezzy Web3)
- **Email:** `girlweb367@gmail.com` / `joezzyweb3@gmail.com`
- **Hackathon:** OpenServ SERV Hackathon Edition 01 (September 2026)
- **Partnerships:** IXS Finance (Licensed RWA Vaults), Coinbase AgentKit (Revenue Escrow)
