import express from 'express';
import db from '../db.js';

import dayjs from 'dayjs';

const router = express.Router();


router.get('/:type', (req, res) => {

  // const {sort, mostRecentPID} = req.params; // 0: Date (Desc), 1: Date (Asc), 2: Title (Desc), 3: Title (Asc)
  // const {pid, sort} = req.query;

  // either 'all' or 'comments'
  const { type } = req.params; 
  // pid: Associated pid. If -1, then fetch all posts. Otherwise, fetch posts newer than pid
  // sort: 0: Date (Desc), 1: Date (Asc), 2: Title (Desc), 3: Title (Asc)
  const { pid, sort } = req.query; 

  if (type === 'all') {
    // console.log('get all')
    let sortOn = 'title';
    let order = 'DESC';

    if (sort === '0') {
      sortOn = 'date';
      order = 'DESC'
    } else if (sort === '1') {
      sortOn = 'date';
      order = 'ASC'
    } else if (sort === '2') {
      sortOn = 'title';
      order = 'DESC'
    } else if (sort === '3') {
      sortOn = 'title';
      order = 'ASC'
    }

    const getPosts = db.prepare(`SELECT * FROM posts WHERE pid > ? ORDER BY ${sortOn} ${order}`);
    const posts = getPosts.all(pid);
    // console.log('\n\n\n=============== Posts:')
    // console.log(posts);
    console.log(`Get all posts for user ${req.userId} with search ${sortOn}/${order} (${sort})`);
    res.json(posts);
  } else if (type === 'comments') {
    // console.log('get comments');
    const getComments = db.prepare(`SELECT * FROM posts WHERE parent = ? ORDER BY date DESC`);
    const comments = getComments.all(pid);

    // console.log(`comments with pid parent ${pid}`);
    // console.log(comments);

    console.log(`Get comments for user ${req.userId} on post ${pid}`);

    res.json(comments);
  }


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

  console.log(`Creating a post from user ${req.userId} ${parent && `(comment on post ${parent})`}`);

  res.json({pid: result.lastInsertRowid, message:"Post success"}) // send more info back?
})

// Update/edit a new post
router.put('/:id', (req, res) => {
  const {title, content, tagString} = req.body;
  const {id} = req.params; // i.e., posts/2
  // const {page} = req.query // i.e., posts/?page=1

  const postOwner = db.prepare(`SELECT * FROM posts WHERE pid = ?`);
  const postOwnerData = postOwner.all(id);
  console.log(postOwnerData);

  if (postOwnerData[0].user_id !== req.userId) {
    console.log(`User ${req.userId} tried to edit post owned by ${postOwnerData[0].user_id}`);
    res.sendStatus(401);
    return;
  }

  const updatedPost = db.prepare(`UPDATE posts SET title = ?, content = ?, tags = ? WHERE pid = ?`);
  updatedPost.run(title, content, tagString, id);

  console.log(`Updating post from user ${req.userId} on post ${id}`);

  res.json({message:"post edited"})
})

// Delete a post
router.delete('/:id', (req, res) => {
  const {id} = req.params;
  const userId = req.userId;

  const postOwner = db.prepare(`SELECT * FROM posts WHERE pid = ?`);
  const postOwnerData = postOwner.all(id);
  // console.log(postOwnerData);

  if (postOwnerData[0].user_id !== req.userId) {
    console.log(`User ${req.userId} tried to delete post owned by ${postOwnerData[0].user_id}`);
    res.sendStatus(401);
    return;
  }

  const deletePosts = db.prepare(`DELETE FROM posts WHERE pid = ? AND user_id = ?`);
  deletePosts.run(id, userId);

  console.log(`Deleting post from user ${req.userId} on post ${id}`);

  res.json({message:"deleted"})

})

export default router;