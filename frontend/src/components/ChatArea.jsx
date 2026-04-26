import React, { useEffect, useRef } from "react";

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");
}

function speakText(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = 0.95;
  window.speechSynthesis.speak(utt);
}

const STARTERS = [
  "I have a persistent headache",
  "Fever and sore throat since yesterday",
  "Chest tightness and shortness of breath",
  "Stomach pain after eating",
];

export default function ChatArea({ messages, loading, quickReplies, onSend }) {
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function submit() {
    const val = inputRef.current?.value.trim();
    if (!val) return;
    inputRef.current.value = "";
    inputRef.current.style.height = "auto";
    onSend(val);
  }

  function autoResize(el) {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff", overflow: "hidden" }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {messages.length === 0 && !loading ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 10, color: "var(--text-muted)", padding: 20 }}>
            <div style={{ width: 48, height: 48, background: "var(--teal)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 4v16M8 8l4-4 4 4M4 12h16" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--text)" }}>How are you feeling?</h3>
            <p style={{ fontSize: 13, maxWidth: 280, lineHeight: 1.6 }}>Describe your symptoms and I'll help assess your situation and prepare a draft report for your doctor.</p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6, marginTop: 8 }}>
              {STARTERS.map((s) => (
                <button key={s} onClick={() => onSend(s)} style={{ padding: "6px 14px", borderRadius: 20, border: "0.5px solid rgba(0,0,0,0.15)", background: "#f9f9f7", fontSize: 12, color: "var(--text-muted)", cursor: "pointer", transition: "all 0.12s" }}
                  onMouseEnter={(e) => { e.target.style.background = "var(--teal-light)"; e.target.style.color = "var(--teal)"; e.target.style.borderColor = "#9FE1CB"; }}
                  onMouseLeave={(e) => { e.target.style.background = "#f9f9f7"; e.target.style.color = "var(--text-muted)"; e.target.style.borderColor = "rgba(0,0,0,0.15)"; }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => {
            const isUser = m.role === "user";
            return (
              <div key={i} style={{ display: "flex", gap: 10, maxWidth: "85%", alignSelf: isUser ? "flex-end" : "flex-start", flexDirection: isUser ? "row-reverse" : "row" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, background: isUser ? "var(--teal)" : "var(--teal-light)", color: isUser ? "#fff" : "var(--teal)", border: isUser ? "none" : "0.5px solid #9FE1CB" }}>
                  {isUser ? "You" : "AI"}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: isUser ? "flex-end" : "flex-start" }}>
                  <div
                    style={{ padding: "10px 14px", borderRadius: 12, fontSize: 14, lineHeight: 1.6, background: isUser ? "var(--teal)" : "#f9f9f7", color: isUser ? "#fff" : "var(--text)", border: isUser ? "none" : "0.5px solid rgba(0,0,0,0.08)", borderTopRightRadius: isUser ? 3 : 12, borderTopLeftRadius: isUser ? 12 : 3 }}
                    dangerouslySetInnerHTML={{ __html: escapeHtml(m.content) }}
                  />
                  {!isUser && (
                    <button
                      onClick={() => speakText(m.content)}
                      title="Read aloud"
                      style={{ width: 22, height: 22, borderRadius: "50%", border: "0.5px solid rgba(0,0,0,0.15)", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" /></svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}

        {loading && (
          <>
            <div style={{ display: "flex", gap: 10, maxWidth: "85%", alignSelf: "flex-start" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--teal-light)", color: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, border: "0.5px solid #9FE1CB" }}>AI</div>
              <div style={{ padding: "12px 16px", borderRadius: 12, borderTopLeftRadius: 3, background: "#f9f9f7", border: "0.5px solid rgba(0,0,0,0.08)", display: "flex", gap: 4, alignItems: "center" }}>
                {[0, 0.2, 0.4].map((delay, i) => (
                  <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--teal-mid)", display: "inline-block", animation: `pulse 1.2s ${delay}s infinite` }} />
                ))}
              </div>
            </div>
            <div style={{ alignSelf: "center", display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, background: "var(--teal-light)", color: "var(--teal)", fontSize: 11, fontWeight: 500, border: "0.5px solid #9FE1CB" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--teal)", display: "inline-block", animation: "pulse 1s infinite" }} />
              Internal Clinical Review...
            </div>
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Replies */}
      {quickReplies.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "0 24px 10px" }}>
          {quickReplies.map((r, i) => (
            <button key={i} onClick={() => onSend(r)} style={{ padding: "5px 12px", borderRadius: 20, border: "0.5px solid rgba(0,0,0,0.15)", background: "#fff", fontSize: 12, color: "var(--text-muted)", cursor: "pointer", transition: "all 0.12s" }}
              onMouseEnter={(e) => { e.target.style.background = "var(--teal-light)"; e.target.style.color = "var(--teal)"; }}
              onMouseLeave={(e) => { e.target.style.background = "#fff"; e.target.style.color = "var(--text-muted)"; }}
            >
              {r}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: "12px 16px", borderTop: "0.5px solid rgba(0,0,0,0.1)", display: "flex", gap: 8, alignItems: "flex-end" }}>
        <textarea
          ref={inputRef}
          rows={1}
          placeholder="Describe your symptoms..."
          onKeyDown={handleKey}
          onInput={(e) => autoResize(e.target)}
          disabled={loading}
          style={{ flex: 1, resize: "none", padding: "10px 14px", border: "0.5px solid rgba(0,0,0,0.15)", borderRadius: 12, fontSize: 14, lineHeight: 1.5, background: "#f9f9f7", color: "var(--text)", minHeight: 42, maxHeight: 120, outline: "none" }}
        />
        <button
          onClick={submit}
          disabled={loading}
          style={{ width: 40, height: 40, borderRadius: 10, background: loading ? "#f9f9f7" : "var(--teal)", border: "none", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: loading ? "not-allowed" : "pointer" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke={loading ? "#aaa" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
      <div style={{ fontSize: 11, color: "var(--text-hint)", textAlign: "center", padding: "6px 20px", borderTop: "0.5px solid rgba(0,0,0,0.06)", background: "#f9f9f7" }}>
        MediAgent is an AI prescreener only. Always consult a licensed physician before taking any medication.
      </div>

      <style>{`
        @keyframes pulse {
          0%, 60%, 100% { opacity: 0.3; transform: scale(1); }
          30% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
