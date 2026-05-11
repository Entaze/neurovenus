import { Navigate } from "react-router-dom";
import { useResearcherAuth } from "../hooks/useResearcherAuth";

export default function ResearcherProtectedRoute({ children }) {
  const { researcher } = useResearcherAuth();

  if (!researcher) {
    return <Navigate to="/researcher/login" replace />;
  }

  return children;
}