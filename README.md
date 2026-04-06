# Gulf South Golf Lab MVP

Production-ready MVP golf fitting application with deterministic recommendation logic.

## Stack

- Next.js App Router + TypeScript + Tailwind CSS
- Firebase Auth + Firestore
- Rules engine with weighted scoring in `lib/fitting`
- Recharts visualization

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
```

3. Start dev server:

```bash
npm run dev
```

## API

- `POST /api/session/create`
- `POST /api/session/recommend`
- `GET /api/session/:id`

## Deterministic fitting logic

- `lib/fitting/rules.ts`: category-specific deterministic fit rules
- `lib/fitting/scoring.ts`: weighted score model
- `lib/fitting/engine.ts`: orchestrates top-3 recommendations and build specs

Scoring weights:

- Distance: 25%
- Dispersion: 30%
- Launch/Spin Optimization: 25%
- Player Preference: 10%
- Forgiveness: 10%
