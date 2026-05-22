export const helpArticles = [
  {
    id: "getting-started",
    category: "Getting Started",
    title: "Getting started with Neurovenus",
    summary:
      "Understand the basic workflow for creating protocols, recruiting participants, and exporting research data.",
    content: [
      "Neurovenus helps researchers run remote cognitive and sleep research workflows from one structured workspace.",
      "The typical workflow is: create a research protocol, configure sessions, select assessments, recruit participants, monitor progress, and export analysis-ready data.",
      "Participants do not need Neurovenus accounts. Each participant receives a secure access link for their assigned protocol sessions.",
    ],
  },
  {
    id: "create-protocol",
    category: "Protocols",
    title: "Create your first protocol",
    summary:
      "Set up a structured research protocol with sessions, assessments, and timing rules.",
    content: [
      "Go to Studies and select New Protocol.",
      "Enter the protocol title and description. Use a clear title that matches your study or pilot project.",
      "Add one or more sessions, then choose the assessments each session should include.",
      "Protocols are locked after creation to preserve data integrity. To make major changes later, create a new protocol version.",
    ],
  },
  {
    id: "invite-participants",
    category: "Participants",
    title: "Recruit participants",
    summary:
      "Learn how participant invitations and secure access links work.",
    content: [
      "Go to Participants and select the protocol you want to use.",
      "Enter the participant email address and send the invitation.",
      "Neurovenus creates a secure participant link. Participants do not need to create accounts.",
      "Each participant receives a unique access link for their assigned sessions. This helps keep participant access separate from researcher accounts.",
    ],
  },
  {
    id: "sessions",
    category: "Sessions",
    title: "Understanding protocol sessions",
    summary:
      "Learn how multi-session protocols and delayed session access work.",
    content: [
      "A protocol can contain one or more sessions.",
      "Session 1 is usually available immediately after the participant opens their invitation link.",
      "Later sessions can open after a configured delay, such as 5 minutes, 24 hours, or several days.",
      "This supports longitudinal, repeated-measures, and multi-stage cognitive or sleep research designs.",
    ],
  },
  {
    id: "exports",
    category: "Exports",
    title: "Exporting analysis-ready data",
    summary:
      "Download participant, session, assessment, and trial-level data for analysis.",
    content: [
      "Go to Exports and select the protocol you want to export.",
      "Select a participant to export their full dataset, or export specific session and assessment-level data where available.",
      "Exports are structured for statistical analysis in tools such as SPSS, R, Python, or Excel.",
      "Depending on the assessment, exports may include participant records, session timing, assessment summaries, scoring outputs, and trial-level responses.",
    ],
  },
  {
    id: "assessments",
    category: "Assessments",
    title: "Supported assessments",
    summary:
      "Overview of cognitive and sleep assessments currently supported by Neurovenus.",
    content: [
      "Neurovenus currently supports cognitive and sleep assessments such as AVLT, N-Back, Finger Tapping, Stroop, Digit Span, and PSQI, depending on your configured protocol.",
      "Assessment outputs are captured in a structured format so they can be exported for analysis.",
      "Where supported, Neurovenus can store scoring summaries alongside trial-level or response-level data.",
    ],
  },
  {
    id: "data-integrity",
    category: "Data Integrity",
    title: "Why protocols are locked after creation",
    summary:
      "Understand how locked protocols help preserve consistency and reproducibility.",
    content: [
      "Once a protocol is created, it is locked to protect the integrity of collected data.",
      "Changing assessments, session timing, or protocol structure after participants have started can make results difficult to compare.",
      "If your study design changes, create a new protocol version instead of editing the existing one.",
      "This helps preserve reproducibility across participants and sessions.",
    ],
  },
  {
    id: "institutional-workspaces",
    category: "Institutional",
    title: "Managing institutional workspaces",
    summary:
      "How institutional workspaces support multiple researchers under one subscription.",
    content: [
      "Institutional workspaces allow approved researchers to use Neurovenus under the same institutional subscription.",
      "Workspace owners and admins can invite researchers and manage access.",
      "Each researcher has their own account and private research data by default.",
      "This keeps billing and workspace access centralized while preserving researcher-level data privacy.",
    ],
  },
  {
    id: "feedback",
    category: "Support",
    title: "Send feedback or report an issue",
    summary:
      "Send feedback, bug reports, and screenshots to the Neurovenus team.",
    content: [
      "Open the account menu and select Send Feedback.",
      "Choose the feedback type, enter a short summary, describe the issue or suggestion, and attach a screenshot if helpful.",
      "Your feedback is sent to the Neurovenus team for review.",
      "For pilot users, feedback is especially valuable because it helps shape the platform before wider release.",
    ],
  },
];