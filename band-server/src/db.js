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
const insertTag = db.prepare(`
  INSERT INTO tags(tag_name)
  VALUES (?)`
)
insertTag.run('intro'); // default tag for new account posts
insertTag.run('test'); // default tag for new account posts
insertTag.run('monkey'); // default tag for new account posts
insertTag.run('coe'); // default tag for new account posts
insertTag.run('fish'); // default tag for new account posts

export default db