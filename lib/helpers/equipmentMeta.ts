/**
 * Plain-English descriptions and "best for" tags for equipment catalog cards.
 *
 * All descriptions are generated from the equipment's traits and profiles so
 * they work for any option in the catalog — including items added later via
 * Firestore — without requiring hardcoded copy per item.
 */

import type { EquipmentOption } from "../data/seed";
import type { RecommendationCategory } from "../fitting/types";

// ── Category labels ───────────────────────────────────────────────────────────

export function getCategoryLabel(category: RecommendationCategory): string {
  const labels: Record<RecommendationCategory, string> = {
    ball: "Ball",
    driver: "Driver",
    irons: "Irons",
    shaft: "Shaft",
  };
  return labels[category];
}

// ── Plain-English personality ─────────────────────────────────────────────────

export function getEquipmentPersonality(option: EquipmentOption): string {
  switch (option.category) {
    case "driver":
      return getDriverPersonality(option);
    case "ball":
      return getBallPersonality(option);
    case "shaft":
      return getShaftPersonality(option);
    case "irons":
      return getIronsPersonality(option);
  }
}

function getDriverPersonality(o: EquipmentOption): string {
  if (o.spinProfile === "low" && o.forgivenessLevel !== "high") {
    return (
      "Built for players who spin the ball too much — this head reduces driver spin for a lower, more penetrating ball flight. " +
      "You'll get more roll-out after landing and a more boring trajectory through the wind. " +
      "Works best when your spin rate is above 3,000 rpm; pairing it with already-low spin can actually cost you carry distance."
    );
  }
  if (o.bias === "draw" && o.forgivenessLevel === "high") {
    return (
      "Engineered to help players who miss right — the weight placement promotes a right-to-left curve that counteracts a fade or slice. " +
      "It combines the directional correction with a large, forgiving head, so you get two benefits: less right miss and more mishit protection. " +
      "A strong choice for mid-handicap players who want to build a draw without sacrificing consistency."
    );
  }
  if (o.forgivenessLevel === "high") {
    return (
      "Designed to keep errant shots in play — the oversized, high-MOI head dramatically reduces the punishment for strikes away from the sweet spot. " +
      "Off-center hits lose less distance and stay much closer to your target line than with a traditional head. " +
      "If your priority is finding more fairways and keeping the ball in play, this is the place to start."
    );
  }
  return (
    "A versatile driver head that suits a wide range of swing types. " +
    "Neutral weighting means it won't fight your natural shot shape in either direction. " +
    "Works well as a baseline option while you figure out whether you need a more specialized fit."
  );
}

function getBallPersonality(o: EquipmentOption): string {
  if (o.spinProfile === "low" && o.feel === "firm") {
    return (
      "A distance-focused ball that reduces spin off the driver for more carry and roll-out. " +
      "The firmer cover gives a crisper feel at impact and suits players who want to maximize yardage over short-game control. " +
      "A good fit if your spin rate is already high and you want to take strokes off your driver numbers."
    );
  }
  if (o.spinProfile === "high" && o.feel === "soft") {
    return (
      "A soft, high-spinning ball designed for players who want maximum control around the greens. " +
      "The urethane cover generates more backspin on wedge and chip shots, helping the ball stop quickly after landing. " +
      "Trades a small amount of driver distance for noticeably better feel and short-game stopping power."
    );
  }
  return (
    "A true all-rounder that balances distance off the tee with control into greens. " +
    "Neither too firm nor too soft — it works well for most players, especially those who haven't yet identified a specific weakness to fix. " +
    "A smart starting point if you're unsure where to begin."
  );
}

function getShaftPersonality(o: EquipmentOption): string {
  if (o.weightClass === "light" && o.launchProfile === "high") {
    return (
      "A lighter, more flexible shaft that helps players generate more club head speed and launch the ball higher. " +
      "The reduced weight makes the club easier to swing fast, which adds both distance and height for slower swingers. " +
      'The regular flex creates a slight "loading" feeling at the top of the swing that helps sequence the downswing naturally.'
    );
  }
  if (o.weightClass === "heavy" && o.launchProfile === "low") {
    return (
      "A heavy, firm shaft designed for fast, aggressive swingers who need more stability through the hitting zone. " +
      "The extra mass keeps the club head from twisting on high-speed swings, tightening dispersion and producing a more consistent pattern. " +
      "The low-launch profile prevents the ball from ballooning at high speeds, keeping flight efficient and predictable."
    );
  }
  return (
    "A mid-weight shaft that offers a reliable balance of stability and feel without going to either extreme. " +
    "Stiff flex controls the delivery of the club head through impact without being punishing on timing. " +
    "A versatile choice that performs well for most recreational golfers with average swing speeds."
  );
}

