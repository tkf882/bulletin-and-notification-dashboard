import express from 'express';
import db from '../db.js';

import dayjs from 'dayjs';

const router = express.Router();

// Get all unseen notifications for user
router.get('/', (req, res) => {
  const uid_auth = req.userId;

  // const getNotif = db.prepare(`SELECT * FROM notifications WHERE seen = FALSE AND user_id = ? ORDER BY date DESC`);
  const getNotif = db.prepare(`SELECT * FROM notifications WHERE user_id = ? ORDER BY date DESC`);
  const notif = getNotif.all(uid_auth);

  // const notificationsQ = db.prepare(`SELECT * FROM notifications`);
  // const notifications = notificationsQ.all();
  // console.log(notifications);

  // console.log(`Getting all notifications for user ${req.userId}`);

  res.json(notif);
});

// Create a new notification
router.post('/', (req, res) => {
  const {user_id, post_id, content_post_id, message} = req.body;
  // const uid_auth = req.userId;

  // console.log(`title: ${title}\ncontent: ${content}`);

  const insertPost = db.prepare(`
    INSERT INTO notifications(user_id, post_id, content_post_id, message, date, seen)
    VALUES (?, ?, ?, ?, ?, ?)`
  )

  const date = dayjs().format('YYYY/MM/DD - HH:mm:ss');
  const result = insertPost.run(user_id, post_id, content_post_id, message, date, 0);

  console.log(`Creating notification from user ${req.userId} for owner of ${post_id}`);

  res.json({nid: result.lastInsertRowid, message:"Notification made"}) // send more info back?
});

// Update a notification
router.put('/:nid', (req, res) => {
  const {nid} = req.params;

  const updatedNotifs = db.prepare(`UPDATE notifications SET seen = ? WHERE nid = ?`);
  updatedNotifs.run(1, nid);

  console.log(`Updating notification from user ${req.userId} set notification ${nid} to seen`);

  res.json({message:"Success"})
});



export default router;