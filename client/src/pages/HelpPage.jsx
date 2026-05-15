// src/pages/HelpPage.jsx

import { useMemo, useState } from "react";
import { Search, BookOpen, MessageSquare } from "lucide-react";
import { helpArticles } from "../pages/data/helpArticles";

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArticleId, setSelectedArticleId] = useState(
    helpArticles[0]?.id
  );

  const filteredArticles = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return helpArticles;

    return helpArticles.filter((article) =>
      [
        article.title,
        article.summary,
        article.category,
        ...(article.content || []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [searchTerm]);

  const selectedArticle =
    filteredArticles.find((article) => article.id === selectedArticleId) ||
    filteredArticles[0];

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>Neurovenus Help Center</p>
        <h1 style={styles.title}>How can we help?</h1>
        <p style={styles.subtitle}>
          Find guidance on studies, participants, sessions, exports,
          assessments, and support.
        </p>

        <div style={styles.searchBox}>
          <Search size={20} strokeWidth={1.8} />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search documentation..."
            style={styles.searchInput}
          />
        </div>
      </section>

      <section style={styles.layout}>
        <aside style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <BookOpen size={18} />
            <span>Documentation</span>
          </div>

          <div style={styles.articleList}>
            {filteredArticles.map((article) => {
              const active = article.id === selectedArticle?.id;

              return (
                <button
                  key={article.id}
                  type="button"
                  onClick={() => setSelectedArticleId(article.id)}
                  style={{
                    ...styles.articleButton,
                    ...(active ? styles.activeArticleButton : {}),
                  }}
                >
                  <span style={styles.articleCategory}>
                    {article.category}
                  </span>
                  <strong style={styles.articleTitle}>
                    {article.title}
                  </strong>
                </button>
              );
            })}

            {filteredArticles.length === 0 && (
              <div style={styles.emptyState}>No help articles found.</div>
            )}
          </div>
        </aside>

        <article style={styles.contentCard}>
          {selectedArticle ? (
            <>
              <p style={styles.contentCategory}>
                {selectedArticle.category}
              </p>

              <h2 style={styles.contentTitle}>
                {selectedArticle.title}
              </h2>

              <p style={styles.contentSummary}>
                {selectedArticle.summary}
              </p>

              <div style={styles.contentBody}>
                {selectedArticle.content.map((paragraph, index) => (
                  <p key={index} style={styles.paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>

              <div style={styles.supportCard}>
                <div>
                  <h3 style={styles.supportTitle}>Still need help?</h3>
                  <p style={styles.supportText}>
                    Send feedback or report an issue directly from your account
                    menu.
                  </p>
                </div>

                <button
                  type="button"
                  style={styles.supportButton}
                  onClick={() =>
                    window.open(
                      "/researcher/feedback",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                >
                  <MessageSquare size={17} />
                  Send Feedback
                </button>
              </div>
            </>
          ) : (
            <div style={styles.emptyState}>Select an article to begin.</div>
          )}
        </article>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #020617 0%, #041127 42%, #030b1d 100%)",
    color: "#ffffff",
    padding: "48px 40px 80px",
  },

  hero: {
    maxWidth: 1100,
    margin: "0 auto 32px",
  },

  eyebrow: {
    margin: 0,
    color: "#38bdf8",
    fontSize: 13,
    fontWeight: 900,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
  },

  title: {
    margin: "14px 0 0",
    fontSize: "clamp(3rem, 5vw, 5rem)",
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: "-0.05em",
  },

  subtitle: {
    margin: "18px 0 0",
    maxWidth: 780,
    color: "#94a3b8",
    fontSize: 18,
    lineHeight: 1.7,
  },

  searchBox: {
    marginTop: 28,
    maxWidth: 680,
    height: 56,
    borderRadius: 16,
    border: "1px solid rgba(148,163,184,0.18)",
    background: "#020817",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "0 18px",
  },

  searchInput: {
    flex: 1,
    height: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#ffffff",
    fontSize: 16,
  },

  layout: {
    maxWidth: 1100,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "320px minmax(0, 1fr)",
    gap: 24,
    alignItems: "start",
  },

  sidebar: {
    borderRadius: 24,
    background: "rgba(15,23,42,0.88)",
    border: "1px solid rgba(148,163,184,0.14)",
    overflow: "hidden",
  },

  sidebarHeader: {
    padding: "18px 20px",
    borderBottom: "1px solid rgba(148,163,184,0.12)",
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "#e2e8f0",
    fontWeight: 800,
  },

  articleList: {
    padding: 12,
    display: "grid",
    gap: 8,
  },

  articleButton: {
    border: "1px solid transparent",
    borderRadius: 16,
    background: "transparent",
    color: "#ffffff",
    textAlign: "left",
    padding: 14,
    cursor: "pointer",
  },

  activeArticleButton: {
    background: "rgba(59,130,246,0.12)",
    border: "1px solid rgba(59,130,246,0.22)",
  },

  articleCategory: {
    display: "block",
    color: "#38bdf8",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: 6,
  },

  articleTitle: {
    display: "block",
    color: "#e2e8f0",
    fontSize: 14,
    lineHeight: 1.4,
  },

  contentCard: {
    minHeight: 520,
    borderRadius: 28,
    background: "rgba(15,23,42,0.9)",
    border: "1px solid rgba(148,163,184,0.14)",
    padding: 36,
    boxShadow: "0 28px 80px rgba(0,0,0,0.3)",
  },

  contentCategory: {
    margin: 0,
    color: "#38bdf8",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
  },

  contentTitle: {
    margin: "12px 0 0",
    color: "#ffffff",
    fontSize: 34,
    fontWeight: 900,
    letterSpacing: "-0.03em",
    lineHeight: 1.15,
  },

  contentSummary: {
    margin: "14px 0 0",
    color: "#94a3b8",
    fontSize: 17,
    lineHeight: 1.7,
  },

  contentBody: {
    marginTop: 28,
    display: "grid",
    gap: 16,
  },

  paragraph: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: 16,
    lineHeight: 1.85,
  },

  supportCard: {
    marginTop: 36,
    padding: 20,
    borderRadius: 20,
    background: "rgba(59,130,246,0.08)",
    border: "1px solid rgba(59,130,246,0.16)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
  },

  supportTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: 18,
    fontWeight: 900,
  },

  supportText: {
    margin: "6px 0 0",
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 1.6,
  },

  supportButton: {
    border: "none",
    borderRadius: 14,
    padding: "12px 16px",
    background: "#3b82f6",
    color: "#ffffff",
    fontWeight: 800,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    whiteSpace: "nowrap",
  },

  emptyState: {
    padding: 20,
    color: "#94a3b8",
    textAlign: "center",
  },
};