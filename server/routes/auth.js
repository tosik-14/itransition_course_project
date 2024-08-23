const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
//const User = require('../models/models');
const { User } = require('../models/models');

console.log('User model:', User);

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' }); //check if have acc
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    //const hashedPassword = password;
    
    const user = await User.create({ name, email, password: hashedPassword });

    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});






router.post('/login', async (req, res) => {
  //console.log('CHECK CHECK CHECK');
  const user_email = await User.findOne({ where: { email: req.body.email } });
  //console.log('CHECK CHECK CHECK');

  if (!user_email || !bcrypt.compareSync(req.body.password, user_email.password)) {
  //if (!user_email || req.body.password != user_email.password) {
    //console.log('CHECK CHECK CHECK SERVER');
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if(user_email.status == 'blocked'){
    return res.status(403).send({ message: 'User is blocked' });
  }

  const token = jwt.sign({ userId: user_email.id, role: user_email.role }, process.env.JWT_KEY);
  res.json({ token });

});

module.exports = router;