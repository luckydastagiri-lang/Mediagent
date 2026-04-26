// TEMP DISABLE DB FOR DEPLOYMENT
// const sqlite3 = require("sqlite3").verbose();
const path = require("path");
require("dotenv").config();

const DB_PATH = process.env.DB_PATH
  ? path.resolve(__dirname, process.env.DB_PATH)
  : path.resolve(__dirname, "../db/mediagent.db");

let db;

function getDb() {
  if (!db) {
    // db = new sqlite3.Database(DB_PATH, (err) => {
    //   if (err) {
    //     console.error("Failed to connect to SQLite:", err.message);
    //   } else {
    //     console.log("Connected to SQLite database at", DB_PATH);
    //   }
    // });
    db = {
      run: function(...args) {
        const callback = args.find(a => typeof a === 'function');
        if (callback) callback.call({ lastID: 0, changes: 0 }, null);
      },
      all: function(...args) {
        const callback = args.find(a => typeof a === 'function');
        if (callback) callback(null, []);
      },
      get: function(...args) {
        const callback = args.find(a => typeof a === 'function');
        if (callback) callback(null, undefined);
      },
      serialize: function(fn) { if (fn) fn(); }
    };
  }
  return db;
}

function initDb() {
  console.log("⚠️ DB disabled (temporary for deployment)");
  return Promise.resolve();
}

module.exports = { getDb, initDb };
