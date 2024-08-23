const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { Collection, Item, User, CollectionLike, Category, Tag } = require('../models/models');


router.get('/', async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  let currentUserId = null;

  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    currentUserId = decoded.userId;
  }

  try {
    const collections = await Collection.findAll({
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

    const answer = collections.map(collection => {
      const likesCount = collection.likedByUsers.length;
      const isLiked = currentUserId ? collection.likedByUsers.some(user => user.id == currentUserId) : false;

      return {
        ...collection.toJSON(),
        likesCount,
        isLiked,
        itemCount: collection.get('itemsCount') 
      };
    });

    res.json(answer);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



router.get('/userCollections', async (req, res) => {
  //const { userId } = req.params;
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  let currentUserId = null;

  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    currentUserId = decoded.userId;
  }
  const collectionUserId = req.query.supId;
  //console.log('step 1', collectionUserId);
  try {
    const collections = await Collection.findAll({
      where: { user_id: collectionUserId },
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

    const answer = collections.map(collection => {
      const likesCount = collection.likedByUsers.length;
      const isLiked = currentUserId ? collection.likedByUsers.some(user => user.id == currentUserId) : false;

      return {
        ...collection.toJSON(),
        likesCount,
        isLiked,
        itemCount: collection.get('itemsCount')
      };
    });

    res.json(answer);
  } catch (error) {
    console.error('error fetching user collections:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});





router.get('/like', async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  let currentUserId = null;
  if(token){
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    currentUserId = decoded.userId;
  }
  else { 
    return res.status(401).json({ message: 'user is not authorized' });
  }

  try {
    const collectionId = req.query.collectionId;
    //console.log('step 1 no id', req.query.collectionId);
    if(!collectionId){
      return res.status(400).json({ message: 'no collection id' });
    }
    //console.log('step 1', currentUserId, collectionId);
    const isLiked = await CollectionLike.findOne({ where: { user_id: currentUserId, collection_id: collectionId } });
    //console.log('step 2');
    if(isLiked){
      await CollectionLike.destroy({ where: { user_id: currentUserId, collection_id: collectionId } });
      //console.log('step 3');
      return res.status(200).json({ message: 'disliked' });
    }
    else {
      //console.log('step 1 no way', currentUserId, collectionId);
      await CollectionLike.create({user_id: currentUserId, collection_id: collectionId});
      //console.log('step 2');
      return res.status(200).json({ message: 'liked' });
    }

  }
  catch (err){
    console.error('error while like/dislike', err);
    return res.status(500).json({ message: 'server error like/dislike' });
  }
});




router.get('/categories', async (req, res) => {
  try {
    //console.log('categories: ');
    const categories = await Category.findAll({ 
      attributes: [
        'id',
        'name'
      ] 
    });
    if (!categories) {
      return res.status(404).send('categories not found');
    }
    res.send(categories);
  } catch (err) {
    res.status(500).send('Server error categories');
  }
});

router.get('/tags', async (req, res) => {
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

router.post('/create', async (req, res) => {
  const collection = await Collection.create(req.body);
  res.json(collection);
});





module.exports = router;