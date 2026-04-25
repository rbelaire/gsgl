export type CameraView = "DTL" | "Face-On";

export interface FirstDrillRecommendation {
  title: string;
  purpose: string;
  setup: string;
  reps: string;
  successCheckpoint: string;
}

export interface SwingReport {
  id: string;
  createdAt: string;
  studentName: string;
  title: string;
  date: string;
  club: string;
  cameraView: CameraView;
  ballFlight: string;
  contactQuality: string;
  mainMiss: string;
  coachFocus: {
    priorityFix: string;
    summary: string;
    firstDrill: FirstDrillRecommendation;
  };
  video: {
    name: string;
    size: number;
    type: string;
  };
}

const STORAGE_KEY = "gsgl_swing_reports";
const MAX_REPORTS = 50;

export function saveSwingReport(report: SwingReport): SwingReport {
  const existing = loadSwingReports();
  const updated = [report, ...existing].slice(0, MAX_REPORTS);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable or quota exceeded — skip persistence
  }

  return report;
}

export function loadSwingReports(): SwingReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SwingReport[]) : [];
  } catch {
    return [];
  }
}

export function loadSwingReportById(reportId: string): SwingReport | null {
  const reports = loadSwingReports();
  return reports.find((report) => report.id === reportId) ?? null;
}
