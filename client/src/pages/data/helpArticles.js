export const helpArticles = [
  {
    id: "getting-started",
    category: "Getting Started",
    title: "Getting started with Neurovenus",
    summary: "Learn the basic workflow for creating studies and collecting participant data.",
    content: [
      "Neurovenus helps researchers create remote cognitive and sleep studies, invite participants, monitor progress, and export analysis-ready data.",
      "The typical workflow is: create a study, configure sessions, select assessments, invite participants, monitor progress, and export the completed data.",
    ],
  },
  {
    id: "create-study",
    category: "Studies",
    title: "Create your first study",
    summary: "How to set up a study protocol and configure sessions.",
    content: [
      "Go to Studies and select New Study.",
      "Enter the study title and description.",
      "Add one or more sessions, then choose the assessments each session should include.",
      "Once a study is created, its protocol is locked to preserve data integrity. To make major changes later, create a new study version.",
    ],
  },
  {
    id: "invite-participants",
    category: "Participants",
    title: "Invite participants",
    summary: "How participant invitations and secure access links work.",
    content: [
      "Go to Participants and select the active study.",
      "Enter the participant email address and send the invitation.",
      "Neurovenus creates a secure participant link. Participants do not need to create accounts.",
      "Each participant receives a unique access link for their assigned study sessions.",
    ],
  },
  {
    id: "sessions",
    category: "Sessions",
    title: "Understanding study sessions",
    summary: "How multi-session studies and delayed sessions work.",
    content: [
      "A study can contain one or more sessions.",
      "Session 1 is usually available immediately after the participant opens their invitation link.",
      "Later sessions can open after a configured delay, such as 5 minutes, 24 hours, or several days.",
      "This supports longitudinal or multi-stage study designs.",
    ],
  },
  {
    id: "exports",
    category: "Exports",
    title: "Exporting study data",
    summary: "How to download participant, session, task, and trial-level data.",
    content: [
      "Go to Exports and select the study you want to export.",
      "Download the CSV export when participant data is available.",
      "Exports are designed to be analysis-ready and may include participant records, session runs, task runs, and trial-level results.",
    ],
  },
  {
    id: "assessments",
    category: "Assessments",
    title: "Supported assessments",
    summary: "Overview of assessments currently supported by Neurovenus.",
    content: [
      "The current pilot platform supports assessments such as AVLT, N-Back, Finger Tapping, Stroop, Digit Span, and PSQI depending on your configured protocol.",
      "Assessment outputs are captured in a structured format so they can be exported for analysis.",
    ],
  },
  {
    id: "feedback",
    category: "Support",
    title: "Send feedback or report an issue",
    summary: "How to send feedback, bug reports, and screenshots to the Neurovenus team.",
    content: [
      "Open the account menu and select Send Feedback.",
      "Choose the feedback type, enter a short summary, describe the issue or suggestion, and attach a screenshot if helpful.",
      "Your feedback is sent to the Neurovenus team for review.",
    ],
  },
];