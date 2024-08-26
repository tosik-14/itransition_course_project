const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const { Op, DataTypes } = require('sequelize');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { Collection, Item, User, CollectionLike, Category, Tag, ItemTag, Comment } = require('../models/models');
const { getCollectionCards, getUserId } = require('./utility');


router.get('/', async (req, res) => {
  const currentUserId = getUserId(req, process.env.JWT_KEY);

  try {
    const collections = await getCollectionCards();

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






router.get('/top5', async (req, res) => {
  const currentUserId = getUserId(req, process.env.JWT_KEY);

  try {
    const collections = await getCollectionCards();

     const collectionsFull = collections.map(collection => {
      const likesCount = collection.likedByUsers.length;
      const isLiked = currentUserId ? collection.likedByUsers.some(user => user.id == currentUserId) : false;

      return {
        ...collection.toJSON(),
        likesCount,
        isLiked,
        itemCount: collection.get('itemsCount')
      };
    });

   
    const top5Collections = collectionsFull
      .sort((a, b) => b.itemCount - a.itemCount) 
      .slice(0, 6);

    res.json(top5Collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});










router.get('/userCollections', async (req, res) => {
  const currentUserId = getUserId(req, process.env.JWT_KEY);
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
  const currentUserId = getUserId(req, process.env.JWT_KEY);
  if (currentUserId == null) { 
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




const createWithTransaction = async (collectionId, currentUserId, title, category, description, imageUrl, items) => {
    
  //console.log('step 1');  
  const tr = await sequelize.transaction();
  console.log('step 2');  

  try{
    console.log('edit collection: ', collectionId);
    let collection;

    if(collectionId){
      collection = await Collection.findByPk(collectionId, {transaction: tr});
    
      if(!collection){
        throw new Error('no collections with id=', collectionId);
      }

      collection.title = title;
      collection.description = description;
      collection.category_id = category;
      collection.image_url = imageUrl;

      await collection.save({ transaction: tr });

    }
    else{

      collection = await Collection.create({
        title: title,
        description: description,
        category_id: category,
        image_url: imageUrl,
        user_id: currentUserId
      }, { transaction: tr });
      console.log('new collection: ', collection);

    }
    

    if(collectionId){
      await ItemTag.destroy({
        where: { item_id: { [Op.in]: items.map(item => item.id) } },
        transaction: tr
      });

      await Item.destroy({
        where: { collection_id: collection.id },
        transaction: tr
      });
    }
    

    if(items && items.length > 0){
        
      for(let itemData of items){
        const newItem = await Item.create({
          name: itemData.name,
          collection_id: collection.id
        }, {transaction: tr });

        //console.log('new item: ', newItem);

        if(itemData.tags && itemData.tags.length > 0){

          //console.log('itemData.tags: ', itemData.tags);
          for(let tagFull of itemData.tags){

            const tagName = tagFull.name;

            let newTag = await Tag.findOrCreate({
              where: { name: tagName }, 
              defaults: { name: tagName },
              transaction: tr
            });

            //console.log('newTag: ', newTag);
            newTag = newTag[0];

            await ItemTag.create({
              item_id: newItem.id,
              tag_id: newTag.id
            }, {transaction: tr });

          }
          
        }

      }
    }
    await tr.commit();
    return collection;
  } catch (err) {

    await tr.rollback();
    console.error('create collection error server func', err);
    throw err;
  }

}


router.post('/create', async (req, res) => {
  const currentUserId = getUserId(req, process.env.JWT_KEY);
  if (currentUserId == null) { 
    return res.status(401).json({ message: 'user is not authorized' });
  }

  const { id, title, category, description, imageUrl, items } = req.body;
  
  console.log('full: ', id, currentUserId, title, category, description, imageUrl, JSON.stringify(items, null, 2));

  try{
    const newCollection = await createWithTransaction(id, currentUserId, title, category, description, imageUrl, items);
    console.log('newCollection: ', newCollection);
    res.status(201).json(newCollection);
  } catch(err) {
    console.error('create collection error server rout', err);
    res.status(500).send('server error add collection');
  }


});



const deleteWithTransaction = async (collectionId) => {
    
  //console.log('step 1');  
  const tr = await sequelize.transaction();
  console.log('step 2');  

  try{
    console.log('delete collection: ', collectionId);
    
    const items = await Item.findAll({
      where: { collection_id: collectionId },
      transaction: tr
    });
        
    const itemIds = items.map(item => item.id)

    await ItemTag.destroy({
      where: { item_id: { [Op.in]: itemIds } },
      transaction: tr
    });

    await CollectionLike.destroy({
      where: { collection_id: collectionId },
      transaction: tr
    });
    await Item.destroy({
      where: { collection_id: collectionId },
      transaction: tr
    });
    
    await Comment.destroy({
      where: { collection_id: collectionId },
      transaction: tr
    });

    await Collection.destroy({
      where: { id: collectionId },
      transaction: tr
    });

    await tr.commit();
    //return collection;
  } catch (err) {

    if (tr) await tr.rollback();
    console.error('create collection error server func', err);
    throw err;
  }

}



router.post('/delete', async (req, res) => {
  const currentUserId = getUserId(req, process.env.JWT_KEY);
  if (currentUserId == null) { 
    return res.status(401).json({ message: 'user is not authorized' });
  }

  const { supId } = req.body;


  console.log('collection: ', supId);
  
  try{
    const deleteCollection = await deleteWithTransaction(supId);
    console.log('collection deleted: ', deleteCollection);
    res.status(201).json(deleteCollection);
  } catch(err) {
    console.error('delete collection error server rout', err);
    res.status(500).send('server error delete collection');
  }
});



module.exports = router;