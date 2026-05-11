import { useState } from "react";
import { ResearcherAuthContext } from "./ResearcherAuthContextValue";

export function ResearcherAuthProvider({ children }) {
  const [researcher, setResearcher] = useState(() => {
    const saved = localStorage.getItem("cv_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = ({ token, user }) => {
    localStorage.setItem("cv_token", token);
    localStorage.setItem("cv_user", JSON.stringify(user));
    setResearcher(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem("cv_token");
    localStorage.removeItem("cv_user");
    localStorage.removeItem("researcherAuth");
    setResearcher(null);
  };

  return (
    <ResearcherAuthContext.Provider value={{ researcher, login, logout }}>
      {children}
    </ResearcherAuthContext.Provider>
  );
}