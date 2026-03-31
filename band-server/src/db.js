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
    parent INTEGER DEFAULT NULL,
    FOREIGN KEY(user_id) REFERENCES users(uid)
  )    
`)

db.exec(`
  CREATE TABLE tags (
    tid INTEGER PRIMARY KEY AUTOINCREMENT,
    tag_name TEXT UNIQUE
  )`
)

db.exec(`
  CREATE TABLE notifications (
    nid INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    post_id INTEGER,
    date TEXT,
    seen BOOLEAN DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(uid),
    FOREIGN KEY(post_id) REFERENCES posts(pid)
  )`
)

const insertTag = db.prepare(`
  INSERT INTO tags(tag_name)
  VALUES (?)`
)
insertTag.run('Intro'); // default tag for new account posts
insertTag.run('Discussion');
insertTag.run('Question');
insertTag.run('Announcement');

export default db