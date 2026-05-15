// src/components/researcher/FeedbackDetailModal.jsx

import { useState } from "react";
import { X, Download, ExternalLink, Image as ImageIcon } from "lucide-react";
import api from "../../api/client";

const statuses = [
  "submitted",
  "under_review",
  "planned",
  "in_progress",
  "released",
  "closed",
];

export default function FeedbackDetailModal({
  feedback,
  onClose,
  onStatusChange,
}) {
  const [notes, setNotes] = useState(feedback.internalNotes || "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);

  if (!feedback) return null;

  const imageAttachments =
    feedback.attachments?.filter((attachment) =>
      attachment.mimeType?.startsWith("image/")
    ) || [];

  const handleSaveNotes = async () => {
    try {
      setSavingNotes(true);
      setNotesSaved(false);

      await api.patch(`/feedback/${feedback._id}/notes`, {
        internalNotes: notes,
      });

      setNotes("");
      setNotesSaved(true);

      setTimeout(() => {
        setNotesSaved(false);
      }, 1800);
    } catch (error) {
      console.error("Failed to save notes:", error);
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <p style={styles.kicker}>{formatLabel(feedback.type)}</p>
            <h2 style={styles.title}>{feedback.title}</h2>
            <p style={styles.meta}>
              {feedback.userName} · {feedback.userEmail}
            </p>
          </div>

          <button
            type="button"
            style={styles.closeButton}
            onClick={onClose}
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>

        {/* Metadata */}
        <div style={styles.grid}>
          <Info
            label="Organization"
            value={feedback.organizationName}
          />
          <Info
            label="Plan"
            value={formatLabel(feedback.organizationPlan)}
          />
          <Info
            label="Category"
            value={formatLabel(feedback.category)}
          />
          <Info
            label="Priority"
            value={formatLabel(feedback.priority)}
          />
          <Info
            label="Submitted"
            value={new Date(feedback.createdAt).toLocaleString()}
          />
          <Info
            label="Current Status"
            value={formatLabel(feedback.status)}
          />
        </div>

        {/* Status Selector */}
        <div style={styles.section}>
          <label style={styles.label}>Update Status</label>

          <select
            value={feedback.status}
            onChange={(e) => onStatusChange?.(e.target.value)}
            style={styles.select}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {formatLabel(status)}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div style={styles.section}>
          <label style={styles.label}>Full Description</label>
          <pre style={styles.description}>
            {feedback.description}
          </pre>
        </div>

        {/* Internal Notes */}
        <div style={styles.section}>
          <label style={styles.label}>Internal Notes</label>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={styles.textarea}
            placeholder="Add private notes for your team..."
          />

          <button
            type="button"
            style={{
              ...styles.saveButton,
              ...(savingNotes ? styles.disabledButton : {}),
            }}
            onClick={handleSaveNotes}
            disabled={savingNotes || !notes.trim()}
          >
            {savingNotes ? "Saving..." : notesSaved ? "Saved" : "Save Notes"}
          </button>
        </div>

        {/* Image Preview */}
        {imageAttachments.length > 0 && (
          <div style={styles.section}>
            <label style={styles.label}>Screenshot Preview</label>

            <div style={styles.imageGrid}>
              {imageAttachments.map((attachment) => (
                <a
                  key={attachment._id || attachment.url}
                  href={buildAttachmentUrl(attachment.url)}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.imageLink}
                >
                  <img
                    src={buildAttachmentUrl(attachment.url)}
                    alt={attachment.filename}
                    style={styles.previewImage}
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Attachments */}
        {feedback.attachments?.length > 0 && (
          <div style={styles.section}>
            <label style={styles.label}>Attachments</label>

            <div style={styles.attachments}>
              {feedback.attachments.map((attachment) => (
                <AttachmentChip
                  key={attachment._id || attachment.url}
                  attachment={attachment}
                />
              ))}
            </div>
          </div>
        )}
      </div>
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

function AttachmentChip({ attachment }) {
  const url = buildAttachmentUrl(attachment.url);
  const isImage = attachment.mimeType?.startsWith("image/");

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      style={styles.attachmentLink}
    >
      {isImage ? (
        <ImageIcon size={14} />
      ) : (
        <Download size={14} />
      )}

      <span>{attachment.filename}</span>

      <span style={styles.attachmentSize}>
        {Math.round((attachment.size || 0) / 1024)} KB
      </span>

      <ExternalLink size={12} />
    </a>
  );
}

function formatLabel(value = "") {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildAttachmentUrl(url = "") {
  if (!url) return "#";
  const baseUrl = api.defaults.baseURL?.replace("/api", "") || "";
  return `${baseUrl}${url}`;
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(2,8,23,0.82)",
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    zIndex: 2000,
  },

  modal: {
    width: "100%",
    maxWidth: 980,
    maxHeight: "92vh",
    overflowY: "auto",
    background: "#0f172a",
    borderRadius: 28,
    border: "1px solid rgba(148,163,184,0.14)",
    padding: 36,
    boxShadow: "0 30px 100px rgba(0,0,0,0.55)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 24,
    marginBottom: 28,
  },

  kicker: {
    margin: 0,
    color: "#38bdf8",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
  },

  title: {
    margin: "10px 0 0",
    color: "#ffffff",
    fontSize: 32,
    fontWeight: 900,
    lineHeight: 1.25,
  },

  meta: {
    margin: "10px 0 0",
    color: "#94a3b8",
    fontSize: 14,
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,0.16)",
    background: "rgba(255,255,255,0.04)",
    color: "#cbd5e1",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    flexShrink: 0,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 12,
    marginBottom: 24,
  },

  infoBox: {
    padding: 14,
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
    marginBottom: 6,
  },

  infoValue: {
    color: "#e2e8f0",
    fontSize: 14,
    fontWeight: 700,
  },

  section: {
    marginTop: 28,
  },

  label: {
    display: "block",
    marginBottom: 10,
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },

  select: {
    width: 280,
    height: 44,
    borderRadius: 10,
    border: "1px solid rgba(148,163,184,0.2)",
    background: "#020817",
    color: "#ffffff",
    padding: "0 12px",
    outline: "none",
    fontSize: 14,
  },

  description: {
    whiteSpace: "pre-wrap",
    fontFamily: "inherit",
    color: "#cbd5e1",
    lineHeight: 1.8,
    background: "rgba(255,255,255,0.03)",
    padding: 22,
    borderRadius: 16,
    border: "1px solid rgba(148,163,184,0.10)",
    margin: 0,
    fontSize: 15,
  },

  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  },

  imageLink: {
    display: "block",
    textDecoration: "none",
  },

  previewImage: {
    width: "100%",
    borderRadius: 16,
    border: "1px solid rgba(148,163,184,0.14)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
  },

  attachments: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
  },

  attachmentLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    color: "#60a5fa",
    background: "rgba(59,130,246,0.10)",
    border: "1px solid rgba(59,130,246,0.16)",
    borderRadius: 999,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 800,
    textDecoration: "none",
  },

  attachmentSize: {
    opacity: 0.7,
    fontWeight: 600,
  },

  textarea: {
    width: "100%",
    minHeight: 140,
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,0.15)",
    background: "#020817",
    color: "#ffffff",
    padding: 16,
    outline: "none",
    resize: "vertical",
    fontSize: 14,
    lineHeight: 1.6,
  },

  saveButton: {
    marginTop: 12,
    width: 150,
    padding: "10px 18px",
    borderRadius: 10,
    border: "none",
    background: "#3b82f6",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
    textAlign: "center",
  },

  disabledButton: {
    opacity: 0.65,
    cursor: "not-allowed",
  },
};