import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all posts
router.get('/', (req, res) => {
  // const getPosts = db.prepare(`SELECT * FROM posts WHERE user_id = ?`);
  // const posts = getPosts.all(req.userId);

  const getPosts = db.prepare(`SELECT * FROM posts`);
  const posts = getPosts.all();

  console.log(posts);
  res.json(posts);
})

// Create a new post
router.post('/', (req, res) => {
  
})

// Update/edit a new post
router.put('/:id', (req, res) => {
  
})

// Delete a post
router.delete('/:id', (req, res) => {
  
})

export default router;