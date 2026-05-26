// src/pages/BillingPage.jsx

import {
  CreditCard,
  CheckCircle2,
  Building2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useResearcherAuth } from "../hooks/useResearcherAuth";

function formatLabel(value = "") {
  return value
    ? value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    : "-";
}

export default function BillingPage() {
  const { user } = useResearcherAuth();

  const organizationName =
    user?.organizationName || user?.institution || "Pilot Workspace Org";

  const plan = formatLabel(user?.plan || "pilot");

  const includedItems = [
    "Researcher dashboard access",
    "Study creation and management",
    "Participant invitations",
    "Multi-session study workflows",
    "CSV export access",
    "Feedback and support channel",
  ];

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroIcon}>
          <CreditCard size={28} strokeWidth={1.8} />
        </div>

        <div>
          <p style={styles.eyebrow}>Billing</p>
          <h1 style={styles.title}>Plan & Billing</h1>
          <p style={styles.subtitle}>
            View your current workspace plan and pilot access details. Full
            billing management will be available when subscriptions are enabled.
          </p>
        </div>
      </section>

      <section style={styles.grid}>
        <div style={styles.planCard}>
          <div style={styles.planHeader}>
            <div>
              <p style={styles.cardKicker}>Current Plan</p>
              <h2 style={styles.planTitle}>{plan}</h2>
            </div>

            <span style={styles.statusBadge}>
              <CheckCircle2 size={15} strokeWidth={2} />
              Active
            </span>
          </div>

          <p style={styles.planText}>
            Your organization currently has active {plan.toLowerCase()} access
            to Neurovenus.
          </p>

          <div style={styles.infoBox}>
            <Building2 size={18} strokeWidth={1.8} />
            <div>
              <span style={styles.infoLabel}>Organization</span>
              <strong style={styles.infoValue}>{organizationName}</strong>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <ShieldCheck size={18} strokeWidth={1.8} />
            <h2 style={styles.cardTitle}>Included Access</h2>
          </div>

          <div style={styles.includedList}>
            {includedItems.map((item) => (
              <div key={item} style={styles.includedItem}>
                <CheckCircle2 size={16} strokeWidth={2} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...styles.card, gridColumn: "1 / -1" }}>
          <div style={styles.cardHeader}>
            <Mail size={18} strokeWidth={1.8} />
            <h2 style={styles.cardTitle}>Upgrade or Billing Support</h2>
          </div>

          <p style={styles.cardText}>
            For pilot workspaces, billing is managed directly by the Neurovenus
            team. If you would like to discuss a Research Lab, Institutional, or
            Enterprise plan, contact support.
          </p>

          <button
            type="button"
            style={styles.primaryButton}
            onClick={() =>
              (window.location.href =
                "mailto:support@neurovenus.com?subject=Neurovenus%20Billing%20or%20Upgrade%20Request")
            }
          >
            Contact Neurovenus
          </button>
        </div>
      </section>
    </main>
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
    color: "#93c5fd",
    display: "grid",
    placeItems: "center",
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
    maxWidth: 780,
  },

  grid: {
    maxWidth: 1200,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: 24,
  },

  planCard: {
    borderRadius: 28,
    background:
      "linear-gradient(180deg, rgba(37,99,235,0.18), rgba(15,23,42,0.9))",
    border: "1px solid rgba(96,165,250,0.22)",
    padding: 28,
    boxShadow: "0 24px 70px rgba(0,0,0,0.28)",
  },

  card: {
    borderRadius: 28,
    background: "rgba(15,23,42,0.88)",
    border: "1px solid rgba(148,163,184,0.14)",
    padding: 28,
    boxShadow: "0 24px 70px rgba(0,0,0,0.28)",
  },

  planHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },

  cardKicker: {
    margin: 0,
    color: "#93c5fd",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
  },

  planTitle: {
    margin: "10px 0 0",
    fontSize: 42,
    fontWeight: 900,
    letterSpacing: "-0.04em",
    color: "#ffffff",
  },

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(34,197,94,0.12)",
    color: "#86efac",
    fontSize: 12,
    fontWeight: 900,
  },

  planText: {
    margin: "18px 0 0",
    color: "#cbd5e1",
    fontSize: 15,
    lineHeight: 1.7,
  },

  infoBox: {
    marginTop: 24,
    padding: 16,
    borderRadius: 18,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    gap: 12,
    alignItems: "center",
    color: "#93c5fd",
  },

  infoLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: 12,
    marginBottom: 4,
  },

  infoValue: {
    color: "#ffffff",
    fontSize: 15,
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
    fontWeight: 900,
  },

  includedList: {
    display: "grid",
    gap: 12,
  },

  includedItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "#cbd5e1",
    fontSize: 14,
  },

  cardText: {
    margin: 0,
    color: "#94a3b8",
    fontSize: 15,
    lineHeight: 1.7,
    maxWidth: 820,
  },

  primaryButton: {
    marginTop: 22,
    border: "none",
    borderRadius: 14,
    padding: "13px 18px",
    background: "#3b82f6",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",

    minWidth: 190,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
  },
};