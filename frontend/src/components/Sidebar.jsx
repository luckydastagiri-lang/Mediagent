import React from "react";

const styles = {
  sidebar: {
    width: 260,
    background: "#f9f9f7",
    borderRight: "0.5px solid rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    padding: "16px 12px",
    overflowY: "auto",
    flexShrink: 0,
  },
  newBtn: {
    width: "100%",
    padding: "9px 12px",
    background: "var(--teal)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--radius)",
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 16,
    transition: "background 0.15s",
  },
  label: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 500,
    color: "var(--text-muted)",
    padding: "0 4px",
    marginBottom: 8,
  },
  item: {
    padding: "8px 10px",
    borderRadius: "var(--radius)",
    fontSize: 13,
    cursor: "pointer",
    marginBottom: 2,
    color: "var(--text-muted)",
    transition: "all 0.12s",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemActive: {
    background: "#fff",
    color: "var(--text)",
    fontWeight: 500,
    border: "0.5px solid rgba(0,0,0,0.15)",
  },
  itemDate: { fontSize: 10, color: "var(--text-hint)", marginTop: 2 },
  deleteBtn: {
    background: "none",
    border: "none",
    color: "var(--text-hint)",
    fontSize: 14,
    lineHeight: 1,
    padding: "0 2px",
    cursor: "pointer",
    flexShrink: 0,
  },
  empty: { fontSize: 12, color: "var(--text-hint)", padding: "8px 4px" },
};

export default function Sidebar({ sessions, currentId, onNew, onSelect, onDelete }) {
  return (
    <aside style={styles.sidebar}>
      <button
        style={styles.newBtn}
        onClick={onNew}
        onMouseEnter={(e) => (e.target.style.background = "var(--teal-dark)")}
        onMouseLeave={(e) => (e.target.style.background = "var(--teal)")}
      >
        + New Consultation
      </button>
      <div style={styles.label}>Recent Sessions</div>
      {sessions.length === 0 && <div style={styles.empty}>No sessions yet</div>}
      {sessions.map((s) => (
        <div
          key={s.id}
          style={{ ...styles.item, ...(s.id === currentId ? styles.itemActive : {}) }}
          onClick={() => onSelect(s.id)}
          onMouseEnter={(e) => { if (s.id !== currentId) e.currentTarget.style.background = "#fff"; }}
          onMouseLeave={(e) => { if (s.id !== currentId) e.currentTarget.style.background = ""; }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {s.preview || "New consultation"}
            </div>
            <div style={styles.itemDate}>{new Date(s.created_at).toLocaleDateString()}</div>
          </div>
          <button
            style={styles.deleteBtn}
            onClick={(e) => { e.stopPropagation(); onDelete(s.id); }}
            title="Delete session"
          >
            ×
          </button>
        </div>
      ))}
    </aside>
  );
}
