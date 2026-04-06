/**
 * Upload equipment catalog to Firestore.
 *
 * Usage:
 *   npx tsx scripts/upload-equipment.ts
 *
 * Requires a .env.local with:
 *   FIREBASE_PROJECT_ID=
 *   FIREBASE_CLIENT_EMAIL=
 *   FIREBASE_PRIVATE_KEY=
 *
 * Each document is written with { merge: true } so re-running is safe —
 * existing fields not present in seed.ts are preserved, and new/changed
 * fields are upserted.
 *
 * To add new models, add entries to lib/data/seed.ts and re-run this script.
 */

import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { config } from "dotenv";
import { balls, drivers, irons, shafts } from "../lib/data/seed.js";

config({ path: ".env.local" });

const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } =
  process.env;

if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  console.error(
    "Missing Firebase admin credentials. Add FIREBASE_PROJECT_ID, " +
      "FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY to .env.local",
  );
  process.exit(1);
}

const app = initializeApp({
  credential: cert({
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore(app);

async function upload() {
  const all = [...balls, ...drivers, ...irons, ...shafts];

  // Firestore batches are limited to 500 operations.
  const CHUNK = 500;
  let uploaded = 0;

  for (let i = 0; i < all.length; i += CHUNK) {
    const batch = db.batch();
    for (const option of all.slice(i, i + CHUNK)) {
      const ref = db.collection("equipment").doc(option.id);
      batch.set(ref, option, { merge: true });
    }
    await batch.commit();
    uploaded += Math.min(CHUNK, all.length - i);
    console.log(`  ${uploaded}/${all.length} written`);
  }

  console.log(`\n✓ Uploaded ${uploaded} equipment options across 4 categories:`);
  console.log(`  ${balls.length} balls`);
  console.log(`  ${drivers.length} drivers`);
  console.log(`  ${irons.length} irons`);
  console.log(`  ${shafts.length} shafts`);
}

upload().catch((err) => {
  console.error(err);
  process.exit(1);
});
