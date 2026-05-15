// src/pages/NotificationsPage.jsx

import {
  Bell,
  CheckCircle2,
  Mail,
  Download,
  FlaskConical,
  MessageSquare,
} from "lucide-react";

const notifications = [
  {
    id: "n1",
    type: "participants",
    title: "Participant completed Session 1",
    description: "NV-196528 completed the first session for the pilot study.",
    time: "Today, 09:42",
    unread: true,
    icon: CheckCircle2,
  },
  {
    id: "n2",
    type: "participants",
    title: "Participant invitation sent",
    description: "An invitation email was sent successfully.",
    time: "Yesterday, 16:18",
    unread: false,
    icon: Mail,
  },
  {
    id: "n3",
    type: "exports",
    title: "Study export generated",
    description: "A CSV export was created for analysis-ready data.",
    time: "Yesterday, 12:05",
    unread: false,
    icon: Download,
  },
  {
    id: "n4",
    type: "studies",
    title: "New study created",
    description: "A new study protocol was created and locked.",
    time: "2 days ago",
    unread: false,
    icon: FlaskConical,
  },
  {
    id: "n5",
    type: "support",
    title: "Feedback submitted",
    description: "A researcher submitted feedback with an attachment.",
    time: "2 days ago",
    unread: true,
    icon: MessageSquare,
  },
];

export default function NotificationsPage() {
  const unreadCount = notifications.filter((item) => item.unread).length;

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroIcon}>
          <Bell size={28} strokeWidth={1.8} />
        </div>

        <div>
          <p style={styles.eyebrow}>Notifications</p>
          <h1 style={styles.title}>Activity & Alerts</h1>
          <p style={styles.subtitle}>
            Track important workspace activity, participant progress, exports,
            and support updates.
          </p>
        </div>
      </section>

      <section style={styles.grid}>
        <div style={styles.summaryCard}>
          <span style={styles.summaryLabel}>Unread</span>
          <strong style={styles.summaryValue}>{unreadCount}</strong>
        </div>

        <div style={styles.summaryCard}>
          <span style={styles.summaryLabel}>Total Updates</span>
          <strong style={styles.summaryValue}>{notifications.length}</strong>
        </div>
      </section>

      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <div>
            <h2 style={styles.cardTitle}>Recent Activity</h2>
            <p style={styles.cardSubtitle}>
              Live notification feeds will be connected in a later release.
            </p>
          </div>

          <button type="button" style={styles.disabledButton} disabled>
            Mark all as read
          </button>
        </div>

        <div style={styles.list}>
          {notifications.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.id} style={styles.notification}>
                <div style={styles.iconWrap}>
                  <Icon size={18} strokeWidth={1.8} />
                </div>

                <div style={styles.notificationBody}>
                  <div style={styles.notificationTop}>
                    <h3 style={styles.notificationTitle}>{item.title}</h3>
                    <span style={styles.time}>{item.time}</span>
                  </div>

                  <p style={styles.description}>{item.description}</p>
                </div>

                {item.unread && <span style={styles.unreadBadge}>New</span>}
              </article>
            );
          })}
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
    margin: "0 auto 24px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  },

  summaryCard: {
    borderRadius: 22,
    background: "rgba(15,23,42,0.88)",
    border: "1px solid rgba(148,163,184,0.14)",
    padding: 22,
  },

  summaryLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: 10,
  },

  summaryValue: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: 900,
  },

  card: {
    maxWidth: 1200,
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
    cursor: "not-allowed",
    fontWeight: 700,
  },

  list: {
    display: "grid",
    gap: 12,
  },

  notification: {
    display: "grid",
    gridTemplateColumns: "42px 1fr auto",
    gap: 14,
    alignItems: "center",
    padding: 16,
    borderRadius: 18,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(148,163,184,0.10)",
  },

  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    display: "grid",
    placeItems: "center",
    background: "rgba(59,130,246,0.10)",
    color: "#93c5fd",
  },

  notificationBody: {
    minWidth: 0,
  },

  notificationTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
  },

  notificationTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: 850,
    color: "#ffffff",
  },

  time: {
    color: "#64748b",
    fontSize: 12,
    whiteSpace: "nowrap",
  },

  description: {
    margin: "6px 0 0",
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 1.6,
  },

  unreadBadge: {
    padding: "5px 9px",
    borderRadius: 999,
    background: "rgba(59,130,246,0.14)",
    color: "#93c5fd",
    fontSize: 11,
    fontWeight: 900,
    textTransform: "uppercase",
  },
};