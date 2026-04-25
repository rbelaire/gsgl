import type { SwingReport } from "./types";

const SWING_REPORTS_STORAGE_KEY = "the-golf-build:swing-reports";

function isClient(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function sortByUpdatedAtDesc(reports: SwingReport[]): SwingReport[] {
  return [...reports].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

function readStoredReports(): SwingReport[] {
  if (!isClient()) return [];

  try {
    const raw = localStorage.getItem(SWING_REPORTS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as SwingReport[];
    if (!Array.isArray(parsed)) return [];

    return sortByUpdatedAtDesc(parsed);
  } catch {
    return [];
  }
}

function writeStoredReports(reports: SwingReport[]): void {
  if (!isClient()) return;

  try {
    localStorage.setItem(
      SWING_REPORTS_STORAGE_KEY,
      JSON.stringify(sortByUpdatedAtDesc(reports)),
    );
  } catch {
    // Local storage unavailable or quota exceeded.
  }
}

export function listSwingReportsLocal(): SwingReport[] {
  return readStoredReports();
}

export function getSwingReportLocal(id: string): SwingReport | null {
  const reports = readStoredReports();
  return reports.find((report) => report.id === id) ?? null;
}

export function saveSwingReportLocal(report: SwingReport): SwingReport {
  const reports = readStoredReports();
  const nowIso = new Date().toISOString();

  const nextReport: SwingReport = {
    ...report,
    createdAt: report.createdAt || nowIso,
    updatedAt: report.updatedAt || nowIso,
  };

  const existingIndex = reports.findIndex((item) => item.id === nextReport.id);
  if (existingIndex >= 0) {
    reports[existingIndex] = {
      ...reports[existingIndex],
      ...nextReport,
      createdAt: reports[existingIndex].createdAt,
      updatedAt: nowIso,
    };
  } else {
    reports.push({
      ...nextReport,
      createdAt: nextReport.createdAt || nowIso,
      updatedAt: nowIso,
    });
  }

  writeStoredReports(reports);

  return getSwingReportLocal(nextReport.id) ?? {
    ...nextReport,
    updatedAt: nowIso,
  };
}

export function updateSwingReportLocal(
  id: string,
  updates: Partial<Omit<SwingReport, "id" | "createdAt">>,
): SwingReport | null {
  const reports = readStoredReports();
  const index = reports.findIndex((report) => report.id === id);

  if (index < 0) return null;

  const updated: SwingReport = {
    ...reports[index],
    ...updates,
    id,
    createdAt: reports[index].createdAt,
    updatedAt: new Date().toISOString(),
  };

  reports[index] = updated;
  writeStoredReports(reports);

  return getSwingReportLocal(id);
}

export function deleteSwingReportLocal(id: string): boolean {
  const reports = readStoredReports();
  const next = reports.filter((report) => report.id !== id);

  if (next.length === reports.length) {
    return false;
  }

  writeStoredReports(next);
  return true;
}

export function clearSwingReportsLocal(): void {
  if (!isClient()) return;

  try {
    localStorage.removeItem(SWING_REPORTS_STORAGE_KEY);
  } catch {
    // Ignore cleanup failures.
  }
}

export { SWING_REPORTS_STORAGE_KEY };
