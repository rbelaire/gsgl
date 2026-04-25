import type { SwingReport } from "./types";

export const MOCK_SWING_REPORTS: SwingReport[] = [
  {
    id: "swing-report-dtl-001",
    userId: "coach-demo",
    studentName: "Ethan Carter",
    title: "7-Iron DTL Check-in",
    date: "2026-04-12",
    club: "7-Iron",
    cameraView: "dtl",
    ballFlight: "Push-draw that starts right of target",
    contactQuality: "Centered 7/10 with occasional high-face strikes",
    mainMiss: "Block to the right when tempo speeds up",
    priorityFix: "Keep hands deeper in transition to shallow without standing up",
    summary:
      "At the top, Ethan gets the club across the line and immediately throws the handle out. From DTL his trail hip also moves toward the ball, which crowds space and leaves the face open. Better reps came when he felt his trail pocket stay back while the hands worked down behind him.",
    videos: [
      {
        id: "video-dtl-001",
        fileName: "ethan-7i-dtl.mp4",
        fileType: "video/mp4",
        fileSize: 25400000,
        storagePath: "swing-reviews/ethan/2026-04-12/7i-dtl.mp4",
        downloadUrl: "https://example.com/mock/ethan-7i-dtl.mp4",
        uploadedAt: "2026-04-12T14:08:00.000Z",
      },
    ],
    frames: [
      {
        id: "frame-dtl-top",
        videoId: "video-dtl-001",
        position: "top",
        timestamp: 1.24,
        drawings: [],
        notes:
          "Club points right of target line at the top. Feel a shorter arm swing with chest finishing the turn before the hands keep traveling.",
        createdAt: "2026-04-12T14:09:00.000Z",
        updatedAt: "2026-04-12T14:09:00.000Z",
      },
      {
        id: "frame-dtl-downswing",
        videoId: "video-dtl-001",
        position: "shaft_parallel_downswing",
        timestamp: 1.48,
        drawings: [],
        notes:
          "Trail hip loses depth early. Rehearse transition with the trail glute staying on the wall while the hands fall under the shoulder plane.",
        createdAt: "2026-04-12T14:10:00.000Z",
        updatedAt: "2026-04-12T14:10:00.000Z",
      },
    ],
    drills: [
      {
        id: "drill-ethan-stepaway",
        title: "Step-Away Transition Rehearsal",
        purpose: "Improve hand depth and prevent early extension",
        setup: "Address a ball with feet together, then step trail foot back slightly before starting down.",
        reps: "3 sets of 8 swings at 60-70% speed",
        successCheckpoint:
          "Down-the-line video shows hands below trail shoulder at shaft parallel with hips staying back.",
      },
      {
        id: "drill-ethan-chair",
        title: "Chair Hip-Depth Drill",
        purpose: "Maintain pelvis depth through transition and impact",
        setup: "Stand with glutes lightly touching a chair and make slow-motion to half-speed swings.",
        reps: "2 sets of 10 rehearsal swings, then 10 balls",
        successCheckpoint:
          "Trail glute keeps contact through early downswing; start line stays closer to target.",
      },
    ],
    createdAt: "2026-04-12T14:05:00.000Z",
    updatedAt: "2026-04-12T14:12:00.000Z",
  },
  {
    id: "swing-report-faceon-001",
    userId: "coach-demo",
    studentName: "Maya Thompson",
    title: "Driver Face-On Speed Session",
    date: "2026-04-18",
    club: "Driver",
    cameraView: "face_on",
    ballFlight: "High fade with occasional weak cut",
    contactQuality: "Heel-biased strikes; launch acceptable",
    mainMiss: "Low-spin wipey fade when timing is late",
    priorityFix: "Stabilize sternum and pressure shift so low point stays behind the ball",
    summary:
      "Maya creates speed well, but from face-on she drifts toward the target in backswing and then hangs on lead side too early. That steepens the handle and pushes strike toward the heel. Best swings were with centered sternum at the top and pressure moving into lead heel before delivery.",
    videos: [
      {
        id: "video-faceon-001",
        fileName: "maya-driver-faceon.mov",
        fileType: "video/quicktime",
        fileSize: 31850000,
        storagePath: "swing-reviews/maya/2026-04-18/driver-faceon.mov",
        downloadUrl: "https://example.com/mock/maya-driver-faceon.mov",
        uploadedAt: "2026-04-18T17:33:00.000Z",
      },
    ],
    frames: [
      {
        id: "frame-faceon-address",
        videoId: "video-faceon-001",
        position: "address",
        timestamp: 0.12,
        drawings: [],
        notes:
          "Solid setup, but ball is a half-ball too far back for current pattern. Move ball forward to help launch with upward strike.",
        createdAt: "2026-04-18T17:35:00.000Z",
        updatedAt: "2026-04-18T17:35:00.000Z",
      },
      {
        id: "frame-faceon-impact",
        videoId: "video-faceon-001",
        position: "impact",
        timestamp: 1.02,
        drawings: [],
        notes:
          "Chest outraces arms and handle gets high through strike. Feel lead heel pressure before unwinding and keep right shoulder lower through impact.",
        createdAt: "2026-04-18T17:36:00.000Z",
        updatedAt: "2026-04-18T17:36:00.000Z",
      },
    ],
    drills: [
      {
        id: "drill-maya-stepthrough",
        title: "Step-Through Driver Drill",
        purpose: "Sequence pressure shift and prevent upper-body lunge",
        setup: "Start with feet together, swing to the top, and step lead foot toward target before delivery.",
        reps: "3 sets of 6 balls with full pre-shot routine",
        successCheckpoint:
          "Impact frame shows head staying behind the ball with reduced heel contact.",
      },
      {
        id: "drill-maya-tee-gate",
        title: "Heel Strike Tee Gate",
        purpose: "Center strike and neutralize wipey fade",
        setup: "Place an outside tee just beyond heel side of the driver head and miss it through impact.",
        reps: "20 balls, reset gate every 5 swings",
        successCheckpoint:
          "At least 14/20 strikes finish center-to-slight-toe with tighter start lines.",
      },
    ],
    createdAt: "2026-04-18T17:30:00.000Z",
    updatedAt: "2026-04-18T17:39:00.000Z",
  },
];
