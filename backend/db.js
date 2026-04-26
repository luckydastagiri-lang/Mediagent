const sqlite3 = require("sqlite3").verbose();
const path = require("path");
require("dotenv").config();

const DB_PATH = process.env.DB_PATH
  ? path.resolve(__dirname, process.env.DB_PATH)
  : path.resolve(__dirname, "../db/mediagent.db");

let db;

function getDb() {
  if (!db) {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error("Failed to connect to SQLite:", err.message);
      } else {
        console.log("Connected to SQLite database at", DB_PATH);
      }
    });
  }
  return db;
}

function initDb() {
  const database = getDb();
  return new Promise((resolve, reject) => {
    database.serialize(() => {
      database.run(
        `CREATE TABLE IF NOT EXISTS sessions (
          id TEXT PRIMARY KEY,
          created_at TEXT NOT NULL,
          preview TEXT DEFAULT 'New consultation'
        )`,
        (err) => { if (err) return reject(err); }
      );

      database.run(
        `CREATE TABLE IF NOT EXISTS messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          session_id TEXT NOT NULL,
          role TEXT NOT NULL,
          content TEXT NOT NULL,
          data_json TEXT,
          timestamp INTEGER NOT NULL,
          FOREIGN KEY (session_id) REFERENCES sessions(id)
        )`,
        (err) => {
          if (err) return reject(err);
          console.log("Database tables ready.");
          resolve();
        }
      );
    });
  });
}

module.exports = { getDb, initDb };
