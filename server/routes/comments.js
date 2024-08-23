const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { Comment } = require('../models/models');

router.post('/add', async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).send('No access');
  }
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  const currentUserId = decoded.userId;
  const { collectionId, text } = req.body;
  try {

    const newComment = await Comment.create({
    	collection_id: collectionId,
    	user_id: currentUserId,
    	text: text
    });
    res.status(201).json(newComment);
  } catch (err) {
  	console.error('Server error add comment: ', err);
    res.status(500).send('Server error comment');
  }
});

module.exports = router;