import express from 'express';
import db from '../db.js';

import dayjs from 'dayjs';

const router = express.Router();

// Get all unseen notifications for user
router.get('/', (req, res) => {
  // const {uid} = req.userId; // from authMiddleware
  // console.log(`uid is: ${req.userId}`)
  const uid_auth = req.userId;
  const getNotif = db.prepare(`SELECT * FROM notifications WHERE seen = FALSE AND user_id = ? ORDER BY date DESC`);
  const notif = getNotif.all(uid_auth);

  res.json(notif);
})

// Create a new notification
router.post('/', (req, res) => {
  const {user_id, post_id} = req.body;
  // const uid_auth = req.userId;

  // console.log(`title: ${title}\ncontent: ${content}`);

  const insertPost = db.prepare(`
    INSERT INTO notifications(user_id, post_id, date, seen)
    VALUES (?, ?, ?, ?)`
  )
  const date = dayjs().format('YYYY/MM/DD - HH:mm:ss');
  const result = insertPost.run(user_id, post_id, date, 0);

  res.json({pid: result.lastInsertRowid, message:"success"}) // send more info back?
})



export default router;