function getIronsPersonality(o: EquipmentOption): string {
  if (o.forgivenessLevel === "high") {
    return (
      "Maximum forgiveness irons designed to help average players hit it higher and farther than their swing would normally allow. " +
      "The wide sole and large sweet spot mean off-center strikes still fly reasonably straight and reasonably far. " +
      "Ideal for players still building consistency — the forgiveness protects you while your contact and ball-striking improve."
    );
  }
  if (o.forgivenessLevel === "low") {
    return (
      "A precision iron built for skilled players who want full control over their ball flight. " +
      "The compact head demands consistent center contact, but rewards it with predictable, workable trajectory you can shape both ways. " +
      "Every shot gives you clear feedback — you will feel exactly where the ball met the face."
    );
  }
  return (
    "A versatile iron that bridges the gap between forgiveness and workability. " +
    "Forged construction delivers a soft, responsive feel while a modest cavity back adds some mishit protection on off days. " +
    "Works well for players who have developed decent consistency but still want a bit of help when contact isn't perfect."
  );
}

// ── Best-for tags ─────────────────────────────────────────────────────────────

export function getBestForTags(option: EquipmentOption): string[] {
  switch (option.category) {
    case "driver":
      return getDriverTags(option);
    case "ball":
      return getBallTags(option);
    case "shaft":
      return getShaftTags(option);
    case "irons":
      return getIronsTags(option);
  }
}

function getDriverTags(o: EquipmentOption): string[] {
  if (o.spinProfile === "low" && o.forgivenessLevel !== "high") {
    return ["Spin rates above 3,000 rpm", "Low-to-mid handicap players", "Faster swing speeds"];
  }
  if (o.bias === "draw") {
    return ["Players who miss right (slicers/faders)", "Mid-handicap golfers", "Building a draw swing"];
  }
  if (o.forgivenessLevel === "high") {
    return ["Inconsistent ball-strikers", "Mid-to-high handicap players", "Golfers focused on finding fairways"];
  }
  return ["All skill levels", "Neutral swing shapes", "Players exploring options"];
}

function getBallTags(o: EquipmentOption): string[] {
  if (o.spinProfile === "low") {
    return ["Distance-focused players", "High spin rates (>3,000 rpm)", "Players who prefer firm feel"];
  }
  if (o.spinProfile === "high") {
    return ["Short game-focused players", "Lower handicap golfers", "Smooth, controlled swing tempo"];
  }
  return ["All skill levels", "Players new to ball fitting", "Those wanting versatility"];
}

function getShaftTags(o: EquipmentOption): string[] {
  if (o.weightClass === "light") {
    return ["Swing speeds under 90 mph", "Players who launch too low", "Seniors or juniors"];
  }
  if (o.weightClass === "heavy") {
    return ["Swing speeds over 103 mph", "Aggressive tempo players", "Tour-level ball strikers"];
  }
  return ["Mid-range swing speeds (85–103 mph)", "Most recreational golfers", "Players wanting versatility"];
}

function getIronsTags(o: EquipmentOption): string[] {
  if (o.forgivenessLevel === "high") {
    return ["High handicap players (15+)", "Beginners and intermediates", "Inconsistent ball-strikers"];
  }
  if (o.forgivenessLevel === "low") {
    return ["Scratch to 5 handicap", "Players who want shot shaping", "Consistent center-contact strikers"];
  }
  return ["Mid-handicap players (5–15)", "Players wanting feel + protection", "Those developing consistency"];
}

// ── Trait label cleanup ───────────────────────────────────────────────────────

const TRAIT_LABELS: Record<string, string> = {
  "low spin": "Low Spin",
  "mid spin": "Mid Spin",
  "high spin": "High Spin",
  "firm": "Firm Feel",
  "balanced": "Balanced Feel",
  "soft": "Soft Feel",
  "distance": "Distance",
  "all around": "All-Around",
  "control": "Control",
  "penetrating flight": "Penetrating Flight",
  "high moi": "High MOI",
  "stable": "Stable",
  "forgiveness": "Forgiving",
  "draw bias": "Draw Bias",
  "anti-right miss": "Anti-Right Miss",
  "forgiving": "Forgiving",
  "light": "Lightweight",
  "high launch": "High Launch",
  "mid weight": "Mid-Weight",
  "mid launch": "Mid Launch",
  "heavy": "Heavyweight",
  "low launch": "Low Launch",
  "workability": "Workable",
  "mid forgiveness": "Mid Forgiveness",
  "flighted": "Flighted",
  "precision": "Precision",
};

export function getTraitLabel(trait: string): string {
  return TRAIT_LABELS[trait.toLowerCase()] ?? trait;
}
