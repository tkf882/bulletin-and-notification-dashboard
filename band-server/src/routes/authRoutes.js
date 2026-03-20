import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

import dayjs from 'dayjs';

const router = express.Router();

// Register a new user /auth/register
router.post('/register', (req, res) => {
  const {username, password} = req.body;
  // console.log(username, password);

  // Save username and hashed password
  const hashedPassword = bcrypt.hashSync(password, 8);

  try {
    const insertUser = db.prepare(`
      INSERT INTO users (username, password)
      VALUES (?, ?)  
    `)
    const result = insertUser.run(username, hashedPassword);

    // Create a new post
    const postTitle = `Hello, my name is ${username}`;
    const postContent = "This is my first post.";
    const tags = "";
    const date = dayjs().format('HH:mm:ss - DD/MM/YYYY');
    const insertPost = db.prepare(`
      INSERT INTO posts(user_id, username, title, content, tags, date, status, parent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    insertPost.run(result.lastInsertRowid, username, postTitle, postContent, tags, date, 1, null);

    // create token
    const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET, {expiresIn: '24h'});
    res.json({ token })

  } catch(err) {
    console.log(err.message);
    // res.sendStatus(503);
    res.status(503).send({message: "Username taken"});
  }

})

router.post('/login', (req, res) => {
  // get username, and lookup hashed password associated
  const {username, password} = req.body;

  try {
    const getUser = db.prepare(`SELECT * FROM users WHERE username = ?`)
    const user = getUser.get(username);

    if (!user) {return res.status(404).send({message: "User not found"})}

    // test password string against a hash
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {return res.status(401).send({message: "Invalid password"})}

    // sign and send back token
    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'});
    res.json({ token })

  } catch(err) {
    console.log(err);
    res.sendStatus(503);
  }

})

export default router;