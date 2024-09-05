const express = require('express');
const db = require('../config/db');
const { User } = require('../models/models');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { getUserId } = require('./utility');


router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'status'],
      order: [
        ['role', 'DESC']
      ]
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





router.post('/user', async (req, res) => {
  const currentUserId = getUserId(req, process.env.JWT_KEY);
  if (currentUserId == null) { 
    return res.status(401).json({ message: 'user is not authorized' });
  }
  
  try {
    const { userIds } = req.body;

    //console.log('step 1', userIds); 
    /*if (userIds.includes(currentUserId)) {
      return res.status(400).send({ message: 'Admin set role user himself', selfBlocked: true });
    }*/
    await User.update(
      { role: 'user' },
      { where: { id: userIds } }
    );
    
    if (userIds.includes(currentUserId)) {
      return res.status(400).send({ message: 'Admin set role user himself', selfBlocked: false});
    }



    res.send('Users blocked');
  } catch (err) {
    res.status(500).send('Server error');
  }
});




router.post('/admin', async (req, res) => {
  const currentUserId = getUserId(req, process.env.JWT_KEY);
  if (currentUserId == null) { 
    return res.status(401).json({ message: 'user is not authorized' });
  }
  const { userIds } = req.body;
  console.log('step 1', currentUserId, userIds);

  try {
    await User.update(
      { role: 'admin' },
      { where: { id: userIds } }
    );
    res.send('Users updated');
  } catch (err) {
    res.status(500).send('Server error set admin');
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

router.get('/EmailById', async (req, res) => {
  try {
    const currentUserId = req.query.id;
    //console.log('emailById, currentUserId: ', currentUserId);
    const user = await User.findByPk(currentUserId, { attributes: ['email'] });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.send({ email: user.email });
  } catch (err) {
    res.status(500).send('Server error email');
  }
});


router.post('/setToken', async (req, res) => {

  const { id, token } = req.body;
  console.log('currentUserId, token: ', id, token);

  try {
    await User.update({ api_token: token }, { where: { id: id } });
    
    res.status(201);
  } catch (err) {
    console.error('Server error update token: ', err);
    res.status(500).send('Server error update token');
  }
});





router.post('/block', async (req, res) => {
  const currentUserId = getUserId(req, process.env.JWT_KEY);
  if (currentUserId == null) { 
    return res.status(401).json({ message: 'user is not authorized' });
  }
  

  try {
    
    const { userIds } = req.body;

    //console.log('step 1'); 
    await User.update(
      { status: 'blocked' },
      { where: { id: userIds } }
    );

    if (userIds.includes(currentUserId)) {
      return res.status(400).send({ message: 'Admin cant block himself', selfBlocked: true });
    }


    res.send('Users blocked');
  } catch (err) {
    res.status(500).send('Server error');
  }
});



router.post('/delete', async (req, res) => {
  const currentUserId = getUserId(req, process.env.JWT_KEY);
  if (currentUserId == null) { 
    return res.status(401).json({ message: 'user is not authorized' });
  }
  

  try {
    const { userIds } = req.body;

    await User.destroy({ where: { id: userIds } });

    if (userIds.includes(currentUserId)) {
      return res.status(400).send({ message: 'Admin cant delete himself', selfDeleted: true });
    }

    res.send('Users deleted');
  } catch (err) {
    res.status(500).send('Server error');
  }
});




module.exports = router;