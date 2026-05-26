import { useEffect, useMemo, useState } from "react";
import ResearcherLayout from "../../components/researcher/ResearcherLayout";
import { researcherApi } from "../../api/researcherApi";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatRole(role = "") {
  if (!role) return "Researcher";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function formatStatus(user) {
  if (user.status === "pending") return "Pending";
  if (user.isActive === false) return "Inactive";
  return "Active";
}

function ResearchersPageSkeleton() {
  return (
    <>
      <section style={styles.card}>
        <div style={styles.workspaceRow}>
          <div>
            <div style={{ ...styles.skeletonLine, width: 260, height: 30 }} />
            <div
              style={{
                ...styles.skeletonLine,
                width: 220,
                height: 14,
                marginTop: 14,
              }}
            />
          </div>

          <div style={{ ...styles.skeletonPill, width: 120, height: 34 }} />
        </div>
      </section>

      <section style={styles.card}>
        <div style={{ ...styles.skeletonLine, width: 180, height: 22 }} />

        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 22,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              ...styles.skeletonBlock,
              flex: 1,
              minWidth: 280,
              height: 46,
            }}
          />

          <div
            style={{
              ...styles.skeletonBlock,
              width: 170,
              height: 46,
            }}
          />
        </div>
      </section>

      <section style={styles.card}>
        <div style={{ ...styles.skeletonLine, width: 220, height: 22 }} />

        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          {[1, 2, 3].map((item) => (
            <div key={item} style={styles.row}>
              <div>
                <div style={{ ...styles.skeletonLine, width: 160, height: 14 }} />
                <div
                  style={{
                    ...styles.skeletonLine,
                    width: 220,
                    height: 12,
                    marginTop: 10,
                  }}
                />
              </div>

              <div style={{ ...styles.skeletonLine, width: 90, height: 14 }} />
              <div style={{ ...styles.skeletonPill, width: 80, height: 28 }} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default function ResearchersPage() {
  const [researchers, setResearchers] = useState([]);
  const [usage, setUsage] = useState(null);
  const [email, setEmail] = useState("");
  const [, setInviteLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState("");

  const usageReady = Boolean(usage);
  const pageLoading = loading || !usageReady;

  const collaborationEnabled =
    usageReady && Boolean(usage.permissions?.collaborationEnabled);

  const canInviteResearchers =
    usageReady && Boolean(usage.permissions?.canInviteResearchers);

  const workspaceLabel = collaborationEnabled
    ? "Institutional Workspace"
    : "Individual Workspace";

  const workspaceDescription = collaborationEnabled
    ? "Unlimited researcher collaboration enabled"
    : "Single researcher access";

  const sortedResearchers = useMemo(() => {
    return [...researchers].sort((a, b) => {
      if (a.role === "owner") return -1;
      if (b.role === "owner") return 1;
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    });
  }, [researchers]);

  async function loadData() {
    const [researchersData, usageData] = await Promise.all([
      researcherApi.getResearchers(),
      researcherApi.getOrganizationUsage(),
    ]);

    return {
      researchers: researchersData.researchers || [],
      usage: usageData,
    };
  }

  useEffect(() => {
    let ignore = false;

    async function run() {
      try {
        setLoading(true);
        setError("");

        const data = await loadData();

        if (!ignore) {
          setResearchers(data.researchers);
          setUsage(data.usage);
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load researchers."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      ignore = true;
    };
  }, []);

  const refreshData = async () => {
    const data = await loadData();

    setResearchers(data.researchers);
    setUsage(data.usage);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setError("");
    setInviteLink("");

    if (!canInviteResearchers) {
      setError("Only workspace owners can invite researchers.");
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError("Please enter a researcher email address.");
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setInviting(true);

      const response = await researcherApi.inviteResearcher(trimmedEmail);

      setInviteLink(response.inviteLink || "");
      setEmail("");

      await refreshData();
    } catch (err) {
      const code = err?.response?.data?.code;
      const message = err?.response?.data?.message;

      if (code === "RESEARCHER_INVITES_NOT_AVAILABLE") {
        setError(
          message ||
            "Researcher collaboration is available on Institutional workspaces."
        );
      } else if (code === "INSUFFICIENT_INVITE_PERMISSION") {
        setError(message || "Only workspace owners can invite researchers.");
      } else {
        setError(message || err?.message || "Failed to invite researcher.");
      }
    } finally {
      setInviting(false);
    }
  };

  return (
    <ResearcherLayout>
      <h1 style={styles.title}>Researchers</h1>

      <p style={styles.subtitle}>
        Manage workspace researchers and collaboration access.
      </p>

      {error && <div style={styles.error}>{error}</div>}

      {pageLoading ? (
        <ResearchersPageSkeleton />
      ) : (
        <>
          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>Workspace Access</h2>

            <div style={styles.workspaceRow}>
              <div>
                <p style={styles.workspaceValue}>{workspaceLabel}</p>
                <p style={styles.muted}>{workspaceDescription}</p>
              </div>

              <span style={styles.badge}>
                {collaborationEnabled ? "Institutional" : "Individual"}
              </span>
            </div>
          </section>

          {canInviteResearchers ? (
            <section style={styles.card}>
              <h2 style={styles.sectionTitle}>Invite Researcher</h2>

              <form onSubmit={handleInvite} style={styles.form}>
                <input
                  type="email"
                  value={email}
                  placeholder="researcher@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  disabled={inviting}
                />

                <button
                  type="submit"
                  disabled={inviting || !email.trim()}
                  style={{
                    ...styles.primaryButton,
                    ...(inviting || !email.trim() ? styles.buttonDisabled : {}),
                  }}
                >
                  {inviting ? "Sending..." : "Invite Researcher"}
                </button>
              </form>
            </section>
          ) : (
            <section style={styles.card}>
              <h2 style={styles.sectionTitle}>Researcher Invitations</h2>

              <p style={styles.muted}>
                {collaborationEnabled
                  ? "Only workspace owners can invite researchers."
                  : "Researcher invitations are available on Institutional workspaces."}
              </p>
            </section>
          )}

          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>Workspace Researchers</h2>

            {sortedResearchers.length === 0 ? (
              <p style={styles.muted}>No researchers found.</p>
            ) : (
              <div style={styles.table}>
                {sortedResearchers.map((researcher) => (
                  <div
                    key={researcher._id || researcher.id}
                    style={styles.row}
                  >
                    <div>
                      <p style={styles.name}>{researcher.name}</p>
                      <p style={styles.email}>{researcher.email}</p>
                    </div>

                    <span style={styles.role}>
                      {formatRole(researcher.role)}
                    </span>

                    <span
                      style={{
                        ...styles.status,
                        ...(researcher.status === "pending"
                          ? styles.statusPending
                          : styles.statusActive),
                      }}
                    >
                      {formatStatus(researcher)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </ResearcherLayout>
  );
}

const styles = {
  title: {
    margin: 0,
    fontSize: 32,
    fontWeight: 800,
    color: "#ffffff",
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    color: "#94a3b8",
    fontSize: 14,
  },

  card: {
    padding: 24,
    borderRadius: 18,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 18px 60px rgba(0,0,0,0.22)",
    marginBottom: 24,
  },

  sectionTitle: {
    margin: 0,
    marginBottom: 16,
    fontSize: 18,
    fontWeight: 700,
    color: "#ffffff",
  },

  workspaceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },

  workspaceValue: {
    margin: 0,
    fontSize: 28,
    fontWeight: 900,
    color: "#ffffff",
  },

  muted: {
    margin: 0,
    color: "#94a3b8",
    fontSize: 14,
  },

  badge: {
    padding: "7px 10px",
    borderRadius: 999,
    background: "rgba(34,197,94,0.12)",
    border: "1px solid rgba(34,197,94,0.22)",
    color: "#86efac",
    fontSize: 12,
    fontWeight: 800,
  },

  form: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },

  input: {
    flex: 1,
    minWidth: 280,
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    outline: "none",
    fontSize: 14,
  },

  primaryButton: {
    border: "none",
    borderRadius: 12,
    padding: "12px 18px",
    background: "#2f4b88",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",

    minWidth: 190,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
  },

  buttonDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },

  table: {
    display: "grid",
    gap: 10,
  },

  row: {
    display: "grid",
    gridTemplateColumns: "1fr auto auto",
    gap: 14,
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  name: {
    margin: 0,
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 800,
  },

  email: {
    margin: "5px 0 0",
    color: "#94a3b8",
    fontSize: 13,
  },

  role: {
    color: "#c4b5fd",
    fontSize: 13,
    fontWeight: 800,
  },

  status: {
    padding: "6px 9px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },

  statusActive: {
    background: "rgba(34,197,94,0.12)",
    color: "#86efac",
  },

  statusPending: {
    background: "rgba(251,191,36,0.12)",
    color: "#fde68a",
  },

  error: {
    padding: 14,
    marginBottom: 24,
    borderRadius: 12,
    background: "rgba(248,113,113,0.12)",
    border: "1px solid rgba(248,113,113,0.28)",
    color: "#fecaca",
    fontSize: 14,
  },

  skeletonLine: {
    borderRadius: 999,
    background:
      "linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.12), rgba(255,255,255,0.06))",
  },

  skeletonBlock: {
    borderRadius: 12,
    background:
      "linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
    border: "1px solid rgba(255,255,255,0.06)",
  },

  skeletonPill: {
    borderRadius: 999,
    background: "rgba(255,255,255,0.08)",
  },
};