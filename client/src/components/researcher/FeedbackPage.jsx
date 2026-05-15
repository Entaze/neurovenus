// src/pages/researcher/FeedbackPage.jsx

import { useRef, useState } from "react";
import api from "../../api/client";

const feedbackTypes = [
  "Bug Report",
  "Improvement Suggestion",
  "General Comment",
  "Feature Request",
];

const categories = [
  "Studies",
  "Participants",
  "Assessments",
  "Exports",
  "Authentication",
  "Notifications",
  "Billing",
  "Documentation",
  "Other",
];

const priorities = ["Low", "Medium", "High", "Critical"];

const initialForm = {
  type: "General Comment",
  title: "",
  description: "",
  category: "Studies",
  priority: "Medium",
};

export default function FeedbackPage() {
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(initialForm);
  const [attachment, setAttachment] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setAttachment(null);
    setSubmitted(false);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.title.trim()) {
      setError("Please enter a short summary.");
      return;
    }

    if (!form.description.trim()) {
      setError("Please provide feedback details.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      const typeMap = {
        "Bug Report": "bug",
        "Feature Request": "feature",
        "Improvement Suggestion": "improvement",
        "General Comment": "general",
      };

      const categoryMap = {
        Studies: "studies",
        Participants: "participants",
        Exports: "exports",
        Billing: "billing",
        "Team & Access": "team_access",
        "Platform Performance": "performance",
        Assessments: "other",
        Authentication: "other",
        Notifications: "other",
        Documentation: "other",
        Other: "other",
      };

      formData.append("type", typeMap[form.type] || "general");
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("category", categoryMap[form.category] || "other");
      formData.append("priority", form.priority.toLowerCase());

      if (attachment) {
        formData.append("attachment", attachment);
      }

      await api.post("/feedback", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Failed to submit feedback. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.eyebrow}>Neurovenus Feedback</div>

          <h1 style={styles.title}>Help us improve Neurovenus</h1>

          <p style={styles.subtitle}>
            Share bugs, ideas, improvements, or workflow issues. Your feedback
            helps shape the product roadmap.
          </p>

          <div style={styles.successCard}>
            <h2 style={styles.successTitle}>Feedback received</h2>

            <p style={styles.successText}>
              Thank you. Your feedback has been captured and will help improve
              Neurovenus.
            </p>

            <div style={styles.successActions}>
              <button
                type="button"
                style={styles.secondaryButton}
                onClick={resetForm}
              >
                Submit another feedback item
              </button>

              <button
                type="button"
                style={styles.primaryButton}
                onClick={() => window.close()}
              >
                Close tab
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.eyebrow}>Neurovenus Feedback</div>

        <h1 style={styles.title}>Help us improve Neurovenus</h1>

        <p style={styles.subtitle}>
          Share bugs, ideas, improvements, or workflow issues. Your feedback
          helps shape the product roadmap.
        </p>

        <form style={styles.card} onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Feedback type</label>

            <select
              style={styles.select}
              value={form.type}
              onChange={(e) => updateField("type", e.target.value)}
            >
              {feedbackTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Short summary</label>

            <input
              style={styles.input}
              type="text"
              placeholder="One sentence summary of your feedback"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Details</label>

            <textarea
              style={styles.textarea}
              rows={10}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder={`What problem are you trying to solve?

What would you like to see happen?

Why is this important to your research workflow?

Additional context:`}
            />
          </div>

          <div style={styles.grid}>
            <div style={styles.field}>
              <label style={styles.label}>Category</label>

              <select
                style={styles.select}
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Priority</label>

              <select
                style={styles.select}
                value={form.priority}
                onChange={(e) => updateField("priority", e.target.value)}
              >
                {priorities.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Attachment</label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
              style={styles.fileInput}
              onChange={(e) =>
                setAttachment(e.target.files?.[0] || null)
              }
            />

            <div style={styles.fileHelp}>
              Optional. Add a screenshot or PDF that helps explain the issue.
            </div>
          </div>

          <div style={styles.errorBannerContainer}>
            {error ? <div style={styles.errorBanner}>{error}</div> : null}
          </div>

          <button
            type="submit"
            style={{
              ...styles.primaryButton,
              ...(submitting ? styles.disabledButton : {}),
            }}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}

const fieldBase = {
  width: "100%",
  padding: "16px 18px",
  borderRadius: 16,
  border: "1px solid rgba(59,130,246,0.18)",
  background: "#020817",
  color: "#ffffff",
  fontSize: 16,
  outline: "none",
};

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #020617 0%, #041127 38%, #030b1d 68%, #0b0820 100%)",
    padding: "48px 24px 80px",
  },

  container: {
    maxWidth: 1200,
    margin: "0 auto",
  },

  eyebrow: {
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#38bdf8",
    marginBottom: 20,
  },

  title: {
    margin: 0,
    fontSize: "clamp(3rem, 5vw, 5rem)",
    lineHeight: 1.05,
    fontWeight: 800,
    letterSpacing: "-0.04em",
    color: "#ffffff",
  },

  subtitle: {
    marginTop: 24,
    marginBottom: 48,
    maxWidth: 900,
    fontSize: 20,
    lineHeight: 1.7,
    color: "#94a3b8",
  },

  card: {
    background:
      "linear-gradient(180deg, rgba(15,23,42,0.92), rgba(15,23,42,0.98))",
    border: "1px solid rgba(59,130,246,0.12)",
    borderRadius: 32,
    padding: 40,
    boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
  },

  successCard: {
    background:
      "linear-gradient(180deg, rgba(15,23,42,0.92), rgba(15,23,42,0.98))",
    border: "1px solid rgba(59,130,246,0.12)",
    borderRadius: 32,
    padding: "72px 48px",
    textAlign: "center",
    boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
  },

  successTitle: {
    margin: 0,
    fontSize: 56,
    fontWeight: 800,
    letterSpacing: "-0.03em",
    color: "#ffffff",
  },

  successText: {
    margin: "24px auto 0",
    maxWidth: 700,
    fontSize: 20,
    lineHeight: 1.8,
    color: "#94a3b8",
  },

  successActions: {
    marginTop: 40,
    display: "flex",
    justifyContent: "center",
    gap: 16,
    flexWrap: "wrap",
  },

  field: {
    marginBottom: 28,
  },

  label: {
    display: "block",
    marginBottom: 10,
    fontSize: 15,
    fontWeight: 700,
    color: "#e2e8f0",
  },

  input: fieldBase,

  select: fieldBase,

  textarea: {
    ...fieldBase,
    minHeight: 260,
    resize: "vertical",
    lineHeight: 1.7,
    fontFamily: "inherit",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 20,
  },

  fileInput: {
    ...fieldBase,
    padding: "14px 18px",
  },

  fileHelp: {
    marginTop: 8,
    fontSize: 14,
    color: "#64748b",
  },

  errorBanner: {
    marginBottom: 24,
    padding: "14px 16px",
    borderRadius: 14,
    background: "rgba(239,68,68,0.10)",
    border: "1px solid rgba(239,68,68,0.20)",
    color: "#fca5a5",
    fontSize: 14,
    fontWeight: 500,
  },

  primaryButton: {
    padding: "16px 28px",
    borderRadius: 16,
    border: "none",
    background: "#3b82f6",
    color: "#ffffff",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  secondaryButton: {
    padding: "16px 28px",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  },

  disabledButton: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  errorBannerContainer: {
    minHeight: 80,
    display: "flex",
    alignItems: "flex-start",
  },
};