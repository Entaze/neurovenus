import { Navigate, Route, Routes } from "react-router-dom";

import ParticipantStart from "./pages/participant/ParticipantStart";
import ParticipantSession from "./pages/participant/ParticipantSession";
import SessionWait from "./pages/participant/SessionWait";
import SessionComplete from "./pages/participant/SessionComplete";
import ParticipantComplete from "./pages/participant/ParticipantComplete";

import ResearcherLogin from "./pages/researcher/ResearcherLogin";
import ParticipantsPage from "./pages/researcher/ParticipantsPage";
import ExportsPage from "./pages/researcher/ExportsPage";
import CreateStudyPage from "./pages/researcher/CreateStudyPage";
import StudyDetail from "./pages/researcher/StudyDetail";
import StudiesPage from "./pages/researcher/StudiesPage";

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

        <Route
          path="/researcher/dashboard"
          element={<Navigate to="/researcher/participants" replace />}
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
      </Routes>
    </ResearcherAuthProvider>
  );
}

export default App;