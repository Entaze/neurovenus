// src/pages/TeamPage.jsx

import { Users, UserPlus, ShieldCheck } from "lucide-react";
import { useResearcherAuth } from "../hooks/useResearcherAuth";

function formatLabel(value = "") {
  return value
    ? value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "-";
}

export default function TeamPage() {
  const { user } = useResearcherAuth();

  const members = [
    {
      name: user?.name || "Researcher",
      email: user?.email || "-",
      role: user?.role || "researcher",
      status: user?.isActive === false ? "Inactive" : "Active",
    },
  ];

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <div style={styles.iconBox}>
          <Users size={28} />
        </div>

        <div>
          <p style={styles.eyebrow}>Team Members</p>
          <h1 style={styles.title}>Workspace Team</h1>
          <p style={styles.subtitle}>
            View the researchers and administrators who have access to this
            Neurovenus workspace.
          </p>
        </div>
      </section>

      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <div>
            <h2 style={styles.cardTitle}>Current Team</h2>
            <p style={styles.cardSubtitle}>
              Team invitations and role management will be available in a later
              release.
            </p>
          </div>

          <button type="button" style={styles.disabledButton} disabled>
            <UserPlus size={16} />
            Invite Researcher
          </button>
        </div>

        <div style={styles.table}>
          {members.map((member) => (
            <div key={member.email} style={styles.row}>
              <div style={styles.avatar}>
                {getInitial(member.name)}
              </div>

              <div style={styles.person}>
                <strong style={styles.name}>{member.name}</strong>
                <span style={styles.email}>{member.email}</span>
              </div>

              <div style={styles.badge}>
                <ShieldCheck size={14} />
                {formatLabel(member.role)}
              </div>

              <div style={styles.status}>{member.status}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function getInitial(name = "") {
  return name.trim().charAt(0).toUpperCase() || "U";
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#020817",
    color: "#ffffff",
    padding: "48px 40px 80px",
  },

  header: {
    maxWidth: 1100,
    margin: "0 auto 32px",
    display: "flex",
    gap: 20,
    alignItems: "center",
  },

  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    background: "rgba(59,130,246,0.12)",
    border: "1px solid rgba(59,130,246,0.18)",
    color: "#93c5fd",
    display: "grid",
    placeItems: "center",
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
  },

  card: {
    maxWidth: 1100,
    margin: "0 auto",
    borderRadius: 28,
    background: "rgba(15,23,42,0.88)",
    border: "1px solid rgba(148,163,184,0.14)",
    padding: 28,
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
    alignItems: "center",
    marginBottom: 24,
  },

  cardTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 900,
  },

  cardSubtitle: {
    margin: "8px 0 0",
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 1.6,
  },

  disabledButton: {
    border: "1px solid rgba(148,163,184,0.16)",
    borderRadius: 14,
    padding: "12px 16px",
    background: "rgba(255,255,255,0.04)",
    color: "#94a3b8",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    cursor: "not-allowed",
  },

  table: {
    display: "grid",
    gap: 12,
  },

  row: {
    display: "grid",
    gridTemplateColumns: "44px 1fr auto auto",
    gap: 14,
    alignItems: "center",
    padding: 16,
    borderRadius: 18,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(148,163,184,0.10)",
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "#64748b",
    color: "#fff",
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
  },

  person: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },

  name: {
    color: "#fff",
    fontSize: 15,
  },

  email: {
    color: "#94a3b8",
    fontSize: 13,
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(59,130,246,0.10)",
    color: "#93c5fd",
    fontSize: 12,
    fontWeight: 800,
  },

  status: {
    color: "#86efac",
    fontSize: 13,
    fontWeight: 800,
  },
};