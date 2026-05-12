// src/components/researcher/ResearcherLayout.jsx

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useResearcherAuth } from "../../hooks/useResearcherAuth";

const navItems = [
  { label: "Participants", path: "/researcher/participants" },
  { label: "Studies", path: "/researcher/studies" },
  { label: "Exports", path: "/researcher/exports" },
];

export default function ResearcherLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useResearcherAuth();

  const handleLogout = () => {
    logout();
    navigate("/researcher/login");
  };

  return (
    <div style={styles.wrapper}>
      <aside style={styles.sidebar}>
        <div>
          <h2 style={styles.logo}>Neurovenus</h2>
          <p style={styles.subtitle}>Researcher Portal</p>
        </div>

        <nav style={styles.nav}>
          {navItems.map((item) => {
            const active =
              location.pathname === item.path ||
              location.pathname.startsWith(`${item.path}/`);

            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...styles.link,
                  ...(active ? styles.activeLink : {}),
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </aside>

      <main style={styles.main}>{children}</main>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    background:
      "radial-gradient(circle at top left, rgba(6,182,212,0.18), transparent 30%), #080d1a",
    color: "#ffffff",
  },

  sidebar: {
    width: 260,
    padding: 24,
    borderRight: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    display: "flex",
    flexDirection: "column",
  },

  logo: {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
  },

  subtitle: {
    marginTop: 6,
    marginBottom: 32,
    color: "#94a3b8",
    fontSize: 13,
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  link: {
    padding: "12px 14px",
    borderRadius: 10,
    color: "#cbd5e1",
    textDecoration: "none",
    fontSize: 14,
  },

  activeLink: {
    background: "rgba(6,182,212,0.14)",
    color: "#67e8f9",
  },

  logoutButton: {
    marginTop: "auto",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    cursor: "pointer",
  },

  main: {
    flex: 1,
    padding: 32,
    overflowY: "auto",
  },
};