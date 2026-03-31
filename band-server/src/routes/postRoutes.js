import express from 'express';
import db from '../db.js';

import dayjs from 'dayjs';

const router = express.Router();

// Get all posts
router.get('/:sort', (req, res) => {
  // const getPosts = db.prepare(`SELECT * FROM posts WHERE user_id = ?`);
  // const posts = getPosts.all(req.userId);
  const {sort} = req.params; // 0: Date (Desc), 1: Date (Asc), 2: Title (Desc), 3: Title (Asc)
  let type = 'title';
  let order = 'DESC';

  if (sort === '0') {
    type = 'date';
    order = 'DESC'
  } else if (sort === '1') {
    type = 'date';
    order = 'ASC'
  } else if (sort === '2') {
    type = 'title';
    order = 'DESC'
  } else if (sort === '3') {
    type = 'title';
    order = 'ASC'
  }

  // console.log(`ORDER BY ${type} ${order}`);

  const getPosts = db.prepare(`SELECT * FROM posts ORDER BY ${type} ${order}`);
  const posts = getPosts.all();

  // console.log(posts);
  res.json(posts);
})

// Get all posts with parent != null (i.e., comment), and parent = req.body.pid;
router.get('/comments/:pid', (req, res) => {
  const {pid} = req.params;
  const getComments = db.prepare(`SELECT * FROM posts WHERE parent = ? ORDER BY date DESC`);
  const comments = getComments.all(pid);

  res.json(comments);
})

// Create a new post
router.post('/', (req, res) => {
  const {title, content, username, parent, tagString} = req.body;

  // console.log(`title: ${title}\ncontent: ${content}`);

  const insertPost = db.prepare(`
    INSERT INTO posts(user_id, username, title, content, tags, date, status, parent)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )
  const date = dayjs().format('YYYY/MM/DD - HH:mm:ss');
  const tags = tagString;
  // req.userId is inserted into the request from authMiddleware
  const result = insertPost.run(req.userId, username, title, content, tags, date, 1, parent);

  res.json({pid: result.lastInsertRowid, message:"success"}) // send more info back?


})

// Update/edit a new post
router.put('/:id', (req, res) => {
  const {title, content, tagString} = req.body;
  const {id} = req.params; // i.e., posts/2
  // const {page} = req.query // i.e., posts/?page=1

  const updatedPost = db.prepare(`UPDATE posts SET title = ?, content = ?, tags = ? WHERE pid = ?`);
  updatedPost.run(title, content, tagString, id);

  res.json({message:"post edited"})
})

// Delete a post
router.delete('/:id', (req, res) => {
  const {id} = req.params;
  const userId = req.userId;

  const deletePosts = db.prepare(`DELETE FROM posts WHERE pid = ? AND user_id = ?`);
  deletePosts.run(id, userId);

  res.json({message:"deleted"})

})

export default router;