const express = require('express');
const db = require('../config/db');
const { User } = require('../models/models');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'status']
    });
    res.send(users);
  } catch (error) {
    console.error('error fetching users:', error);
    res.status(500).send({ message: 'server error' });
  }
});


router.post('/unblock', async (req, res) => {
  const { userIds } = req.body;
  try {
    await User.update(
      { status: 'active' },
      { where: { id: userIds } }
    );
    res.send('Users unblocked');
  } catch (err) {
    res.status(500).send('Server error');
  }
});



router.get('/me', async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  //console.log('step 1');
  if (!token) {
    return res.status(401).send('No access');
  }
  //console.log('step 2');
  try {
    
    //console.log('step 3');
    //console.log('token: ', token);
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    
    /*try{
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      console.log('Decoded: ', decoded);
    }
    catch(err){
      console.log('Error decode: ', err);
    }*/


    //console.log('step 4');
    const currentUserId = decoded.userId;
    //console.log(`step 5, currentUserId ${currentUserId}`);
    const user = await User.findByPk(currentUserId, { attributes: ['name'] });
    //console.log(`step 6 ${user}`);
    if (!user) {
      return res.status(404).send('User not found');
    }
    //console.log('step 7');
    res.send({ name: user.name, currentUserId });
  } catch (err) {
    //console.log('step error', err);
    res.status(500).send('Server error name');
  }
});

router.get('/role', async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).send('No access');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const currentUserId = decoded.userId;
    const user = await User.findByPk(currentUserId, { attributes: ['role'] });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.send({ role: user.role });
  } catch (err) {
    res.status(500).send('Server error role');
  }
});


router.get('/nameById', async (req, res) => {
  try {
    const currentUserId = req.query.id;
    //console.log('nameById, currentUserId: ', currentUserId);
    const user = await User.findByPk(currentUserId, { attributes: ['name'] });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.send({ name: user.name });
  } catch (err) {
    res.status(500).send('Server error name');
  }
});


router.post('/block', async (req, res) => {
  const { userIds } = req.body;

  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).send('No access');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const currentUserId = decoded.userId;

    //console.log('step 1'); 
    if (userIds.includes(currentUserId)) {
      return res.status(400).send({ message: 'Admin cant block himself', selfBlocked: true });
    }

    await User.update(
      { status: 'blocked' },
      { where: { id: userIds } }
    );


    res.send('Users blocked');
  } catch (err) {
    res.status(500).send('Server error');
  }
});



router.post('/delete', async (req, res) => {
  const { userIds } = req.body;

  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).send('No access');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const currentUserId = decoded.userId;

    if (userIds.includes(currentUserId)) {
      return res.status(400).send({ message: 'Admin cant delete himself', selfDeleted: true });
    }

    await User.destroy({ where: { id: userIds } });

    res.send('Users deleted');
  } catch (err) {
    res.status(500).send('Server error');
  }
});




module.exports = router;