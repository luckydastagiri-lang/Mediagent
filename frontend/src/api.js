const BASE = "http://localhost:5000/api";

// ================= SESSIONS =================

export async function fetchSessions() {
  try {
    const res = await fetch(`${BASE}/sessions`);
    if (!res.ok) throw new Error("Failed to fetch sessions");
    return res.json();
  } catch {
    return []; // fallback
  }
}

export async function createSession() {
  try {
    const res = await fetch(`${BASE}/sessions`, { method: "POST" });
    if (!res.ok) throw new Error("Failed to create session");
    return res.json();
  } catch {
    // fallback (offline mode)
    return {
      id: `session_${Date.now()}`,
      created_at: new Date().toISOString(),
      preview: "New consultation",
    };
  }
}

export async function updateSessionPreview(id, preview) {
  try {
    await fetch(`${BASE}/sessions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preview }),
    });
  } catch {}
}

export async function deleteSession(id) {
  try {
    await fetch(`${BASE}/sessions/${id}`, { method: "DELETE" });
  } catch {}
}

// ================= MESSAGES =================

export async function fetchMessages(sessionId) {
  try {
    const res = await fetch(`${BASE}/sessions/${sessionId}/messages`);
    if (!res.ok) throw new Error("Failed to fetch messages");
    return res.json();
  } catch {
    return [];
  }
}

// ================= CHAT =================

export async function sendChatMessage(sessionId, messages) {
  try {
    const lastMessage = messages[messages.length - 1]?.content;

    if (!lastMessage) {
      return { reply: "⚠️ Please enter a message" };
    }

    const res = await fetch(`${BASE}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId,
        messages: messages,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Chat request failed");
    }

    return {
      reply: data.reply || "⚠️ No response from AI",
      clinicalData: data.clinicalData || null,
    };

  } catch (error) {
    console.error("Chat error:", error);
    return {
      reply: "❌ Error connecting to AI server",
    };
  }
}
