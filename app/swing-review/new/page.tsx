"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { FormSectionWrapper } from "@/components/fit/FormSectionWrapper";
import { Stepper } from "@/components/fit/Stepper";
import { Button } from "@/components/ui/Button";
import { saveSwingReport, type CameraView, type SwingReport } from "@/lib/swing-report-storage";

const steps = ["Student", "Swing details", "Video upload", "Coach focus", "Review"];

const INPUT_CLS =
  "w-full rounded-md border border-gb-line bg-gb-input px-3 py-2 text-sm text-gb-text placeholder:text-gb-muted focus:outline-none focus:ring-2 focus:ring-gb-green/40";
const SELECT_CLS =
  "w-full rounded-md border border-gb-line bg-gb-input px-3 py-2 text-sm text-gb-text focus:outline-none focus:ring-2 focus:ring-gb-green/40";
const TEXTAREA_CLS =
  "w-full rounded-md border border-gb-line bg-gb-input px-3 py-2 text-sm text-gb-text placeholder:text-gb-muted focus:outline-none focus:ring-2 focus:ring-gb-green/40";
const ERROR_CLS = "mt-1 text-xs text-red-400";
const VIDEO_ACCEPT = "video/mp4,video/quicktime,video/webm,video/x-msvideo,.mov,.mp4,.webm,.avi";

type FieldErrors = Record<string, string>;

const studentSchema = z.object({
  studentName: z.string().trim().min(1, "Student name is required."),
});

const swingDetailsSchema = z.object({
  title: z.string().trim().min(1, "Report title is required."),
  date: z.string().trim().min(1, "Date is required."),
  club: z.string().trim().min(1, "Club is required."),
  cameraView: z.enum(["DTL", "Face-On"]),
  ballFlight: z.string().trim().min(1, "Ball flight is required."),
  contactQuality: z.string().trim().min(1, "Contact quality is required."),
  mainMiss: z.string().trim().min(1, "Main miss is required."),
});

const videoSchema = z.object({
  videoFile: z.instanceof(File, { message: "Please select a video file." }),
});

const coachFocusSchema = z.object({
  priorityFix: z.string().trim().min(1, "Priority fix is required."),
  summary: z.string().trim().min(1, "Summary is required."),
  drillTitle: z.string().trim().min(1, "Drill title is required."),
  drillPurpose: z.string().trim().min(1, "Drill purpose is required."),
  drillSetup: z.string().trim().min(1, "Drill setup is required."),
  drillReps: z.string().trim().min(1, "Reps are required."),
  drillSuccessCheckpoint: z.string().trim().min(1, "Success checkpoint is required."),
});

function parseErrors(err: unknown): FieldErrors {
  if (err && typeof err === "object" && "errors" in err) {
    const issues = (err as { errors: { path: (string | number)[]; message: string }[] }).errors;
    return Object.fromEntries(issues.map((issue) => [issue.path.join("."), issue.message]));
  }
  return {};
}

