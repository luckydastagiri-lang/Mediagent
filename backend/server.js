require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { initDb } = require("./db");

const sessionsRouter = require("./routes/sessions");
const chatRouter = require("./routes/chat");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/sessions", sessionsRouter);
app.use("/api/chat", chatRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "MediAgent API is running" });
});

// Init DB then start server
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n🏥 MediAgent Backend running on http://localhost:${PORT}`);
      console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });