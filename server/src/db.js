const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const dataDir = path.join(__dirname, '..', 'data');
fs.mkdirSync(dataDir, { recursive: true });

const db = new DatabaseSync(path.join(dataDir, 'profilehub.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at    TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS profiles (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id       INTEGER NOT NULL UNIQUE REFERENCES users(id),
    full_name     TEXT NOT NULL,
    phone         TEXT,
    city          TEXT,
    department    TEXT,
    date_of_birth TEXT,
    bio           TEXT,
    created_at    TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Profile IDs start at 101 so they are easy to tell apart from user IDs
db.exec(`
  INSERT INTO sqlite_sequence (name, seq)
  SELECT 'profiles', 100
  WHERE NOT EXISTS (SELECT 1 FROM sqlite_sequence WHERE name = 'profiles');
`);

module.exports = db;
