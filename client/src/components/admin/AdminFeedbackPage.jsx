// src/pages/researcher/FeedbackInboxPage.jsx

import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../../api/client";
import { useResearcherAuth } from "../../hooks/useResearcherAuth";
import FeedbackDetailModal from "../../components/researcher/FeedbackDetailModal";

const statuses = [
  "submitted",
  "under_review",
  "planned",
  "in_progress",
  "released",
  "closed",
];

export default function AdminFeedbackPage() {
  const [items, setItems] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useResearcherAuth();

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return items.filter((item) => {
      const matchesStatus =
        selectedStatus === "all" || item.status === selectedStatus;

      const matchesPriority =
        selectedPriority === "all" || item.priority === selectedPriority;

      const matchesSearch =
        !normalizedSearch ||
        [
          item.title,
          item.description,
          item.userName,
          item.userEmail,
          item.organizationName,
          item.category,
          item.priority,
          item.status,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [searchTerm, selectedPriority, items, selectedStatus]);

  const summary = useMemo(() => {
    return {
      total: items.length,
      submitted: items.filter((item) => item.status === "submitted").length,
      highPriority: items.filter((item) =>
        ["high", "critical"].includes(item.priority)
      ).length,
      withAttachments: items.filter((item) => item.attachments?.length > 0)
        .length,
    };
  }, [items]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/feedback");
      setItems(data.feedback || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load feedback.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadFeedback = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get("/feedback");

        if (!mounted) return;
        setItems(data.feedback || []);
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.message || "Failed to load feedback.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadFeedback();

    return () => {
      mounted = false;
    };
  }, []);

  const updateStatus = async (feedbackId, status) => {
    const { data } = await api.patch(`/feedback/${feedbackId}/status`, {
      status,
    });

    setItems((prev) =>
      prev.map((item) => (item._id === feedbackId ? data.feedback : item))
    );

    setSelectedFeedback((prev) =>
      prev?._id === feedbackId ? data.feedback : prev
    );
  };

  if (user?.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <main style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.kicker}>Product Feedback</p>
          <h1 style={styles.title}>Feedback</h1>
          <p style={styles.subtitle}>
            Review submitted feedback, inspect attachments, and update product
            status.
          </p>
        </div>

        <button type="button" style={styles.refreshButton} onClick={fetchFeedback}>
          Refresh
        </button>
      </div>

      <div style={styles.summaryGrid}>
        <SummaryCard label="Total Feedback" value={summary.total} />
        <SummaryCard label="Submitted" value={summary.submitted} />
        <SummaryCard label="High Priority" value={summary.highPriority} />
        <SummaryCard label="With Attachments" value={summary.withAttachments} />
      </div>

      <div style={styles.toolbar}>
        <label style={styles.filterLabel}>Status</label>

        <label style={styles.filterLabel}>Priority</label>

        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          style={styles.select}
        >
          <option value="all">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={styles.select}
        >
          <option value="all">All</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {formatLabel(status)}
            </option>
          ))}
        </select>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search feedback..."
          style={styles.searchInput}
        />
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <p style={styles.muted}>Loading feedback...</p>
      ) : filteredItems.length === 0 ? (
        <div style={styles.empty}>No feedback found.</div>
      ) : (
        <div style={styles.list}>
          {filteredItems.map((item) => (
            <article key={item._id} style={styles.card}>
              <div style={styles.cardTop}>
                <div>
                  <div style={styles.metaRow}>
                    <span style={styles.typeBadge}>{formatLabel(item.type)}</span>
                    <span style={styles.priorityBadge}>
                      {formatLabel(item.priority)}
                    </span>
                    <span style={styles.dateText}>
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <h2 style={styles.itemTitle}>{item.title}</h2>

                  <p style={styles.submitter}>
                    {item.userName} · {item.userEmail}
                  </p>
                </div>

                <select
                  value={item.status}
                  onChange={async (e) => {
                    try {
                      await updateStatus(item._id, e.target.value);
                    } catch (err) {
                      alert(
                        err?.response?.data?.message ||
                          "Failed to update feedback status."
                      );
                    }
                  }}
                  style={styles.statusSelect}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {formatLabel(status)}
                    </option>
                  ))}
                </select>
              </div>

              <p style={styles.description}>{item.description}</p>

              <div style={styles.detailsGrid}>
                <Info label="Organization" value={item.organizationName} />
                <Info label="Plan" value={formatLabel(item.organizationPlan)} />
                <Info label="Category" value={formatLabel(item.category)} />
                <Info label="Status" value={formatLabel(item.status)} />
              </div>

              {item.attachments?.length > 0 && (
                <div style={styles.attachments}>
                  <p style={styles.attachmentTitle}>Attachments</p>

                  {item.attachments.map((attachment) => (
                    <a
                      key={attachment._id || attachment.url}
                      href={buildAttachmentUrl(attachment.url)}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.attachmentLink}
                    >
                      {attachment.filename} ·{" "}
                      {Math.round((attachment.size || 0) / 1024)} KB
                    </a>
                  ))}
                </div>
              )}

              <div style={styles.cardActions}>
                <button
                  type="button"
                  style={styles.viewButton}
                  onClick={() => setSelectedFeedback(item)}
                >
                  View Details
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedFeedback && (
        <FeedbackDetailModal
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
          onStatusChange={async (status) => {
            try {
              await updateStatus(selectedFeedback._id, status);
            } catch (err) {
              alert(
                err?.response?.data?.message ||
                  "Failed to update feedback status."
              );
            }
          }}
        />
      )}
    </main>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div style={styles.summaryCard}>
      <span style={styles.summaryLabel}>{label}</span>
      <strong style={styles.summaryValue}>{value}</strong>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div style={styles.infoBox}>
      <span style={styles.infoLabel}>{label}</span>
      <strong style={styles.infoValue}>{value || "-"}</strong>
    </div>
  );
}

