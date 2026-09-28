# SurakshaAR

> **Safe Today · Skilled Tomorrow · A Safer Jharkhand**
> AR-Based Industrial Safety Training & Certification Platform

**SIH Problem Statement:** SIH26041 — *AR-Based Vocational Training Simulator for Industrial Safety in Jharkhand's Mining & Manufacturing Sector.*

---

## Problem

Industrial workers in mining, steel, and manufacturing may receive classroom or manual safety training, but practical retention and realistic emergency drills are often difficult to deliver at scale. Language barriers, remote sites, and limited training infrastructure reduce access to hands-on practice.

## Solution

SurakshaAR delivers interactive smartphone-based AR and 3D safety training. Workers complete game-like safety missions inside simulated industrial environments, receive deterministic competency feedback, and earn digitally verifiable credentials — all from their own device, even offline.

---

## Features

- **Mobile-first PWA** — Works on mid-range Android devices
- **Two complete 3D modules** — Fire & Explosion Safety, Gas Leak & Confined Space
- **Interactive 3D missions** — Real actions, not MCQs
- **Camera AR + 3D fallback** — Graceful degradation when camera is unavailable
- **Hazard Hunt** — Timed hazard-recognition drills
- **Deterministic assessment** — Weighted scoring engine (25/25/20/15/10/5)
- **Adaptive refresher** — Identifies weak skills and recommends targeted practice
- **Digital certificates** — Printable, with QR verification
- **QR verification route** — `/verify/<code>` is publicly verifiable
- **Offline-first** — LocalStorage-backed session persistence
- **Hindi + Santali + English** — Centralized i18n
- **Admin compliance dashboard** — KPIs, charts, worker search, alerts
- **20+ demo workers** — Realistic diverse dataset
- **Judge Demo flow** — One-click path through the full product

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Next.js 16 (App Router)                │
├────────────────┬──────────────────┬─────────────────────┤
│  Worker UX     │   Admin UX       │   Public Routes     │
│  /worker/*     │   /admin/*       │   /, /about, /verify│
├────────────────┴──────────────────┴─────────────────────┤
│        Components · i18n · Storage · Assessment         │
├─────────────────────────────────────────────────────────┤
│   Three.js + React Three Fiber + Drei (3D scenes)       │
├─────────────────────────────────────────────────────────┤
│   PostgreSQL + Drizzle ORM    LocalStorage (offline)    │
└─────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| 3D | Three.js, React Three Fiber, Drei |
| Charts | Recharts |
| QR | `qrcode` (OSS) |
| Icons | Lucide React |
| Database | PostgreSQL + Drizzle ORM |
| Offline | LocalStorage + PWA manifest |

## Installation

```bash
npm install
```

## Run (Development)

```bash
npm run dev
```

## Build (Production)

```bash
npx drizzle-kit push      # apply schema to PostgreSQL
npm run build
npm start
```

## Demo Credentials

- **Admin Console**: `admin` / `admin123` at `/login` → *Admin Login*
- **Demo Worker**: Select **Ramesh Kumar** (`JH-W-10245`) from the worker picker

## Judge Demo Flow

1. Open `/`
2. Click **Judge Demo** (or **Start Training**)
3. Choose language → English
4. Pick worker → Ramesh Kumar
5. Worker home → **Continue Training**
6. **Fire & Explosion Safety** → **Start Mission**
7. Interact with 3D scene (alarm → extinguisher → exit → safe zone)
8. Review assessment and adaptive recommendations
9. View certificate with QR
10. Visit `/verify/<code>` to verify the credential
11. Open `/admin` to review compliance

## QR Verification Route

Every issued certificate is verifiable at:

```
/verify/<verification-code>
```

Example: `/verify/SA-7842F1` — returns the public verification page.

## Offline Architecture

- Session state (worker profile, progress, certificates) is persisted in `localStorage`
- Online/offline status is detected via `navigator.onLine` and the `online`/`offline` events
- A live status indicator appears in the bottom-right corner
- When offline, training and assessment continue; sync is simulated locally when back online

## Assessment Algorithm

| Competency | Weight |
|---|---|
| Hazard Recognition | 25% |
| Procedure Accuracy | 25% |
| Decision Making | 20% |
| Equipment Selection | 15% |
| Reaction Time | 10% |
| Mission Completion | 5% |

The final score is computed deterministically from the worker's actual interactions and timing — never randomized.

## Known Limitations

- **Camera AR**: Uses a camera feed overlay with a 3D simulation. It is not spatially tracked AR (no WebXR plane detection).
- **Sync**: Offline sync is simulated locally. No real remote server.
- **Santali translation**: Reviewed demo strings only; architecture supports full localization.
- **PDF download**: Certificate "Download PDF" uses the browser's print-to-PDF feature.
- **Sound**: Sound is optional and muted by default; not required for completion.

## Future Roadmap

- AI-powered personalized learning
- Device-to-device training sync
- Video proctoring for high-stakes certification
- Additional modules (Machinery, PPE, First Aid)
- Advanced WebXR spatial tracking
- BLE / IoT smart extinguisher hardware integration
- Capacitor-based native Android APK build

## Testing Summary

- ✅ App boots and renders
- ✅ Worker onboarding, language switching, session persistence
- ✅ Fire & Gas 3D training missions with interactive objects
- ✅ Deterministic assessment scoring
- ✅ Adaptive refresher recommendations
- ✅ Certificate generation and QR verification
- ✅ Admin dashboard with charts and filters
- ✅ Offline indicator and LocalStorage persistence
- ✅ Responsive design (mobile, tablet, desktop)

---

**Built for Smart India Hackathon 2026 · SIH26041**
