# Scoring Engine Refactor — Change Log

This document summarises every logic decision made during the refactor so the
changes can be reviewed without diffing every file.

---

## New files

| File | Purpose |
|------|---------|
| `lib/fitting/scoringConstants.ts` | Single source of truth for all tunable numbers — bonuses, penalties, thresholds, weights, goal targets. No magic numbers remain in rule functions. |
| `lib/fitting/coherence.ts` | `validateBuildCoherence()` — post-selection pass that detects bad equipment combinations and swaps in the #2 pick for the offending category (max one swap per category). |
| `lib/fitting/__tests__/coherence.test.ts` | Unit tests for the coherence validator. |

---

## Modified files

### `lib/fitting/rules.ts` — complete rewrite

**Structure change:** rules are now data objects (`Rule[]`) with explicit `id`,
`dimension`, `categories`, `match`, `bonus`, `matchReason`, `mismatch`,
`penalty`, and `mismatchReason` fields.  `evaluateOption` iterates the list
rather than containing nested `if` blocks.  This makes the ownership table
machine-verifiable.

#### Rule ownership decisions (Issue 1)

Each rule now fires in exactly one dimension.  The removed cross-dimension
bonuses are listed below.

| ID | Old dimensions | New owner | Removed |
|----|---------------|-----------|---------|
| DR-1 | launchSpin +25, **distance +10** | launchSpin | distance +10 |
| DR-3 | dispersion +25, **forgiveness +10** | dispersion | forgiveness +10 |
| DR-4 | **dispersion +20**, forgiveness +25 | forgiveness | dispersion +20 |
| BA-1 | launchSpin +25, **distance +10** | launchSpin | distance +10 |
| SH-1 | dispersion +20, **distance +10** | dispersion | distance +10 |
| IR-1 | **dispersion +10**, forgiveness +25 | forgiveness | dispersion +10 |

Rationale summary:
- DR-1 / BA-1: spin reduction is the primary equipment effect; distance gain is a downstream consequence, not an independent trait.
- DR-3: draw bias is a directional/path correction; forgiveness is a separate equipment characteristic.
- DR-4: high-MOI's defining value is reducing off-centre penalty (forgiveness); cleaner dispersion is a side-effect.
- SH-1: shaft stability belongs to dispersion/control; extra distance from stability is secondary.
- IR-1: forgiving irons are chosen for their forgiveness characteristic; any dispersion improvement is incidental.

#### Penalties added (Issue 2)

Symmetric penalties for each matching bonus rule:

| ID | Condition | Dimension | Penalty |
|----|-----------|-----------|---------|
| DR-1p | spin < 2 500 rpm + low-spin driver | launchSpin | −15 |
| DR-2p | launch > 15° + high-launch driver | launchSpin | −15 |
| DR-3p | left miss + draw-bias driver | dispersion | −20 |
| DR-4p | consistency > 70 + high-MOI driver | forgiveness | −15 |
| BA-1p | spin < 2 500 rpm + low-spin ball | launchSpin | −15 |
| SH-1p | smooth tempo or club speed < 85 mph + heavy shaft | dispersion | −20 |
| SH-2p | launch > 15° + high-launch shaft | launchSpin | −10 |
| IR-1p | handicap < 5 + high-forgiveness irons | forgiveness | −20 |
| IR-2p | high trajectory + high-launch irons | launchSpin | −12 |

#### Goal bonus normalisation (Issue 5)

`softerFeel` bonus reduced from +30 → **+8**.  `tighterDispersion` reduced from
+10 → **+7**.  All five goals now contribute ≈ 2.0 points to the final score
(target defined as `GOAL_TARGET_FINAL_IMPACT = 2.0` in `scoringConstants.ts`).
Back-calculation: `dimensionBonus = targetImpact / categoryWeight[dimension]`.

**`preference` dimension renamed to `feel`** throughout (`RuleEvaluation`,
`ScoredRecommendation.components`, engine, tests).

---

### `lib/fitting/scoring.ts` — significant changes

- **`weightedScore` now takes a `category` argument** and looks up the correct
  weight map from `CATEGORY_WEIGHTS` in `scoringConstants.ts`.  Category-
  specific weights replace the single `FIT_WEIGHTS` constant (Issue 6).
