import { Navigate, Route, Routes } from "react-router-dom";

import ParticipantStart from "./pages/participant/ParticipantStart";
import ParticipantSession from "./pages/participant/ParticipantSession";
import SessionWait from "./pages/participant/SessionWait";
import SessionComplete from "./pages/participant/SessionComplete";
import ParticipantComplete from "./pages/participant/ParticipantComplete";

import ResearcherLogin from "./pages/researcher/ResearcherLogin";
import AcceptInvitePage from "./pages/researcher/AcceptInvitePage";
import ParticipantsPage from "./pages/researcher/ParticipantsPage";
import ExportsPage from "./pages/researcher/ExportsPage";
import ResearchersPage from "./pages/researcher/ResearchersPage";
import CreateStudyPage from "./pages/researcher/CreateStudyPage";
import StudyDetail from "./pages/researcher/StudyDetail";
import StudiesPage from "./pages/researcher/StudiesPage";
import FeedbackPage from "../src/components/researcher/FeedbackPage";
import AdminFeedbackPage from "../src/components/admin/AdminFeedbackPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import HelpPage from "./pages/HelpPage";
import OrganizationPage from "./pages/OrganizationPage";
import TeamPage from "./pages/TeamPage";
import BillingPage from "./pages/BillingPage";
import NotificationsPage from "./pages/NotificationsPage";

import { ResearcherAuthProvider } from "./context/ResearcherAuthContext";
import ResearcherProtectedRoute from "./routes/ResearcherProtectedRoute";


function App() {
  return (
    <ResearcherAuthProvider>
      <Routes>
        {/* <Route path="/" element={<Navigate to="/researcher/login" replace />} /> */}
        <Route path="/" element={<Navigate to="/researcher/participants" replace />} />

        <Route path="/participant/start" element={<ParticipantStart />} />
        <Route path="/participant/session" element={<ParticipantSession />} />
        <Route path="/participant/wait" element={<SessionWait />} />
        <Route path="/participant/session-complete" element={<SessionComplete />} />
        <Route path="/participant/complete" element={<ParticipantComplete />} />

        <Route path="/researcher/login" element={<ResearcherLogin />} />
        <Route path="/researcher/accept-invite" element={<AcceptInvitePage />} />

        <Route
          path="/researcher/dashboard"
          element={<Navigate to="/researcher/participants" replace />}
        />

        <Route
          path="/researcher/researchers"
          element={<ResearchersPage />}
        />

        <Route
          path="/researcher/studies"
          element={
            <ResearcherProtectedRoute>
              <StudiesPage />
            </ResearcherProtectedRoute>
          }
        />

        <Route
          path="/researcher/participants"
          element={
            <ResearcherProtectedRoute>
              <ParticipantsPage />
            </ResearcherProtectedRoute>
          }
        />

        <Route
          path="/researcher/exports"
          element={
            <ResearcherProtectedRoute>
              <ExportsPage />
            </ResearcherProtectedRoute>
          }
        />

        <Route
          path="/researcher/studies/new"
          element={
            <ResearcherProtectedRoute>
              <CreateStudyPage />
            </ResearcherProtectedRoute>
          }
        />

        <Route
          path="/researcher/studies/:studyId"
          element={
            <ResearcherProtectedRoute>
              <StudyDetail />
            </ResearcherProtectedRoute>
          }
        />

        <Route path="/researcher/feedback" element={<FeedbackPage />} />
        <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/organization" element={<OrganizationPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>
    </ResearcherAuthProvider>
  );
}

export default App;