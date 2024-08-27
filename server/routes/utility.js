const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const { Op, DataTypes } = require('sequelize');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { Collection, Item, User, CollectionLike, Category, Tag, ItemTag, Comment } = require('../models/models');


const getUserId = (req, jwt_key) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, jwt_key);
      return decoded.userId;
    } catch (err) {
      console.error('Error decoding token:', err);
      return null;
    }
  }
  return null;
};

const getCollectionCards = async () => {
  return await Collection.findAll({
    attributes: [
      'id',
      'title',
      'image_url',
      [sequelize.fn('COUNT', sequelize.col('Items.id')), 'itemsCount']
    ],
    include: [
      {
        model: User,
        as: 'likedByUsers',
        attributes: ['id'],
        through: { attributes: [] }
      },
      {
        model: Item,
        attributes: [],
        duplicating: false
      }
    ],
    group: ['Collection.id', 'likedByUsers.id']
  });
};


const getCollectionsToFilter = async () => {
  return await Collection.findAll({
    attributes: [
      'id',
      'title',
      'image_url',
      [sequelize.literal(`(SELECT COUNT(*) FROM Items WHERE Items.collection_id = Collection.id)`), 'itemsCount']
    ],
    include: [
      {
        model: Category,
        attributes: ['id', 'name']
      },
      {
        model: User,
        as: 'likedByUsers',
        attributes: ['id'],
        through: { attributes: [] }
      },
      {
        model: Item,
        attributes: ['id'],
        include: [
          {
            model: Tag,
            attributes: ['name']
          }
        ]
      }
    ],
  });
}




module.exports = {
  getCollectionCards,
  getUserId,
  getCollectionsToFilter,
};