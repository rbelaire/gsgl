# How Equipment Selection Works

This document explains in plain English how the site recommends golf equipment based on your answers.

---

## The Big Picture

You fill out a short questionnaire. The site scores every piece of equipment in its catalog against your answers, then shows you the top picks for each category (ball, driver, irons, shaft). Nothing is hard-filtered out — every item is considered, but some score much higher than others depending on your situation.

---

## Step-by-Step: What You Fill In

### Step 1 — Your Player Profile

This is the foundation of the recommendation. You provide:

- **Handicap** — tells the system how skilled you are. Higher handicaps trigger more weight toward forgiveness.
- **Height and wrist-to-floor measurement** — used to calculate whether you need longer/shorter clubs and upright/flat lie angles. No math needed on your end; the system figures out the spec adjustments.
- **Age range** — collected as context but feeds into general profiling.
- **Swing tempo** (smooth / medium / aggressive) — aggressive swingers with higher swing speeds benefit from heavier shafts, which the system rewards in scoring.
- **Common miss** (left / right / both) — if you miss right, the system gives a significant bonus to draw-biased driver heads because they help curve the ball back left.
- **Preferred trajectory** (low / mid / high) — low-trajectory players get bonus points toward high-launch irons.

### Step 2 — Your Current Equipment

Driver, irons, and ball model — text fields. This is informational for now and feeds into session history context rather than the scoring algorithm directly.

### Step 3 — Launch Monitor Data (Optional but Important)

If you have numbers from a launch monitor or simulator, enter them here:

- Club speed, ball speed, spin rate, launch angle, carry distance, attack angle, consistency index

**This section has the biggest impact on confidence level.** If you leave it blank, the system still gives you recommendations, but flags them as **Low Confidence** regardless of how well the equipment matched your profile. With launch data, recommendations can reach **High Confidence** (score of 80+) or **Medium Confidence** (score 65–79).

Key thresholds used in scoring:
- Spin rate above 3,000 rpm → strong bonus for low-spin drivers and balls
- Launch angle below 10° → bonus for high-launch shafts and drivers
- Consistency index below 45 → bonus for high-forgiveness drivers and irons

### Step 4 — Your Goals

Checkboxes for what you most want to improve:

| Goal | What it does |
|------|-------------|
| More distance | Adds points to equipment that scores well on distance |
| Lower driver spin | Adds points to low-spin drivers and balls |
| Higher launch angle | Adds points to high-launch drivers and shafts |
| Tighter dispersion | Adds points to forgiving and draw-biased options |
| Softer feel | Adds a large bonus (30 points) to soft-feel balls |

Goals layer on top of the profile data — they don't override it, they amplify relevant matches.

### Step 5 — Review and Submit

Shows a summary of everything before the system runs the recommendation engine.

---

## How Scoring Works

Each piece of equipment gets scored across five dimensions. The dimensions are combined into a single score (0–100) using fixed weights.

### The Five Dimensions

**1. Distance (25% of final score)**
- Starts at 50.
- If your spin rate is high and the equipment is a low-spin driver, +10.
- If you selected "more distance" as a goal, +8.

**2. Dispersion (30% of final score — highest weight)**
- Starts at 50.
- Miss right + draw-biased driver head: +25.
- Consistency index below 45 + high-MOI (forgiving) driver: +20.
- Aggressive tempo + high swing speed + heavy shaft: +20.
- "Tighter dispersion" goal: +10.
- High handicap + forgiving irons: +10.

**3. Launch and Spin (25% of final score)**
- Starts at 50.
- Spin above 3,000 + low-spin driver: +25.
- Launch below 10° + better-launch driver: +20.
- High spin + high launch + low-spin ball: +25.
- Launch below 10° + high-launch shaft: +20.
- Low trajectory tendency + high-launch irons: +18.
- "Lower spin" or "higher launch" goals: +8 each.

**4. Feel Preference (10% of final score)**
- Starts at 50.
- "Softer feel" goal + soft ball: +30.

**5. Forgiveness (10% of final score)**
- Starts at 50.
- Consistency below 45 + high-MOI driver: +25.
- Handicap above 15 + forgiving irons: +25.

### Final Scoring Formula

```
Final Score = (Distance × 0.25) + (Dispersion × 0.30) + (Launch/Spin × 0.25) + (Feel × 0.10) + (Forgiveness × 0.10)
```

All scores are capped between 0 and 100. The system then ranks all options in each category by final score and returns the top 3.

---

## Confidence Levels

| Situation | Confidence |
|-----------|-----------|
| No launch data provided | Low (always) |
| Launch data provided, score ≥ 80 | High |
| Launch data provided, score 65–79 | Medium |
| Launch data provided, score < 65 | Low |

Low confidence doesn't mean the recommendations are wrong — it means the system had less data to work with. Think of it as: the more real numbers you provide, the more the system can validate its reasoning.

---

## Build Specifications

Alongside equipment picks, the system suggests physical fitting specs based on your height and wrist-to-floor measurement:

| Player Type | Length | Lie Angle | Grip |
|-------------|--------|-----------|------|
| Average (height 66–74", wrist 32–36") | Standard | Standard | Standard |
| Tall (height > 74", wrist > 36") | +0.5 inch | +1° upright | Midsize |
| Shorter (height < 66", wrist < 32") | -0.5 inch | -1° flat | Standard |

---

## Equipment Catalog

The site ships with a default catalog of 12 items (3 per category):

**Balls:** low-spin tour ball, mid-spin performance ball, high-spin soft urethane ball

**Drivers:** low-spin head (9°), max-forgiveness head (10.5°), draw-bias head (10.5°)

**Shafts:** light 50g shaft, mid 60g shaft, heavy 70g shaft

**Irons:** forged player cavity, distance game improvement, compact players iron

If connected to Firestore, the catalog is fetched live (with a 1-hour local cache) and may contain more options. Scoring logic applies identically to any catalog size.

---

## What You See on the Results Page

- **Top pick per category** — name and one-sentence expected improvement
- **Score breakdown** — radar chart showing how the top pick scored across all five dimensions
- **Build specs** — your length, lie, and grip recommendations
- **Why it was picked** — plain-language reasons extracted from the scoring rules that fired
- **Confidence level** — percentage and guidance on next steps
- **Session history** — your last 20 fittings are saved locally so you can compare over time

---

## Summary

The system is a rule-based scoring engine. It does not filter equipment in or out — it scores everything and surfaces the best matches. Your profile, launch numbers, and goals each contribute points to specific equipment traits. Dispersion (consistency) is weighted most heavily. Launch monitor data is the single biggest lever for increasing recommendation confidence.
