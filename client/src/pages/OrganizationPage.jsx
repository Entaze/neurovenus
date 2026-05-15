// src/pages/OrganizationPage.jsx

import {
  Building2,
  Shield,
  CreditCard,
  Activity,
  MessageSquare,
  CircleHelp,
  CheckCircle2,
} from "lucide-react";
import { useResearcherAuth } from "../hooks/useResearcherAuth";

function formatLabel(value = "") {
  if (!value) return "-";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function OrganizationPage() {
  const { user } = useResearcherAuth();

  const organizationName =
    user?.organizationName ||
    user?.institution ||
    "Pilot Workspace Org";

  const plan = formatLabel(user?.plan || "pilot");
  const role = formatLabel(user?.role || "researcher");
  const status = user?.isActive === false ? "Inactive" : "Active";

  const usage = [
    {
      label: "Studies",
      value: "—",
      icon: Activity,
    },
    {
      label: "Participants",
      value: "—",
      icon: Activity,
    },
    {
      label: "Exports",
      value: "—",
      icon: Activity,
    },
  ];

  const supportActions = [
    {
      label: "Send Feedback",
      description:
        "Report bugs, request features, or share suggestions.",
      icon: MessageSquare,
      onClick: () =>
        window.open(
          "/researcher/feedback",
          "_blank",
          "noopener,noreferrer"
        ),
    },
    {
      label: "Help & Documentation",
      description:
        "Browse setup guides, FAQs, and troubleshooting articles.",
      icon: CircleHelp,
      onClick: () =>
        window.open(
          "/help",
          "_blank",
          "noopener,noreferrer"
        ),
    },
  ];

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroIcon}>
          <Building2 size={28} strokeWidth={1.8} />
        </div>

        <div>
          <p style={styles.eyebrow}>Organization</p>
          <h1 style={styles.title}>{organizationName}</h1>
          <p style={styles.subtitle}>
            View your workspace information, plan details, and support
            resources.
          </p>
        </div>
      </section>

      <div style={styles.grid}>
        {/* Workspace Access */}
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <Shield size={18} />
            <h2 style={styles.cardTitle}>Workspace Access</h2>
          </div>

          <div style={styles.statusRow}>
            <CheckCircle2 size={18} color="#22c55e" />
            <span style={styles.statusText}>
              {plan} access is active
            </span>
          </div>

          <p style={styles.cardText}>
            Your account is associated with the{" "}
            <strong>{organizationName}</strong> workspace.
          </p>
        </section>

        {/* Account Details */}
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <CreditCard size={18} />
            <h2 style={styles.cardTitle}>Account Details</h2>
          </div>

          <InfoRow label="Plan" value={plan} />
          <InfoRow label="Role" value={role} />
          <InfoRow label="Status" value={status} />
          <InfoRow
            label="Institution"
            value={user?.institution || "-"}
          />
        </section>

        {/* Usage Overview */}
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <Activity size={18} />
            <h2 style={styles.cardTitle}>Usage Overview</h2>
          </div>

          <div style={styles.usageGrid}>
            {usage.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} style={styles.usageItem}>
                  <Icon size={16} strokeWidth={1.8} />
                  <span style={styles.usageLabel}>
                    {item.label}
                  </span>
                  <strong style={styles.usageValue}>
                    {item.value}
                  </strong>
                </div>
              );
            })}
          </div>
        </section>

        {/* Support */}
        <section
          style={{
            ...styles.card,
            gridColumn: "1 / -1",
          }}
        >
          <div style={styles.cardHeader}>
            <CircleHelp size={18} />
            <h2 style={styles.cardTitle}>Support</h2>
          </div>

          <div style={styles.supportGrid}>
            {supportActions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={action.onClick}
                  style={styles.supportCard}
                >
                  <Icon size={20} strokeWidth={1.8} />

                  <div>
                    <div style={styles.supportTitle}>
                      {action.label}
                    </div>
                    <div style={styles.supportDescription}>
                      {action.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={styles.infoRow}>
      <span style={styles.infoLabel}>{label}</span>
      <span style={styles.infoValue}>{value}</span>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #020617 0%, #041127 40%, #030b1d 100%)",
    color: "#ffffff",
    padding: "48px 40px 80px",
  },

  hero: {
    maxWidth: 1200,
    margin: "0 auto 32px",
    display: "flex",
    alignItems: "center",
    gap: 20,
  },

  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    background: "rgba(59,130,246,0.12)",
    border: "1px solid rgba(59,130,246,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#93c5fd",
    flexShrink: 0,
  },

  eyebrow: {
    margin: 0,
    color: "#38bdf8",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
  },

  title: {
    margin: "10px 0 0",
    fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
    fontWeight: 900,
    letterSpacing: "-0.05em",
    lineHeight: 1,
  },

  subtitle: {
    margin: "14px 0 0",
    color: "#94a3b8",
    fontSize: 17,
    lineHeight: 1.7,
    maxWidth: 760,
  },

  grid: {
    maxWidth: 1200,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 24,
  },

  card: {
    borderRadius: 28,
    background: "rgba(15,23,42,0.88)",
    border: "1px solid rgba(148,163,184,0.14)",
    padding: 28,
    boxShadow: "0 24px 70px rgba(0,0,0,0.28)",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
    color: "#e2e8f0",
  },

  cardTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 800,
  },

  cardText: {
    margin: "14px 0 0",
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 1.7,
  },

  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "#e2e8f0",
    fontWeight: 700,
  },

  statusText: {
    fontSize: 14,
  },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    padding: "12px 0",
    borderBottom: "1px solid rgba(148,163,184,0.08)",
  },

  infoLabel: {
    color: "#94a3b8",
    fontSize: 14,
  },

  infoValue: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 700,
    textAlign: "right",
  },

  usageGrid: {
    display: "grid",
    gap: 12,
  },

  usageItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(148,163,184,0.08)",
  },

  usageLabel: {
    color: "#94a3b8",
    fontSize: 14,
    flex: 1,
  },

  usageValue: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: 800,
  },

  supportGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 16,
  },

  supportCard: {
    border: "1px solid rgba(148,163,184,0.12)",
    borderRadius: 18,
    background: "rgba(255,255,255,0.03)",
    color: "#ffffff",
    padding: 18,
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    textAlign: "left",
    cursor: "pointer",
  },

  supportTitle: {
    fontSize: 15,
    fontWeight: 800,
    marginBottom: 4,
  },

  supportDescription: {
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 1.6,
  },
};