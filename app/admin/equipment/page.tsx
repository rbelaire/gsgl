"use client";

import { useRef, useState } from "react";
import { writeBatch, doc, collection } from "firebase/firestore";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { db, isFirebaseConfigured } from "@/lib/firebase/client";
import { clearEquipmentCache } from "@/lib/firebase/equipment";
import {
  downloadTemplate,
  parseEquipmentFile,
  COLUMNS,
  type ParseResult,
} from "@/lib/admin/parse-equipment-excel";
import type { EquipmentOption } from "@/lib/data/seed";

type UploadStatus = "idle" | "uploading" | "done" | "error";

const CATEGORY_COLORS: Record<string, string> = {
  ball:   "bg-blue-50 text-blue-700",
  driver: "bg-emerald-50 text-emerald-700",
  irons:  "bg-amber-50 text-amber-700",
  shaft:  "bg-purple-50 text-purple-700",
};

async function writeToFirestore(options: EquipmentOption[]): Promise<void> {
  if (!db) throw new Error("Firebase is not configured.");
  const CHUNK = 500;
  for (let i = 0; i < options.length; i += CHUNK) {
    const batch = writeBatch(db);
    for (const opt of options.slice(i, i + CHUNK)) {
      batch.set(doc(collection(db, "equipment"), opt.id), opt, { merge: true });
    }
    await batch.commit();
  }
}

