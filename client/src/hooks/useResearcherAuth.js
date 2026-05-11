import { useContext } from "react";
import { ResearcherAuthContext } from "../context/ResearcherAuthContextValue";

export function useResearcherAuth() {
  const context = useContext(ResearcherAuthContext);

  if (!context) {
    throw new Error(
      "useResearcherAuth must be used inside ResearcherAuthProvider"
    );
  }

  return context;
}