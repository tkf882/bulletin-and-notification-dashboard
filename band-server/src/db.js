import { DatabaseSync } from 'node:sqlite'
const db = new DatabaseSync(':memory:')

// Execute SQL statements from strings
db.exec(`
  CREATE TABLE users (
    uid INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`)

db.exec(`
  CREATE TABLE posts (
    pid INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    username TEXT,
    title TEXT,
    content TEXT,
    tags TEXT,
    date TEXT,
    status BOOLEAN DEFAULT 1,
    comment BOOLEAN DEFAULT 0,
    parent INTEGER DEFAULT NULL,
    FOREIGN KEY(user_id) REFERENCES users(uid)
  )    
`)

export default db