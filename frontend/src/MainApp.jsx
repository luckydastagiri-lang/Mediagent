import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar.jsx";
import ChatArea from "./components/ChatArea.jsx";
import RightPanel from "./components/RightPanel.jsx";
import {
  fetchSessions,
  createSession,
  deleteSession,
  sendChatMessage,
} from "./api.js";

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [clinicalData, setClinicalData] = useState(null);
  const [quickReplies, setQuickReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [langBadge, setLangBadge] = useState("EN");
  const [voiceActive, setVoiceActive] = useState(false);

  useEffect(() => {
    fetchSessions()
      .then(setSessions)
      .catch(() => console.warn("Running in offline mode"));
  }, []);

  async function handleNewSession() {
    try {
      const session = await createSession();
      setSessions((prev) => [session, ...prev]);
      setCurrentSessionId(session.id);
      setMessages([]);
      setClinicalData(null);
      setQuickReplies([]);
    } catch {
      const fallbackId = `session_${Date.now()}_offline`;
      const session = { id: fallbackId, created_at: new Date().toISOString(), preview: "New consultation" };
      setSessions((prev) => [session, ...prev]);
      setCurrentSessionId(fallbackId);
      setMessages([]);
      setClinicalData(null);
      setQuickReplies([]);
    }
  }

  function handleSelectSession(id) {
    setCurrentSessionId(id);
    setMessages([]);
    setClinicalData(null);
    setQuickReplies([]);
  }

  async function handleDeleteSession(id) {
    try { await deleteSession(id); } catch {}
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (currentSessionId === id) {
      setCurrentSessionId(null);
      setMessages([]);
      setClinicalData(null);
      setQuickReplies([]);
    }
  }

  const handleSend = useCallback(
    async (text) => {
      if (!text || loading) return;

      let sessionId = currentSessionId;
      if (!sessionId) {
        try {
          const session = await createSession();
          setSessions((prev) => [session, ...prev]);
          sessionId = session.id;
          setCurrentSessionId(session.id);
        } catch {
          const fallbackId = `session_${Date.now()}_offline`;
          const session = { id: fallbackId, created_at: new Date().toISOString(), preview: text.slice(0, 40) };
          setSessions((prev) => [session, ...prev]);
          sessionId = fallbackId;
          setCurrentSessionId(fallbackId);
        }
      }

      const newMessages = [...messages, { role: "user", content: text }];
      setMessages(newMessages);
      setQuickReplies([]);
      setLoading(true);

      // Update session preview on first message
      if (messages.length === 0) {
        const preview = text.slice(0, 55) + (text.length > 55 ? "..." : "");
        setSessions((prev) => prev.map((s) => s.id === sessionId ? { ...s, preview } : s));
      }

      try {
        const data = await sendChatMessage(sessionId, newMessages);
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
        if (data.clinicalData) {
          setClinicalData(data.clinicalData);
          if (data.clinicalData.lang) setLangBadge(data.clinicalData.lang.toUpperCase().slice(0, 2));
          if (data.clinicalData.suggestedReplies) setQuickReplies(data.clinicalData.suggestedReplies);
        }
      } catch (err) {
        setMessages((prev) => [...prev, { role: "assistant", content: err.message || "Something went wrong. Please try again." }]);
      } finally {
        setLoading(false);
      }
    },
    [currentSessionId, messages, loading]
  );

  function handleVoice() {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice recognition is not supported in this browser. Please use Chrome.");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SR();
    recog.continuous = false;
    recog.interimResults = false;
    setVoiceActive(true);
    recog.onresult = (e) => {
      const [[{ transcript }]] = e.results;
      handleSend(transcript);
    };
    recog.onend = () => setVoiceActive(false);
    recog.onerror = () => setVoiceActive(false);
    recog.start();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
      <header style={{ display: "flex", alignItems: "center", padding: "0 20px", gap: 12, height: 56, background: "#fff", borderBottom: "0.5px solid rgba(0,0,0,0.1)", flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, background: "var(--teal)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 4v16M8 8l4-4 4 4M4 12h16" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
        </div>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: -0.3 }}>
          Medi<span style={{ color: "var(--teal)", fontStyle: "italic" }}>Agent</span>
        </span>
        <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 20, background: "#f9f9f7", color: "var(--text-muted)", border: "0.5px solid rgba(0,0,0,0.1)" }}>
          {langBadge}
        </span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, background: "#FAEEDA", color: "#BA7517", padding: "3px 10px", borderRadius: 20, border: "0.5px solid #FAC775", fontWeight: 500 }}>
            Not a replacement for a licensed physician
          </span>
          <button
            onClick={handleVoice}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, border: "0.5px solid var(--teal)", background: voiceActive ? "var(--coral)" : "var(--teal-light)", color: voiceActive ? "#fff" : "var(--teal)", fontSize: 13, fontWeight: 500, transition: "all 0.2s" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" fill="currentColor" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M9 22h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {voiceActive ? "Listening..." : "Live Voice"}
          </button>
          <button
            onClick={() => { localStorage.removeItem("user"); window.location.reload(); }}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, border: "0.5px solid var(--coral)", background: "var(--coral-light)", color: "var(--coral)", fontSize: 13, fontWeight: 500, transition: "all 0.2s" }}
            title="Logout"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <Sidebar
          sessions={sessions}
          currentId={currentSessionId}
          onNew={handleNewSession}
          onSelect={handleSelectSession}
          onDelete={handleDeleteSession}
        />
        <ChatArea
          messages={messages}
          loading={loading}
          quickReplies={quickReplies}
          onSend={handleSend}
        />
        <RightPanel clinicalData={clinicalData} />
      </div>
    </div>
  );
}
