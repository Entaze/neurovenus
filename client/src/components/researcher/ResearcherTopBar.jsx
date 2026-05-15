// src/components/researcher/ResearcherTopBar.jsx

import { useState, useRef } from "react";
import {
  CircleHelp,
  CreditCard,
  UserPlus,
  Bell,
  Grid3X3,
  ChevronDown,
} from "lucide-react";
import AccountMenu from "./AccountMenu";
import "./ResearcherTopBar.css";

const toolbarItems = [
  {
    icon: CircleHelp,
    label: "Support",
    onClick: () =>
      window.open("/help", "_blank", "noopener,noreferrer"),
  },
  {
    icon: CreditCard,
    label: "Billing",
    onClick: () =>
      window.open("/billing", "_blank", "noopener,noreferrer"),
  },
  {
    icon: UserPlus,
    label: "Team Members",
    onClick: () =>
      window.open("/team", "_blank", "noopener,noreferrer"),
  },
  {
    icon: Bell,
    label: "Notifications",
    onClick: () =>
      window.open(
        "/notifications",
        "_blank",
        "noopener,noreferrer"
      ),
  },
  {
    icon: Grid3X3,
    label: "Organization",
    onClick: () =>
      window.open(
        "/organization",
        "_blank",
        "noopener,noreferrer"
      ),
  },
];

function getInitialFromName(name = "") {
  if (!name) return "U";

  const titles = [
    "dr",
    "prof",
    "professor",
    "mr",
    "mrs",
    "ms",
    "miss",
    "mx",
  ];

  const parts = name.trim().split(/\s+/);

  const firstNonTitle =
    parts.find(
      (part) => !titles.includes(part.toLowerCase().replace(/\./g, ""))
    ) || parts[0];

  return firstNonTitle.charAt(0).toUpperCase();
}

function formatPlan(plan = "") {
  if (!plan) return "Pilot";

  return plan
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeUser(user = {}) {
  return {
    id: user.id || user._id || "",
    name: user.name || "Researcher",
    email: user.email || "",
    role: user.role || "researcher",
    institution: user.institution || "",
    plan: user.plan || "pilot",
    isActive: user.isActive ?? true,
    mustChangePassword: Boolean(user.mustChangePassword),
    lastLoginAt: user.lastLoginAt || null,
  };
}

function normalizeOrganization(user = {}, organization = {}) {
  const plan = organization.plan || user.plan || "pilot";

  return {
    name:
      organization.name ||
      user.organizationName ||
      user.institution ||
      "Pilot Workspace Org",
    plan,
    planLabel: formatPlan(plan),
    accessStatus:
      organization.accessStatus ||
      user.accessStatus ||
      (plan === "pilot" ? "pilot" : "subscribed"),
  };
}

export default function ResearcherTopBar({
  organization,
  user = {},
  onLogout,
}) {
  const [accountOpen, setAccountOpen] = useState(false);
  const accountWrapRef = useRef(null);

  const normalizedUser = normalizeUser(user);
  const normalizedOrganization = normalizeOrganization(
    normalizedUser,
    organization
  );

  const initial = getInitialFromName(normalizedUser.name);

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <div style={styles.contextBlock}>
          <div style={styles.label}>Organization</div>

          <div style={styles.valueRow}>
            <span style={styles.value}>
              {normalizedOrganization.name}
            </span>

            <span style={styles.planBadge}>
              {normalizedOrganization.planLabel}
            </span>

            <ChevronDown
              size={14}
              strokeWidth={2}
              style={styles.chevron}
            />
          </div>
        </div>
      </div>

      <div style={styles.right}>
        {toolbarItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              className="topbar-icon-button"
              aria-label={item.label}
              onClick={item.onClick}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span className="topbar-tooltip">{item.label}</span>
            </button>
          );
        })}

        <div ref={accountWrapRef} style={styles.accountWrap}>
          <button
            type="button"
            style={styles.avatarButton}
            onClick={() => setAccountOpen((prev) => !prev)}
            aria-label="Account"
          >
            <div style={styles.avatar}>{initial}</div>
          </button>

          <AccountMenu
            open={accountOpen}
            onClose={() => setAccountOpen(false)}
            user={normalizedUser}
            organization={normalizedOrganization}
            parentRef={accountWrapRef}
            onLogout={() => {
              setAccountOpen(false);
              onLogout?.();
            }}
          />
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px 0 28px",
    background: "#07111f",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  left: {
    display: "flex",
    alignItems: "center",
    minWidth: 0,
  },

  contextBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    minWidth: 0,
  },

  label: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#94a3b8",
  },

  valueRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    minWidth: 0,
  },

  value: {
    fontSize: 16,
    fontWeight: 600,
    color: "#ffffff",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 420,
  },

  planBadge: {
    padding: "3px 8px",
    borderRadius: 999,
    background: "rgba(59,130,246,0.14)",
    border: "1px solid rgba(59,130,246,0.24)",
    color: "#93c5fd",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    flexShrink: 0,
  },

  chevron: {
    color: "#94a3b8",
    flexShrink: 0,
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
  },

  accountWrap: {
    position: "relative",
  },

  avatarButton: {
    border: "none",
    background: "transparent",
    padding: 0,
    marginLeft: 6,
    cursor: "pointer",
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#64748b",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
  },
};