function formatFileSize(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function NewSwingReportPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const [studentName, setStudentName] = useState("");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [club, setClub] = useState("");
  const [cameraView, setCameraView] = useState<CameraView>("DTL");
  const [ballFlight, setBallFlight] = useState("");
  const [contactQuality, setContactQuality] = useState("");
  const [mainMiss, setMainMiss] = useState("");

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);

  const [priorityFix, setPriorityFix] = useState("");
  const [summary, setSummary] = useState("");
  const [drillTitle, setDrillTitle] = useState("");
  const [drillPurpose, setDrillPurpose] = useState("");
  const [drillSetup, setDrillSetup] = useState("");
  const [drillReps, setDrillReps] = useState("");
  const [drillSuccessCheckpoint, setDrillSuccessCheckpoint] = useState("");

  useEffect(() => {
    if (!videoFile) {
      setVideoPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(videoFile);
    setVideoPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [videoFile]);

  const reviewItems = useMemo(
    () => [
      { label: "Student", value: studentName || "—" },
      { label: "Report title", value: title || "—" },
      { label: "Date", value: date || "—" },
      { label: "Club", value: club || "—" },
      { label: "Camera view", value: cameraView },
      { label: "Ball flight", value: ballFlight || "—" },
      { label: "Contact quality", value: contactQuality || "—" },
      { label: "Main miss", value: mainMiss || "—" },
      { label: "Video", value: videoFile ? `${videoFile.name} (${formatFileSize(videoFile.size)})` : "No file selected" },
      { label: "Priority fix", value: priorityFix || "—" },
      { label: "Summary", value: summary || "—" },
      { label: "Drill title", value: drillTitle || "—" },
      { label: "Drill purpose", value: drillPurpose || "—" },
      { label: "Drill setup", value: drillSetup || "—" },
      { label: "Drill reps", value: drillReps || "—" },
      { label: "Success checkpoint", value: drillSuccessCheckpoint || "—" },
    ],
    [
      studentName,
      title,
      date,
      club,
      cameraView,
      ballFlight,
      contactQuality,
      mainMiss,
      videoFile,
      priorityFix,
      summary,
      drillTitle,
      drillPurpose,
      drillSetup,
      drillReps,
      drillSuccessCheckpoint,
    ],
  );

  function validateCurrentStep(): boolean {
    try {
      if (step === 0) {
        studentSchema.parse({ studentName });
      } else if (step === 1) {
        swingDetailsSchema.parse({
          title,
          date,
          club,
          cameraView,
          ballFlight,
          contactQuality,
          mainMiss,
        });
      } else if (step === 2) {
        videoSchema.parse({ videoFile: videoFile ?? undefined });
      } else if (step === 3) {
        coachFocusSchema.parse({
          priorityFix,
          summary,
          drillTitle,
          drillPurpose,
          drillSetup,
          drillReps,
          drillSuccessCheckpoint,
        });
      }

      setErrors({});
      setFormError(null);
      return true;
    } catch (err) {
      setErrors(parseErrors(err));
      setFormError("Please complete the required fields before continuing.");
      return false;
    }
  }

  function handleNext() {
    if (!validateCurrentStep()) return;
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  }

  function handleBack() {
    setErrors({});
    setFormError(null);
    setStep((prev) => Math.max(prev - 1, 0));
  }

  function handleVideoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setVideoFile(file);
    setErrors((prev) => {
      const rest = { ...prev };
      delete rest.videoFile;
      return rest;
    });
    setFormError(null);
  }

  function submitReport() {
    try {
      studentSchema.parse({ studentName });
      swingDetailsSchema.parse({
        title,
        date,
        club,
        cameraView,
        ballFlight,
        contactQuality,
        mainMiss,
      });
      videoSchema.parse({ videoFile: videoFile ?? undefined });
      coachFocusSchema.parse({
        priorityFix,
        summary,
        drillTitle,
        drillPurpose,
        drillSetup,
        drillReps,
        drillSuccessCheckpoint,
      });
      setErrors({});
      setFormError(null);
    } catch (err) {
      setErrors(parseErrors(err));
      setFormError("Please complete every section before creating the swing report.");
      return;
    }

    const reportId = `SR-${Date.now().toString(36).toUpperCase()}`;
    const report: SwingReport = {
      id: reportId,
      createdAt: new Date().toISOString(),
      studentName: studentName.trim(),
      title: title.trim(),
      date,
      club: club.trim(),
      cameraView,
      ballFlight: ballFlight.trim(),
      contactQuality: contactQuality.trim(),
      mainMiss: mainMiss.trim(),
      coachFocus: {
        priorityFix: priorityFix.trim(),
        summary: summary.trim(),
        firstDrill: {
          title: drillTitle.trim(),
          purpose: drillPurpose.trim(),
          setup: drillSetup.trim(),
          reps: drillReps.trim(),
          successCheckpoint: drillSuccessCheckpoint.trim(),
        },
      },
      video: {
        name: videoFile.name,
        size: videoFile.size,
        type: videoFile.type,
      },
    };

    saveSwingReport(report);
    router.push(`/swing-review/${reportId}`);
  }

  const e = (key: string) => (errors[key] ? <p className={ERROR_CLS}>{errors[key]}</p> : null);

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-gb-text">Create a new swing report</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-gb-muted">
        Build a structured report with player context, swing notes, and first-drill coaching guidance.
      </p>

      <div className="mt-8">
        <Stepper steps={steps} currentStep={step} />
      </div>

      {formError ? (
        <div className="mt-6 rounded-lg border border-red-500/40 bg-red-950/20 p-4 text-sm text-red-200">
          <p className="font-semibold">Validation error</p>
          <p className="mt-1">{formError}</p>
        </div>
      ) : null}

      <div className="mt-8">
        {step === 0 && (
          <FormSectionWrapper title="Student" description="Start by identifying the player for this report.">
            <div>
              <label className="mb-1 block text-xs font-medium text-gb-text" htmlFor="studentName">
                Student name
              </label>
              <input
                id="studentName"
                name="studentName"
                className={INPUT_CLS}
                value={studentName}
                onChange={(event) => setStudentName(event.target.value)}
                placeholder="e.g. Jordan Miller"
              />
              {e("studentName")}
            </div>
          </FormSectionWrapper>
        )}

        {step === 1 && (
          <FormSectionWrapper title="Swing details" description="Capture the key context for this swing review.">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-gb-text" htmlFor="title">
                  Report title
                </label>
                <input
                  id="title"
                  name="title"
                  className={INPUT_CLS}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Mid-iron path and strike review"
                />
                {e("title")}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gb-text" htmlFor="date">
                  Date
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  className={INPUT_CLS}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
                {e("date")}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gb-text" htmlFor="club">
                  Club
                </label>
                <input
                  id="club"
                  name="club"
                  className={INPUT_CLS}
                  value={club}
                  onChange={(event) => setClub(event.target.value)}
                  placeholder="e.g. 7 Iron"
                />
                {e("club")}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gb-text" htmlFor="cameraView">
                  Camera view
                </label>
                <select
                  id="cameraView"
                  name="cameraView"
                  className={SELECT_CLS}
                  value={cameraView}
                  onChange={(event) => setCameraView(event.target.value as CameraView)}
                >
                  <option value="DTL">DTL</option>
                  <option value="Face-On">Face-On</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gb-text" htmlFor="ballFlight">
                  Ball flight
                </label>
                <input
                  id="ballFlight"
                  name="ballFlight"
                  className={INPUT_CLS}
                  value={ballFlight}
                  onChange={(event) => setBallFlight(event.target.value)}
                  placeholder="e.g. Push draw"
                />
                {e("ballFlight")}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gb-text" htmlFor="contactQuality">
                  Contact quality
                </label>
                <input
                  id="contactQuality"
                  name="contactQuality"
                  className={INPUT_CLS}
                  value={contactQuality}
                  onChange={(event) => setContactQuality(event.target.value)}
                  placeholder="e.g. Slightly thin"
                />
                {e("contactQuality")}
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-medium text-gb-text" htmlFor="mainMiss">
                  Main miss
                </label>
                <input
                  id="mainMiss"
                  name="mainMiss"
                  className={INPUT_CLS}
                  value={mainMiss}
                  onChange={(event) => setMainMiss(event.target.value)}
                  placeholder="e.g. Block right"
                />
                {e("mainMiss")}
              </div>
            </div>
          </FormSectionWrapper>
        )}

        {step === 2 && (
          <FormSectionWrapper
            title="Video upload"
            description="Attach a video for review. The file stays in local component state and is not uploaded."
          >
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gb-text" htmlFor="videoFile">
                  Swing video
                </label>
                <input
                  id="videoFile"
                  name="videoFile"
                  type="file"
                  accept={VIDEO_ACCEPT}
                  className="block w-full text-sm text-gb-muted file:mr-4 file:rounded-md file:border file:border-gb-line file:bg-gb-panel file:px-3 file:py-2 file:text-sm file:font-semibold file:text-gb-text hover:file:bg-gb-bg"
                  onChange={handleVideoChange}
                />
                {e("videoFile")}
              </div>

              {videoFile ? (
                <div className="rounded-lg border border-gb-line bg-gb-bg/60 p-4 text-sm">
                  <p className="text-gb-text">
                    <span className="font-semibold">File:</span> {videoFile.name}
                  </p>
                  <p className="mt-1 text-gb-muted">
                    <span className="font-semibold text-gb-text">Size:</span> {formatFileSize(videoFile.size)}
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-gb-line bg-gb-bg/40 p-4 text-sm text-gb-muted">
                  No video selected yet.
                </div>
              )}

              {videoPreviewUrl ? (
                <div className="rounded-lg border border-gb-line bg-black/40 p-3">
                  <video src={videoPreviewUrl} controls className="max-h-[420px] w-full rounded-md" />
                </div>
              ) : null}
            </div>
          </FormSectionWrapper>
        )}

        {step === 3 && (
          <FormSectionWrapper
            title="Coach focus"
            description="Define the primary coaching direction and first drill recommendation."
          >
            <div className="grid gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gb-text" htmlFor="priorityFix">
                  Priority fix
                </label>
                <input
                  id="priorityFix"
                  name="priorityFix"
                  className={INPUT_CLS}
                  value={priorityFix}
                  onChange={(event) => setPriorityFix(event.target.value)}
                  placeholder="e.g. Improve lead-side pressure by P5"
                />
                {e("priorityFix")}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gb-text" htmlFor="summary">
                  Summary
                </label>
                <textarea
                  id="summary"
                  name="summary"
                  rows={4}
                  className={TEXTAREA_CLS}
                  value={summary}
                  onChange={(event) => setSummary(event.target.value)}
                  placeholder="Short coaching summary for this session."
                />
                {e("summary")}
              </div>

              <div className="rounded-xl border border-gb-line bg-gb-bg/40 p-4">
                <p className="text-sm font-semibold text-gb-text">First drill recommendation</p>
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gb-text" htmlFor="drillTitle">
                      Title
                    </label>
                    <input
                      id="drillTitle"
                      name="drillTitle"
                      className={INPUT_CLS}
                      value={drillTitle}
                      onChange={(event) => setDrillTitle(event.target.value)}
                      placeholder="e.g. Step-through pressure drill"
                    />
                    {e("drillTitle")}
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gb-text" htmlFor="drillReps">
                      Reps
                    </label>
                    <input
                      id="drillReps"
                      name="drillReps"
                      className={INPUT_CLS}
                      value={drillReps}
                      onChange={(event) => setDrillReps(event.target.value)}
                      placeholder="e.g. 3 sets of 8 swings"
                    />
                    {e("drillReps")}
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-gb-text" htmlFor="drillPurpose">
                      Purpose
                    </label>
                    <textarea
                      id="drillPurpose"
                      name="drillPurpose"
                      rows={2}
                      className={TEXTAREA_CLS}
                      value={drillPurpose}
                      onChange={(event) => setDrillPurpose(event.target.value)}
                      placeholder="What this drill should improve."
                    />
                    {e("drillPurpose")}
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-gb-text" htmlFor="drillSetup">
                      Setup
                    </label>
                    <textarea
                      id="drillSetup"
                      name="drillSetup"
                      rows={2}
                      className={TEXTAREA_CLS}
                      value={drillSetup}
                      onChange={(event) => setDrillSetup(event.target.value)}
                      placeholder="How to set up the station and motion."
                    />
                    {e("drillSetup")}
                  </div>

                  <div className="md:col-span-2">
                    <label
                      className="mb-1 block text-xs font-medium text-gb-text"
                      htmlFor="drillSuccessCheckpoint"
                    >
                      Success checkpoint
                    </label>
                    <textarea
                      id="drillSuccessCheckpoint"
                      name="drillSuccessCheckpoint"
                      rows={2}
                      className={TEXTAREA_CLS}
                      value={drillSuccessCheckpoint}
                      onChange={(event) => setDrillSuccessCheckpoint(event.target.value)}
                      placeholder="How the player knows they are doing it correctly."
                    />
                    {e("drillSuccessCheckpoint")}
                  </div>
                </div>
              </div>
            </div>
          </FormSectionWrapper>
        )}

        {step === 4 && (
          <FormSectionWrapper title="Review" description="Confirm the report details before creating it.">
            <div className="rounded-xl border border-gb-line bg-gb-bg/40 p-5">
              <h3 className="text-base font-semibold text-gb-text">Swing report summary</h3>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {reviewItems.map((item) => (
                  <div key={item.label} className="rounded-lg border border-gb-line bg-gb-panel p-3">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gb-muted">{item.label}</dt>
                    <dd className="mt-1 text-sm text-gb-text">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </FormSectionWrapper>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button variant="secondary" onClick={handleBack} disabled={step === 0}>
          Back
        </Button>
        {step < steps.length - 1 ? (
          <Button onClick={handleNext}>Next Step</Button>
        ) : (
          <Button onClick={submitReport}>Create Swing Report</Button>
        )}
      </div>
    </main>
  );
}
