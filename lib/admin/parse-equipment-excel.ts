import * as XLSX from "xlsx";
import { z } from "zod";
import type { EquipmentOption } from "@/lib/data/seed";

// ── Column definitions ──────────────────────────────────────────────────────

export const COLUMNS = [
  { key: "id",               label: "id",               required: true,  hint: "Unique slug, e.g. titleist-pro-v1x" },
  { key: "name",             label: "name",             required: true,  hint: "Display name" },
  { key: "category",        label: "category",         required: true,  hint: "ball | driver | irons | shaft" },
  { key: "traits",          label: "traits",           required: false, hint: "Comma-separated, e.g. low spin,firm" },
  { key: "spinProfile",     label: "spinProfile",      required: false, hint: "low | mid | high" },
  { key: "launchProfile",   label: "launchProfile",    required: false, hint: "low | mid | high" },
  { key: "feel",            label: "feel",             required: false, hint: "firm | balanced | soft" },
  { key: "weightClass",     label: "weightClass",      required: false, hint: "light | mid | heavy" },
  { key: "flexProfile",     label: "flexProfile",      required: false, hint: "regular | stiff | xstiff" },
  { key: "forgivenessLevel",label: "forgivenessLevel", required: false, hint: "high | mid | low" },
  { key: "bias",            label: "bias",             required: false, hint: "draw | neutral" },
] as const;

const HEADER_ROW = COLUMNS.map((c) => c.label);

// ── Zod row schema ──────────────────────────────────────────────────────────

const optionalEnum = <T extends [string, ...string[]]>(values: T) =>
  z.enum(values).optional().or(z.literal("").transform(() => undefined));

const rowSchema = z.object({
  id:               z.string().min(1, "id is required"),
  name:             z.string().min(1, "name is required"),
  category:         z.enum(["ball", "driver", "irons", "shaft"], {
                      errorMap: () => ({ message: "category must be ball, driver, irons, or shaft" }),
                    }),
  traits:           z.string().optional().transform((s) =>
                      s ? s.split(",").map((t) => t.trim()).filter(Boolean) : [],
                    ),
  spinProfile:      optionalEnum(["low", "mid", "high"]),
  launchProfile:    optionalEnum(["low", "mid", "high"]),
  feel:             optionalEnum(["firm", "balanced", "soft"]),
  weightClass:      optionalEnum(["light", "mid", "heavy"]),
  flexProfile:      optionalEnum(["regular", "stiff", "xstiff"]),
  forgivenessLevel: optionalEnum(["high", "mid", "low"]),
  bias:             optionalEnum(["draw", "neutral"]),
});

// ── Public types ────────────────────────────────────────────────────────────

export interface ParsedRow {
  row: number;
  data: EquipmentOption | null;
  errors: string[];
}

export interface ParseResult {
  rows: ParsedRow[];
  valid: EquipmentOption[];
  errorCount: number;
}

// ── Template generator ──────────────────────────────────────────────────────

export function downloadTemplate() {
  const example: Record<string, string>[] = [
    {
      id: "titleist-pro-v1x",
      name: "Titleist Pro V1x",
      category: "ball",
      traits: "high spin,firm,urethane",
      spinProfile: "high",
      launchProfile: "high",
      feel: "firm",
      weightClass: "",
      flexProfile: "",
      forgivenessLevel: "",
      bias: "",
    },
    {
      id: "taylormade-qi10",
      name: "TaylorMade Qi10",
      category: "driver",
      traits: "high MOI,draw bias,forgiving",
      spinProfile: "mid",
      launchProfile: "mid",
      feel: "",
      weightClass: "",
      flexProfile: "",
      forgivenessLevel: "high",
      bias: "draw",
    },
  ];

  const ws = XLSX.utils.json_to_sheet(example, { header: HEADER_ROW });

  // Add column width hints
  ws["!cols"] = COLUMNS.map((c) => ({ wch: Math.max(c.label.length, c.hint.length) + 2 }));

  // Second row: hints (insert after header)
  const hintRow: Record<string, string> = {};
  for (const col of COLUMNS) hintRow[col.label] = col.hint;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Equipment");
  XLSX.writeFile(wb, "gsgl-equipment-template.xlsx");
}

// ── Parser ───────────────────────────────────────────────────────────────────

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const READ_TIMEOUT_MS = 30_000; // 30 seconds

export function parseEquipmentFile(file: File): Promise<ParseResult> {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return Promise.reject(
      new Error(`File too large: maximum allowed size is ${MAX_FILE_SIZE_BYTES / 1024 / 1024} MB`),
    );
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    const timeoutId = setTimeout(() => {
      reader.abort();
      reject(new Error("File read timed out"));
    }, READ_TIMEOUT_MS);

    reader.onload = (e) => {
      clearTimeout(timeoutId);
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
          defval: "",
        });

        const rows: ParsedRow[] = raw.map((rawRow, i) => {
          const result = rowSchema.safeParse(rawRow);
          if (result.success) {
            return { row: i + 2, data: result.data as EquipmentOption, errors: [] };
          }
          return {
            row: i + 2,
            data: null,
            errors: result.error.errors.map((e) => e.message),
          };
        });

        const valid = rows.filter((r) => r.data !== null).map((r) => r.data!);
        const errorCount = rows.filter((r) => r.errors.length > 0).length;
        resolve({ rows, valid, errorCount });
      } catch (err) {
        reject(new Error(`Failed to parse file: ${err instanceof Error ? err.message : String(err)}`));
      }
    };

    reader.onerror = () => {
      clearTimeout(timeoutId);
      reject(new Error("Failed to read file"));
    };
    reader.readAsArrayBuffer(file);
  });
}
