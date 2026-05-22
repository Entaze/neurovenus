// src/components/researcher/ResearcherLayout.jsx

import { Link, useLocation, useNavigate } from "react-router-dom";
import { FolderOpen, Users, Download, UserPlus } from "lucide-react";

import ResearcherTopBar from "./ResearcherTopBar";
import { useResearcherAuth } from "../../hooks/useResearcherAuth";

const baseNavItems = [
  {
    label: "Studies",
    path: "/researcher/studies",
    icon: FolderOpen,
  },
  {
    label: "Participants",
    path: "/researcher/participants",
    icon: Users,
  },
  {
    label: "Exports",
    path: "/researcher/exports",
    icon: Download,
  },
];

export default function ResearcherLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { researcher, logout } = useResearcherAuth();

  const handleLogout = () => {
    logout();
    navigate("/researcher/login");
  };

  const topBarUser = {
    name: researcher?.name || "Researcher",
    email: researcher?.email || "",
  };

  const organization = {
    name:
      researcher?.organizationName ||
      researcher?.institution ||
      "Research Workspace",
    plan:
      researcher?.organizationPlan ||
      researcher?.plan ||
      "standard",
  };

  const canManageResearchers =
    ["pilot", "institutional", "custom"].includes(organization.plan) &&
    ["owner", "admin"].includes(researcher?.role);

  const visibleNavItems = canManageResearchers
    ? [
        baseNavItems[0],
        baseNavItems[1],
        {
          label: "Researchers",
          path: "/researcher/researchers",
          icon: UserPlus,
        },
        baseNavItems[2],
      ]
    : baseNavItems;

  return (
    <div style={styles.wrapper}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <img
            src="/neurovenus-icon.svg"
            alt="Neurovenus"
            style={styles.brandLogo}
          />

          <div>
            <h2 style={styles.logo}>Neurovenus</h2>
            <p style={styles.subtitle}>Researcher Portal</p>
          </div>
        </div>

        <nav style={styles.nav}>
          {visibleNavItems.map((item) => {
            const active =
              location.pathname === item.path ||
              location.pathname.startsWith(`${item.path}/`);

            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...styles.link,
                  ...(active ? styles.activeLink : {}),
                }}
              >
                <Icon size={17} strokeWidth={1.15} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <main style={styles.main}>
        <ResearcherTopBar
          user={topBarUser}
          organization={organization}
          onLogout={handleLogout}
        />

        <div style={styles.content}>{children}</div>
      </main>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    background: "#020817",
    color: "#ffffff",
    overflow: "hidden",
  },

  sidebar: {
    width: 240,
    padding: 20,
    borderRight: "1px solid rgba(255,255,255,0.06)",
    background: "#07111f",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 36,
  },

  brandLogo: {
    width: 42,
    height: 42,
    flexShrink: 0,
  },

  logo: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: "#ffffff",
  },

  subtitle: {
    margin: "4px 0 0",
    fontSize: 12,
    fontWeight: 500,
    color: "#94a3b8",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  link: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 12px",
    borderRadius: 8,
    color: "#cbd5e1",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
  },

  activeLink: {
    background: "rgba(14,165,233,0.10)",
    color: "#e2e8f0",
  },

  main: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },

  content: {
    flex: 1,
    padding: "24px 40px 40px",
  },
};