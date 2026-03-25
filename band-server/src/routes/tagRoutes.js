import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all tags
router.get('/', (req, res) => {

  const getTags = db.prepare(`SELECT * FROM tags ORDER BY tag_name ASC`);
  const tags = getTags.all();

  res.json(tags);
})

// Create a new tag
router.post('/', (req, res) => {
  const {tag} = req.body;

  const insertTag = db.prepare(`
    INSERT INTO tags(tag)
    VALUES (?)`
  )

  const result = insertTag.run(tag);

  res.json({pid: result.lastInsertRowid, message:"success"}) // send more info back?
})



export default router;