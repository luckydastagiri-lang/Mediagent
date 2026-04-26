const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { getDb } = require("../db");

// GET all sessions
router.get("/", (req, res) => {
  const db = getDb();
  db.all("SELECT * FROM sessions ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST create new session
router.post("/", (req, res) => {
  const db = getDb();
  const id = `session_${Date.now()}_${uuidv4().slice(0, 8)}`;
  const created_at = new Date().toISOString();
  db.run(
    "INSERT INTO sessions (id, created_at) VALUES (?, ?)",
    [id, created_at],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, created_at, preview: "New consultation" });
    }
  );
});

// PATCH update session preview
router.patch("/:id", (req, res) => {
  const db = getDb();
  const { preview } = req.body;
  db.run(
    "UPDATE sessions SET preview = ? WHERE id = ?",
    [preview, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// DELETE a session and its messages
router.delete("/:id", (req, res) => {
  const db = getDb();
  db.run("DELETE FROM messages WHERE session_id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    db.run("DELETE FROM sessions WHERE id = ?", [req.params.id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ success: true });
    });
  });
});

// GET messages for a session
router.get("/:id/messages", (req, res) => {
  const db = getDb();
  db.all(
    "SELECT * FROM messages WHERE session_id = ? ORDER BY timestamp ASC",
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

module.exports = router;
