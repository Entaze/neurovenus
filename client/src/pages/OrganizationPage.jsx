// src/pages/OrganizationPage.jsx

import {
  Building2,
  ShieldCheck,
  Database,
  CircleHelp,
  MessageSquare,
  LockKeyhole,
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
    "Neurovenus Research Environment";

  const plan = formatLabel(user?.plan || "pilot");

  const status =
    user?.isActive === false
      ? "Inactive"
      : "Active";

  const workspaceType =
    plan.toLowerCase() === "institutional"
      ? "Institutional Research Access"
      : "Private Research Workspace";

  const infrastructureItems = [
    "Multi-session protocol support",
    "Session-aware exports",
    "Trial-level data capture",
    "Automated scoring support",
    "Analysis-ready CSV exports",
    "Secure participant access links",
    "Longitudinal study support",
  ];

  const integrityPolicies = [
    "Protocols become immutable after deployment",
    "Participant access is tokenized",
    "Researcher environments remain private by default",
    "Exports are gated by session and assessment completion",
    "Repeated assessments are tracked independently per session",
  ];

  const supportActions = [
    {
      label: "Help & Documentation",
      description:
        "Browse protocol, export, and platform documentation.",
      icon: CircleHelp,
      onClick: () =>
        window.open(
          "/help",
          "_blank",
          "noopener,noreferrer"
        ),
    },
    {
      label: "Send Feedback",
      description:
        "Report issues, request improvements, or share pilot feedback.",
      icon: MessageSquare,
      onClick: () =>
        window.open(
          "/researcher/feedback",
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
          <p style={styles.eyebrow}>
            Research Environment
          </p>

          <h1 style={styles.title}>
            {organizationName}
          </h1>

          <p style={styles.subtitle}>
            Workspace configuration, research infrastructure,
            data integrity policies, and support resources.
          </p>
        </div>
      </section>

      <div style={styles.grid}>
        {/* Research Environment */}
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <ShieldCheck size={18} />
            <h2 style={styles.cardTitle}>
              Research Environment
            </h2>
          </div>

          <div style={styles.statusRow}>
            <CheckCircle2
              size={18}
              color="#22c55e"
            />

            <span style={styles.statusText}>
              {plan} access is active
            </span>
          </div>

          <div style={{ marginTop: 18 }}>
            <InfoRow
              label="Workspace Type"
              value={workspaceType}
            />

            <InfoRow
              label="Plan"
              value={plan}
            />

            <InfoRow
              label="Status"
              value={status}
            />

            <InfoRow
              label="Institution"
              value={user?.institution || "-"}
            />
          </div>
        </section>

        {/* Research Infrastructure */}
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <Database size={18} />

            <h2 style={styles.cardTitle}>
              Research Infrastructure
            </h2>
          </div>

          <div style={styles.list}>
            {infrastructureItems.map((item) => (
              <div
                key={item}
                style={styles.listItem}
              >
                <CheckCircle2
                  size={16}
                  color="#38bdf8"
                />

                <span style={styles.listText}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Data Integrity & Privacy */}
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <LockKeyhole size={18} />

            <h2 style={styles.cardTitle}>
              Data Integrity & Privacy
            </h2>
          </div>

          <div style={styles.list}>
            {integrityPolicies.map((item) => (
              <div
                key={item}
                style={styles.listItem}
              >
                <CheckCircle2
                  size={16}
                  color="#22c55e"
                />

                <span style={styles.listText}>
                  {item}
                </span>
              </div>
            ))}
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

            <h2 style={styles.cardTitle}>
              Support & Resources
            </h2>
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
                  <Icon
                    size={20}
                    strokeWidth={1.8}
                  />

                  <div>
                    <div style={styles.supportTitle}>
                      {action.label}
                    </div>

                    <div
                      style={
                        styles.supportDescription
                      }
                    >
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
      <span style={styles.infoLabel}>
        {label}
      </span>

      <span style={styles.infoValue}>
        {value}
      </span>
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
    background:
      "rgba(59,130,246,0.12)",
    border:
      "1px solid rgba(59,130,246,0.18)",
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
    fontSize:
      "clamp(2.8rem, 5vw, 4.5rem)",
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
    gridTemplateColumns:
      "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 24,
  },

  card: {
    borderRadius: 28,
    background:
      "rgba(15,23,42,0.88)",
    border:
      "1px solid rgba(148,163,184,0.14)",
    padding: 28,
    boxShadow:
      "0 24px 70px rgba(0,0,0,0.28)",
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
    borderBottom:
      "1px solid rgba(148,163,184,0.08)",
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

  list: {
    display: "grid",
    gap: 14,
  },

  listItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
  },

  listText: {
    color: "#e2e8f0",
    fontSize: 14,
    lineHeight: 1.7,
  },

  supportGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 16,
  },

  supportCard: {
    border:
      "1px solid rgba(148,163,184,0.12)",
    borderRadius: 18,
    background:
      "rgba(255,255,255,0.03)",
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