function formatLabel(value = "") {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildAttachmentUrl(url = "") {
  if (!url) return "#";

  const baseUrl = api.defaults.baseURL?.replace("/api", "") || "";

  return `${baseUrl}${url}`;
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#020817",
    color: "#ffffff",
    padding: "40px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
    alignItems: "flex-start",
    marginBottom: 28,
  },

  kicker: {
    margin: 0,
    color: "#38bdf8",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
  },

  title: {
    margin: "10px 0 0",
    fontSize: 42,
    fontWeight: 900,
    letterSpacing: "-0.04em",
  },

  subtitle: {
    margin: "10px 0 0",
    color: "#94a3b8",
    fontSize: 15,
    lineHeight: 1.7,
  },

  refreshButton: {
    border: "none",
    borderRadius: 12,
    padding: "12px 16px",
    background: "#2f4b88",
    color: "#ffffff",
    fontWeight: 800,
    cursor: "pointer",
  },

  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },

  filterLabel: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },

  select: {
    height: 42,
    borderRadius: 10,
    border: "1px solid rgba(148,163,184,0.2)",
    background: "#020817",
    color: "#ffffff",
    padding: "0 12px",
  },

  statusSelect: {
    height: 40,
    borderRadius: 10,
    border: "1px solid rgba(148,163,184,0.2)",
    background: "#020817",
    color: "#ffffff",
    padding: "0 12px",
  },

  error: {
    padding: 14,
    borderRadius: 12,
    background: "rgba(248,113,113,0.12)",
    border: "1px solid rgba(248,113,113,0.28)",
    color: "#fecaca",
    marginBottom: 20,
  },

  muted: {
    color: "#94a3b8",
  },

  empty: {
    padding: 32,
    borderRadius: 18,
    background: "rgba(255,255,255,0.04)",
    border: "1px dashed rgba(255,255,255,0.08)",
    color: "#94a3b8",
    textAlign: "center",
  },

  list: {
    display: "grid",
    gap: 16,
  },

  card: {
    padding: 24,
    borderRadius: 22,
    background: "rgba(15,23,42,0.88)",
    border: "1px solid rgba(148,163,184,0.14)",
    boxShadow: "0 18px 50px rgba(0,0,0,0.22)",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    alignItems: "flex-start",
  },

  metaRow: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    flexWrap: "wrap",
  },

  typeBadge: {
    padding: "4px 9px",
    borderRadius: 999,
    background: "rgba(59,130,246,0.12)",
    color: "#93c5fd",
    fontSize: 11,
    fontWeight: 800,
  },

  priorityBadge: {
    padding: "4px 9px",
    borderRadius: 999,
    background: "rgba(250,204,21,0.12)",
    color: "#fde68a",
    fontSize: 11,
    fontWeight: 800,
  },

  dateText: {
    color: "#64748b",
    fontSize: 12,
  },

  itemTitle: {
    margin: "12px 0 0",
    color: "#ffffff",
    fontSize: 20,
    fontWeight: 850,
    lineHeight: 1.35,
  },

  submitter: {
    margin: "8px 0 0",
    color: "#94a3b8",
    fontSize: 13,
  },

  description: {
    margin: "18px 0",
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 1.7,
    display: "-webkit-box",
    WebkitLineClamp: 4,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 10,
  },

  infoBox: {
    padding: 12,
    borderRadius: 14,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(148,163,184,0.10)",
  },

  infoLabel: {
    display: "block",
    color: "#64748b",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    marginBottom: 5,
  },

  infoValue: {
    color: "#e2e8f0",
    fontSize: 13,
  },

  attachments: {
    marginTop: 18,
    paddingTop: 16,
    borderTop: "1px solid rgba(148,163,184,0.12)",
  },

  attachmentTitle: {
    margin: "0 0 8px",
    color: "#ffffff",
    fontSize: 13,
    fontWeight: 800,
  },

  attachmentLink: {
    display: "inline-flex",
    marginRight: 10,
    marginTop: 6,
    color: "#60a5fa",
    fontSize: 13,
    fontWeight: 700,
    textDecoration: "none",
  },

  cardActions: {
    marginTop: 18,
    display: "flex",
    justifyContent: "flex-end",
  },

  viewButton: {
    border: "1px solid rgba(148,163,184,0.18)",
    borderRadius: 12,
    background: "rgba(255,255,255,0.04)",
    color: "#e2e8f0",
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
  },

  searchInput: {
    height: 42,
    minWidth: 280,
    borderRadius: 10,
    border: "1px solid rgba(148,163,184,0.2)",
    background: "#020817",
    color: "#ffffff",
    padding: "0 12px",
    outline: "none",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 14,
    marginBottom: 24,
  },

  summaryCard: {
    padding: 18,
    borderRadius: 18,
    background: "rgba(15,23,42,0.88)",
    border: "1px solid rgba(148,163,184,0.14)",
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
    fontSize: 30,
    fontWeight: 900,
  },
};