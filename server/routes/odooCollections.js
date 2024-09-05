const express = require('express');
const router = express.Router();
const { User, Collection, Item } = require('../models/models');

router.get('/odooCollections', async (req, res) => {
  const { api_token } = req.query;
  //console.log('step 1', api_token);
  if (!api_token) {
    return res.status(400).json({ error: 'API token is required' });
  }

  try {

    const user = await User.findOne({ where: { api_token } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userName = user.name;
    //console.log('step 2', user);
    const collections = await Collection.findAll({ where: { user_id: user.id } });
    
    const collectionsWithItemCount = await Promise.all(
      collections.map(async (collection) => {

        const itemCount = await Item.count({ where: { collection_id: collection.id } });

        return { ...collection.toJSON(), item_count: itemCount, user_name: userName };
      })
    );
    //console.log('step 3', itemCount);

    res.json(collectionsWithItemCount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