function AdminContent() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadMessage, setUploadMessage] = useState("");

  async function handleFileChange(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    if (!file) return;

    setParseResult(null);
    setParseError(null);
    setUploadStatus("idle");

    try {
      const result = await parseEquipmentFile(file);
      setParseResult(result);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "Unknown parse error");
    }
  }

  async function handleUpload() {
    if (!parseResult || parseResult.valid.length === 0) return;
    if (!isFirebaseConfigured) {
      setUploadStatus("error");
      setUploadMessage("Firebase is not configured. Add credentials to .env.local.");
      return;
    }

    setUploadStatus("uploading");
    try {
      await writeToFirestore(parseResult.valid);
      clearEquipmentCache();
      setUploadStatus("done");
      setUploadMessage(
        `${parseResult.valid.length} equipment options written to Firestore. ` +
          "Cache cleared — next fit will use the updated catalog.",
      );
    } catch (err) {
      setUploadStatus("error");
      setUploadMessage(err instanceof Error ? err.message : "Upload failed");
    }
  }

  const counts = parseResult
    ? Object.entries(
        parseResult.valid.reduce<Record<string, number>>((acc, o) => {
          acc[o.category] = (acc[o.category] ?? 0) + 1;
          return acc;
        }, {}),
      )
    : [];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-20">
      <SectionHeader
        eyebrow="Admin"
        title="Equipment Catalog Upload"
        description="Upload an Excel spreadsheet to update the equipment catalog in Firestore. All existing documents are merged — rows you don't include are left untouched."
      />

      {/* Step 1 – Template */}
      <section className="mt-8 rounded-xl border border-gb-line bg-gb-panel p-4 sm:p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gb-text">1. Download template</h2>
        <p className="mt-2 text-sm text-gb-muted">
          The template includes all required columns, valid values for each field, and two example rows.
        </p>

        {/* Mobile: stacked column reference */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:hidden">
          {COLUMNS.map((c) => (
            <div key={c.key} className="rounded-lg border border-gb-line bg-gb-bg px-3 py-2">
              <p className="text-xs font-semibold text-gb-text">
                {c.label}
                {c.required && <span className="ml-0.5 text-red-500">*</span>}
              </p>
              <p className="mt-0.5 text-xs text-gb-muted italic leading-snug">{c.hint}</p>
            </div>
          ))}
        </div>

        {/* Desktop: full table */}
        <div className="mt-4 hidden sm:block overflow-x-auto">
          <table className="text-xs w-full border-collapse">
            <thead>
              <tr className="bg-gb-bg">
                {COLUMNS.map((c) => (
                  <th
                    key={c.key}
                    className="border border-gb-line px-3 py-2 text-left font-semibold text-gb-text"
                  >
                    {c.label}
                    {c.required && <span className="ml-0.5 text-red-500">*</span>}
                  </th>
                ))}
              </tr>
              <tr>
                {COLUMNS.map((c) => (
                  <td
                    key={c.key}
                    className="border border-gb-line px-3 py-2 text-gb-muted italic"
                  >
                    {c.hint}
                  </td>
                ))}
              </tr>
            </thead>
          </table>
        </div>

        <div className="mt-4">
          <Button variant="secondary" onClick={downloadTemplate}>
            Download template (.xlsx)
          </Button>
        </div>
      </section>

      {/* Step 2 – Upload file */}
      <section className="mt-4 sm:mt-6 rounded-xl border border-gb-line bg-gb-panel p-4 sm:p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gb-text">2. Upload your file</h2>
        <p className="mt-2 text-sm text-gb-muted">
          Accepts .xlsx or .xls. The first sheet is used; the first row must be the header.
        </p>

        <div
          className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gb-line bg-gb-bg px-6 py-8 sm:py-10 text-center transition-colors hover:border-gsgl-gold/60 hover:bg-gb-card/30"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          <p className="text-sm font-medium text-gb-text">Click to choose file</p>
          <p className="mt-1 text-xs text-gb-muted">.xlsx or .xls</p>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {parseError && (
          <p className="mt-3 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {parseError}
          </p>
        )}
      </section>

      {/* Step 3 – Preview + errors + upload action */}
      {parseResult && (
        <section className="mt-4 sm:mt-6 rounded-xl border border-gb-line bg-gb-panel p-4 sm:p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-gb-text">3. Preview &amp; Upload</h2>
            <div className="flex flex-wrap gap-2">
              {counts.map(([cat, n]) => (
                <span
                  key={cat}
                  className={`rounded px-2 py-0.5 text-xs font-semibold ${CATEGORY_COLORS[cat] ?? "bg-slate-50 text-slate-700"}`}
                >
                  {n} {cat}
                </span>
              ))}
              {parseResult.errorCount > 0 && (
                <span className="rounded bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
                  {parseResult.errorCount} row{parseResult.errorCount > 1 ? "s" : ""} with errors
                </span>
              )}
            </div>
          </div>

          {/* Empty state */}
          {parseResult.valid.length === 0 && parseResult.errorCount === 0 && (
            <p className="mt-4 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-700">
              No data rows found. Make sure your file has the correct column headers in the first row and at least one data row below it.
            </p>
          )}

          {/* Error rows */}
          {parseResult.rows.filter((r) => r.errors.length > 0).length > 0 && (
            <div className="mt-4 space-y-2">
              {parseResult.rows
                .filter((r) => r.errors.length > 0)
                .map((r) => (
                  <div
                    key={r.row}
                    className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-700"
                  >
                    <span className="font-semibold">Row {r.row}:</span>{" "}
                    {r.errors.join(" · ")}
                  </div>
                ))}
            </div>
          )}

          {/* Valid rows – mobile card list */}
          {parseResult.valid.length > 0 && (
            <div className="mt-4 space-y-2 sm:hidden">
              {parseResult.valid.map((opt) => {
                const attrs = (["spinProfile", "launchProfile", "feel", "forgivenessLevel", "bias", "weightClass"] as const)
                  .filter((k) => (opt as unknown as Record<string, unknown>)[k]);
                return (
                  <div key={opt.id} className="rounded-lg border border-gb-line bg-gb-bg px-3 py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-gb-text truncate">{opt.name}</p>
                      <span className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold ${CATEGORY_COLORS[opt.category] ?? ""}`}>
                        {opt.category}
                      </span>
                    </div>
                    {attrs.length > 0 && (
                      <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-0.5">
                        {attrs.map((k) => (
                          <p key={k} className="text-xs text-gb-muted">
                            <span className="text-gb-text/60">{k}:</span>{" "}
                            {(opt as unknown as Record<string, unknown>)[k] as string}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Valid rows – desktop table */}
          {parseResult.valid.length > 0 && (
            <div className="mt-4 hidden sm:block overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-gb-bg">
                    {["name", "category", "spinProfile", "launchProfile", "feel", "forgivenessLevel", "bias", "weightClass"].map((h) => (
                      <th
                        key={h}
                        className="border border-gb-line px-3 py-2 text-left font-semibold text-gb-text"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parseResult.valid.map((opt) => (
                    <tr key={opt.id} className="even:bg-gb-bg/50">
                      <td className="border border-gb-line px-3 py-2 font-medium text-gb-text">
                        {opt.name}
                      </td>
                      <td className="border border-gb-line px-3 py-2">
                        <span className={`rounded px-1.5 py-0.5 text-xs font-semibold ${CATEGORY_COLORS[opt.category] ?? ""}`}>
                          {opt.category}
                        </span>
                      </td>
                      {["spinProfile", "launchProfile", "feel", "forgivenessLevel", "bias", "weightClass"].map((k) => (
                        <td key={k} className="border border-gb-line px-3 py-2 text-gb-muted">
                          {(opt as unknown as Record<string, unknown>)[k] as string ?? "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Upload action */}
          {parseResult.valid.length > 0 && (
            <div className="mt-6 border-t border-gb-line pt-5">
              <p className="text-sm text-gb-muted">
                Writes {parseResult.valid.length} valid row
                {parseResult.valid.length !== 1 ? "s" : ""} to the{" "}
                <code className="rounded bg-gb-bg px-1 py-0.5 font-mono">equipment</code>{" "}
                collection using merge — existing fields not in your spreadsheet are preserved.
                {parseResult.errorCount > 0 && (
                  <span className="text-amber-700">
                    {" "}
                    {parseResult.errorCount} row
                    {parseResult.errorCount !== 1 ? "s" : ""} with errors will be skipped.
                  </span>
                )}
              </p>

              {uploadStatus === "done" && (
                <p className="mt-3 rounded-md bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  {uploadMessage}
                </p>
              )}
              {uploadStatus === "error" && (
                <p className="mt-3 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
                  {uploadMessage}
                </p>
              )}

              <div className="mt-4">
                <Button
                  onClick={handleUpload}
                  disabled={uploadStatus === "uploading" || uploadStatus === "done"}
                >
                  {uploadStatus === "uploading"
                    ? "Uploading…"
                    : uploadStatus === "done"
                      ? "Uploaded"
                      : `Upload ${parseResult.valid.length} options to Firestore`}
                </Button>
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default function AdminEquipmentPage() {
  return (
    <AdminGuard>
      <AdminContent />
    </AdminGuard>
  );
}
