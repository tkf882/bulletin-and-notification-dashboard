import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all tags
router.get('/', (req, res) => {

  const getTags = db.prepare(`SELECT * FROM tags ORDER BY tag_name ASC`);
  const tags = getTags.all();

  console.log(`Getting all tags for ${req.userId}`);

  res.json(tags);
})

// Create a new tag
router.post('/', (req, res) => {
  const {tag} = req.body;

  const insertTag = db.prepare(`
    INSERT INTO tags(tag_name)
    VALUES (?)`
  )

  const result = insertTag.run(tag);

  console.log(`Creating tag from user ${req.userId}. New tag ${result.lastInsertRowid}`);

  res.json({tid: result.lastInsertRowid, tag_name:tag}) // send more info back?
})



export default router;