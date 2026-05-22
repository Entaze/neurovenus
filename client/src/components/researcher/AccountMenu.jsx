// src/components/researcher/AccountMenu.jsx

import { useEffect, useRef } from "react";
import {
  Building2,
  MessageSquare,
  CircleHelp,
  LogOut,
} from "lucide-react";
import "./AccountMenu.css";

function formatPlan(plan = "") {
  if (!plan) return "Workspace";

  return plan
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getInitialFromName(name = "") {
  if (!name) return "U";

  const titles = ["dr", "prof", "professor", "mr", "mrs", "ms", "miss", "mx"];
  const parts = name.trim().split(/\s+/);

  const firstNonTitle =
    parts.find(
      (part) => !titles.includes(part.toLowerCase().replace(/\./g, ""))
    ) || parts[0];

  return firstNonTitle.charAt(0).toUpperCase();
}

export default function AccountMenu({
  open,
  onClose,
  onLogout,
  user = {},
  organization = {},
  parentRef,
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      const clickedInsideMenu =
        menuRef.current?.contains(event.target);

      const clickedInsideParent =
        parentRef?.current?.contains(event.target);

      if (!clickedInsideMenu && !clickedInsideParent) {
        onClose?.();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose, parentRef]);

  const displayName = user?.name || "Researcher";
  const email = user?.email || "";
  const rawPlan =
    organization?.plan ||
    user?.organizationPlan ||
    user?.plan ||
    "standard";

  const plan = formatPlan(rawPlan);

  const isCollaborativeWorkspace = [
    "pilot",
    "institutional",
    "custom",
  ].includes(rawPlan);

  const orgName = isCollaborativeWorkspace
    ? organization?.name ||
      user?.organizationName ||
      user?.institution ||
      "Research Workspace"
    : user?.institution || "Independent Researcher";

  const initial = getInitialFromName(displayName);

  const handleOrganization = () => {
    window.open(
      "/organization",
      "_blank",
      "noopener,noreferrer"
    );
    onClose?.();
  };

  const handleFeedback = () => {
    window.open("/researcher/feedback", "_blank", "noopener,noreferrer");
    onClose?.();
  };

  const handleHelp = () => {
    window.open("/help", "_blank", "noopener,noreferrer");
    onClose?.();
  };

  const menuItems = [
    {
      icon: MessageSquare,
      label: "Send Feedback",
      onClick: handleFeedback,
    },
    {
      icon: CircleHelp,
      label: "Help & Documentation",
      onClick: handleHelp,
    },
  ];

  return (
    <div
      ref={menuRef}
      style={{
        ...styles.menu,
        ...(open ? styles.menuOpen : styles.menuClosed),
      }}
    >
      <div style={styles.header}>
        <div style={styles.avatar}>{initial}</div>
        <div style={styles.name}>{displayName}</div>
        {email && <div style={styles.email}>{email}</div>}
      </div>

      <div style={styles.divider} />

      <div
        className="account-menu-item"
        style={{
          cursor: isCollaborativeWorkspace ? "pointer" : "default",
        }}
        onClick={
          isCollaborativeWorkspace
            ? handleOrganization
            : undefined
        }
      >
        <Building2 size={18} strokeWidth={1.8} style={styles.menuIcon} />

        <div style={styles.menuText}>
          <div style={styles.menuLabel}>{orgName}</div>

          <div style={styles.orgMetaRow}>
            <span style={styles.menuSubtitle}>
              {isCollaborativeWorkspace
                ? `${plan} workspace`
                : `${plan} plan`}
            </span>
            <span style={styles.planBadge}>{plan}</span>
          </div>
        </div>
      </div>

      <div style={styles.divider} />

      <div style={styles.section}>
        {menuItems.slice(0, 2).map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              className="account-menu-item"
              onClick={item.onClick}
            >
              <Icon size={17} strokeWidth={1.8} style={styles.menuIcon} />
              <span style={styles.menuLabel}>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div style={styles.divider} />

      <div style={styles.section}>
        {menuItems.slice(2).map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              className="account-menu-item"
              onClick={item.onClick}
            >
              <Icon size={17} strokeWidth={1.8} style={styles.menuIcon} />
              <span style={styles.menuLabel}>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div style={styles.divider} />

      <button
        type="button"
        className="account-menu-item"
        onClick={onLogout}
      >
        <LogOut size={17} strokeWidth={1.8} style={styles.logoutIcon} />
        <span style={styles.logoutLabel}>Log out</span>
      </button>
    </div>
  );
}

const styles = {
  menu: {
    position: "absolute",
    top: "calc(100% + 12px)",
    right: 0,
    width: 320,
    background: "#ffffff",
    color: "#0f172a",
    borderRadius: 20,
    boxShadow: "0 24px 60px rgba(2, 8, 23, 0.28)",
    border: "1px solid rgba(15, 23, 42, 0.08)",
    overflow: "hidden",
    zIndex: 1000,
    transformOrigin: "top right",
    transition: "opacity 0.58s ease, transform 0.58s ease, visibility 0.58s ease",
  },

  menuOpen: {
    opacity: 1,
    visibility: "visible",
    transform: "translateY(0) scale(1)",
    pointerEvents: "auto",
  },

  menuClosed: {
    opacity: 0,
    visibility: "hidden",
    transform: "translateY(-6px) scale(0.98)",
    pointerEvents: "none",
  },

  header: {
    padding: "28px 24px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "#64748b",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 16,
  },

  name: {
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: "#0f172a",
    marginBottom: 6,
    lineHeight: 1.1,
  },

  email: {
    fontSize: 14,
    color: "#64748b",
  },

  divider: {
    height: 1,
    background: "#e2e8f0",
  },

  section: {
    padding: "8px 0",
  },

  menuIcon: {
    color: "#64748b",
    flexShrink: 0,
  },

  logoutIcon: {
    flexShrink: 0,
  },

  menuText: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    minWidth: 0,
  },

  menuLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: "#0f172a",
    lineHeight: 1.3,
  },

  menuSubtitle: {
    fontSize: 12,
    color: "#64748b",
  },

  orgMetaRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },

  planBadge: {
    padding: "2px 7px",
    borderRadius: 999,
    background: "rgba(37,99,235,0.08)",
    color: "#2563eb",
    fontSize: 10,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },

  logoutLabel: {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.3,
  },
};