- **No per-dimension cap.**  The `clamp(0, 100)` call was removed.  Raw scores
  can exceed 100 when multiple bonuses fire.  The 0–100 range is enforced at
  the final stage only, via min-max normalisation across the candidate set.
- **`minMaxNormalize(scores[])`** — new helper applied per category in the
  engine after all raw scores are computed.  Ties map to 50; otherwise min → 0,
  max → 100, preserving ranking signal (Issue 3).
- **`scoreToConfidence` removed.**  Replaced by two independent functions
  (Issue 4):
  - `computeDataConfidence(launchData)` → `"profile_only" | "profile_and_launch"`
  - `computeMatchStrength(normalizedTopScore)` → `"strong" | "moderate" | "weak"`
  - `buildConfidenceSummary(dataConfidence, matchStrength)` → human-readable string
  - `matchStrengthToLegacyConfidence(ms)` → maps to `"High" | "Medium" | "Low"` for backward compatibility

---

### `lib/fitting/types.ts` — additive changes only

- Added `DataConfidence` and `MatchStrength` types.
- `ScoredRecommendation.components.preference` renamed to `feel`.
- `ScoredRecommendation.confidence` marked `@deprecated`; kept for session-history backward compatibility.
- `ScoredRecommendation.swappedForCoherence?: boolean` added for coherence-swap surfacing.
- `FitRecommendationResult` gains `dataConfidence`, `matchStrength`, and `confidenceSummary` fields.
- `FitRecommendationResult.confidence` marked `@deprecated`; retained so `session-history.ts` and dashboard continue to work without changes.

---

### `lib/fitting/engine.ts` — updated orchestration

- Calls `weightedScore(eval, category)` with category argument.
- Applies `minMaxNormalize` per category before building `ScoredRecommendation` objects.
- Calls `validateBuildCoherence` after scoring all four categories and merges any coherence swaps back into the ranked lists.
- Computes and returns `dataConfidence`, `matchStrength`, and `confidenceSummary`.

---

### Category weight map (Issue 6)

```
CATEGORY_WEIGHTS = {
  driver: { distance: 0.25, dispersion: 0.30, launchSpin: 0.25, feel: 0.05, forgiveness: 0.15 },
  iron:   { distance: 0.20, dispersion: 0.35, launchSpin: 0.10, feel: 0.10, forgiveness: 0.25 },
  shaft:  { distance: 0.20, dispersion: 0.35, launchSpin: 0.35, feel: 0.00, forgiveness: 0.10 },
  ball:   { distance: 0.20, dispersion: 0.15, launchSpin: 0.30, feel: 0.25, forgiveness: 0.10 },
}
```

Key decisions:
- `shaft.feel = 0.00` — no feel rules exist for shafts; the dimension carries zero weight so it cannot inject noise.
- `iron.launchSpin = 0.10` — only one launch rule (IR-2) exists for irons, so its weight is reduced relative to drivers and shafts.
- All category weight rows sum to exactly 1.0 (verified by test).

---

### Build coherence validator (Issue 7)

Four conflict patterns checked in order:

| ID | Conflict | Category swapped |
|----|----------|-----------------|
| C-1 | Low-spin driver + low-spin ball | ball |
| C-2 | High-launch driver + high-launch shaft | shaft |
| C-3 | Shaft with "heavy shaft will reduce control" penalty reason selected as #1 | shaft |
| C-4 | Driver with "draw-bias driver would worsen the miss" penalty reason selected as #1 | driver |

Rules: at most one swap per category; if no #2 candidate exists the original pick is kept.  Every swap appends a human-readable `swapReason` to the recommendation's `reasons` array and sets `swappedForCoherence: true`.

---

## What did NOT change

- Questionnaire UI components — untouched.
- Input schema (`FitSessionInput`, `profileSchema`, `launchDataSchema`, etc.) — untouched.
- Firestore fetch logic and 1-hour localStorage cache (`lib/firebase/equipment.ts`) — untouched.
- Build-specs logic (height/wrist-to-floor calculations) — untouched.
- Catalog seed data (`lib/data/seed.ts`) — untouched.
- `session-history.ts` — untouched; reads `result.confidence` which is still present as a deprecated-but-functional field.
