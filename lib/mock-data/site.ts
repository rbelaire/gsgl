export const featuredCapabilities = [
  {
    title: "Ball Fitting",
    description:
      "Evaluate launch, spin profile, and dispersion tendencies to narrow ball models that support your typical shot window.",
  },
  {
    title: "Club Fitting",
    description:
      "Map loft, lie, and head profile decisions to player delivery and strike location patterns.",
  },
  {
    title: "Shaft Analysis",
    description:
      "Balance feel, load profile, and timing to improve consistency through the bag.",
  },
  {
    title: "Bag Optimization",
    description:
      "Close distance gaps and tune set makeup with practical recommendations built for on-course decisions.",
  },
];

export const services = [
  {
    title: "Ball Fitting",
    description: "Identify a ball model that supports speed, spin control, and predictable green-side response.",
    inputs: ["Driver and iron launch data", "Short-game spin tendencies", "Preferred feel and trajectory"],
    outputs: ["Recommended ball category", "Alternative options", "Fit rationale by shot type"],
  },
  {
    title: "Driver Fitting",
    description: "Dial in head and loft configuration to improve launch efficiency and directional control.",
    inputs: ["Club and ball speed", "Attack angle", "Strike location and miss pattern"],
    outputs: ["Target loft and setup", "Head profile guidance", "Primary adjustment priorities"],
  },
  {
    title: "Iron & Shaft Fitting",
    description: "Align iron head and shaft profile with delivery patterns and distance control requirements.",
    inputs: ["Tempo and transition", "Launch and spin windows", "Carry distance consistency"],
    outputs: ["Shaft profile recommendation", "Lie and length guidance", "Playable trajectory target"],
  },
  {
    title: "Bag Gapping",
    description: "Organize the top and bottom of bag for clean carry intervals and smarter shot coverage.",
    inputs: ["Current club set makeup", "Carry yardage intervals", "Common on-course misses"],
    outputs: ["Gap map", "Suggested loft or club changes", "Priority testing list"],
  },
  {
    title: "Full Bag Evaluation",
    description: "Build an integrated equipment strategy across ball, woods, irons, wedges, and putter setup priorities.",
    inputs: ["Complete bag inventory", "Launch monitor snapshots", "Performance goals by segment"],
    outputs: ["Structured fit summary", "Phased upgrade roadmap", "Confidence-weighted recommendations"],
  },
];

export const fitExperienceSteps = [
  {
    title: "Player Profile",
    detail: "Capture tendencies, physical inputs, and playing context before any equipment assumptions are made.",
  },
  {
    title: "Current Bag",
    detail: "Log current setup and identify where gapping, flight window, or strike consistency issues appear.",
  },
  {
    title: "Launch Data",
    detail: "Review key metrics including speed, spin, launch, and dispersion to anchor recommendations in measurable outcomes.",
  },
  {
    title: "Goals",
    detail: "Set practical priorities such as tighter dispersion, better carry windows, or improved peak height control.",
  },
  {
    title: "Recommendations",
    detail: "Receive structured outputs for ball, head, shaft, and spec direction with confidence indicators.",
  },
];

export const dashboardStats = [
  { label: "Sessions completed", value: "18", trend: "+4 this month" },
  { label: "Saved recommendations", value: "11", trend: "2 updated this week" },
  { label: "Average confidence", value: "84%", trend: "Based on complete launch data" },
];

export const recentSessions = [
  {
    id: "GS-1042",
    date: "March 29, 2026",
    focus: "Driver and ball optimization",
    confidence: "High",
  },
  {
    id: "GS-1038",
    date: "March 18, 2026",
    focus: "Iron shaft and lie review",
    confidence: "Medium",
  },
];

export const savedRecommendations = [
  {
    title: "2026 Competitive Setup",
    summary: "Mid-launch driver profile with lower-spin ball pairing.",
    updatedAt: "Updated April 1, 2026",
  },
  {
    title: "Gap Recovery Plan",
    summary: "Top-of-bag spacing corrections between 3W, hybrid, and 4 iron.",
    updatedAt: "Updated March 24, 2026",
  },
];

export const resultPanels = [
  {
    title: "Recommended Ball",
    value: "Tour Urethane Mid-Flight",
    summary: "Balances driver spin reduction with controlled iron descent angle and wedge response.",
  },
  {
    title: "Recommended Driver Setup",
    value: "10.5° head set to neutral",
    summary: "Targets a launch window of 13-14° with spin centered near 2400 rpm.",
  },
  {
    title: "Recommended Iron / Shaft Setup",
    value: "Mid-weight stiff profile",
    summary: "Improves strike timing and maintains playable peak height through the mid-irons.",
  },
];
