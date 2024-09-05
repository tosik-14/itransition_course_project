const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { Collection, Item, Category, Comment, User, CollectionLike, ItemTag, Tag } = require('../models/models');


router.get('/viewCollection', async (req, res) => {
  const collectionId = req.query.supId;
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  let currentUserId = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      currentUserId = decoded.userId;
    } catch (err) {
      console.log('unauthenticated user');
    }
  }

  //console.log('step 1 supId - userId', collectionId, currentUserId); // ?  collectionId

  try {
    const collection = await Collection.findOne({
      where: { id: collectionId },
      attributes: [
        'id',
        'title',
        'description',
        'image_url',
        [sequelize.literal(`(SELECT COUNT(*) FROM Items WHERE Items.collection_id = Collection.id)`), 'itemsCount']
        //[sequelize.fn('COUNT', sequelize.col('Items.id')), 'itemsCount']  //dont work. why?
      ],
      include: [
        {
          model: Category,
          attributes: ['id', 'name']
        },

        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name']
        },

        {
          model: Item,
          attributes: ['id', 'name'],
          include: [
            {
              model: Tag,
              attributes: ['id', 'name'],
              through: { attributes: [] }
            }
          ]
        },
        {
          model: Comment,
          attributes: ['id', 'text', 'user_id'],
          include: [
            {
              model: User,
              attributes: [ 'id', 'name' ]
            }
          ]
        },
        {
          model: User,
          as: 'likedByUsers',
          attributes: ['id'],
          through: { attributes: [] }
        }
      ],
      group: [
        'Collection.id',
        'Category.id',
        'owner.id',
        'Items.id',
        'Items.Tags.id',
        'Comments.id',
        'likedByUsers.id'
      ]
    });

    //console.log('items count server:', collection.get('itemsCount'));

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    const likesCount = collection.likedByUsers.length;
    const isLiked = currentUserId
      ? collection.likedByUsers.some(user => user.id == currentUserId)
      : false;

    

    const response = {            // мама
      ...collection.toJSON(),
      likesCount,
      isLiked,
      itemCount: collection.get('itemsCount'),
      category: collection.Category,
      user: collection.owner,
      items: collection.Items.map(item => ({
        id: item.id,
        name: item.name,
        tags: item.Tags
      })),
      comments: collection.Comments.map(comment => ({
        id: comment.id,
        text: comment.text,
        userId: comment.user_id,
        userName: comment.User.name
      }))
    };


    res.json(response);
  } catch (error) {
    console.error('Error fetching full collection:', error);
    res.status(500).json({ message: 'Internal Server Error view collection' });
  }
});


module.exports = router;