const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const { Op, DataTypes } = require('sequelize');
const { QueryTypes } = require('sequelize');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { Tag, ItemTag } = require('../models/models');


router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({ 
      attributes: [
        'id',
        'name'
      ] 
    });
    if (!tags) {
      return res.status(404).send('tags not found');
    }
    res.json(tags);
  } catch (err) {
    res.status(500).send('Server error tags');
  }
});




router.get('/popular', async (req, res) => {
  try {
    
    const quantity = parseInt(req.query.quantity, 10) || 10;
    //console.log('step 1 maxLim', req.query.quantity);
    
    const popularTags = await sequelize.query(
      `SELECT t.id, t.name, COUNT(it.tag_id) as count
       FROM Tags t
       JOIN Item_tags it ON t.id = it.tag_id
       GROUP BY t.id
       ORDER BY count DESC
       LIMIT :quantity`,
      {
        replacements: { quantity }, 
        type: QueryTypes.SELECT,
      }
    );

    res.json(popularTags);
  } catch (error) {
    console.error('Error fetching popular tags:', error);
    res.status(500).send({ message: 'Server error' });
  }
});





module.exports = router; 