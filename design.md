# LUNARIS REASON — Design System & Visual Grammar

## 1. Core Philosophy
- **One Loud Idea**: The rolling 3D wireframe dual-sphere + ambient rotating light-sweep hero. Everything else is disciplined, quiet, and razor-sharp.
- **No AI Slop**: No arbitrary multi-color drop shadows, no pill overload, no gratuitous glow rings behind data tables.
- **Viewport Discipline**: High information density with clear hierarchy. Real-time numbers must be stable (no jitter).

## 2. Color Palette & Tokens
- **Canvas / Background**: `#0A0A0C` to `#0D0D10` (near-black, never pitch-black except for video letterbox scrims).
- **Panel Surface**: `#0E1017` with hairline border `rgba(255, 255, 255, 0.08)` and subtle hover `rgba(255, 255, 255, 0.16)`.
- **Primary Accent**: Electric Cyan / Violet (`#38bdf8` / `#818cf8` / `#a855f7`).
- **Semantic State Tokens** (Strictly functional, never decorative):
  - Risk-On / Profit: Emerald `#10b981`
  - Caution / Re-Huddle / Pending: Amber `#f59e0b`
  - Risk-Off / Veto / Loss: Rose `#f43f5e`
  - Neutral / Inactive: Zinc `#71717a`
- **Text & AA Contrast**:
  - Primary Titles: High-contrast pure white `#ffffff`
  - Secondary Labels: Warm gray `#cbd5e1` to `#94a3b8` (guaranteed >= 4.5:1 contrast against `#0A0A0C`)

## 3. Typography & Figures
- **Sans Font**: Geist / Inter / system-ui for titles, labels, and chrome.
- **Mono Font**: JetBrains Mono for addresses, transaction hashes, and terminal telemetry.
- **Tabular Numerics**: `tabular-nums` applied to every single price, balance, yield, and PnL column to prevent layout jitter during live ticks.

## 4. Radius Scale
- `rounded-xl` (12px): buttons, chips, badges, interactive controls.
- `rounded-2xl` (20px): cards, sub-panels, modals.
- `rounded-3xl` (28px): main application glass containers and hero frames.

## 5. Panel Framing & Corner Crosshairs
- 1px thin rail borders: `border border-white/[0.08]`
- Subtle corner crosshairs / tick marks: `[+]` or subtle reticles at panel vertices.
- Glass panels feature macOS-style traffic light header dots: red (`#ef4444`), amber (`#f59e0b`), green (`#10b981`).

## 6. Motion Budget
- **Fast Speed** (150ms–200ms ease-out): Hover states, active tab transitions, button clicks, modal entrances.
- **Slow Speed** (2s–4s ease-in-out / linear): Ambient background light-sweep, wireframe sphere rotation, subtle companion loop.
- **Motion Gating**: Ambient motion is restricted to hero / idle zones. Zero motion behind the Cross-Asset Matrix or live orderbook tables.
- **Reduced Motion**: Respects `prefers-reduced-motion` across all components.

## 7. Council Personas (Immutable 4 Agents)
- **Quant-Omega**: Bull / Alpha lead
- **NEXUS-RED**: Bear / adversarial skeptic
- **Atlas-Macro**: Macro / RWA-vault bridge
- **Guardian-01**: Risk veto / final gate
