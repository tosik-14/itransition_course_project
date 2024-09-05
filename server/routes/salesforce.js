const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { User } = require('../models/models');
const axios = require('axios');
const querystring = require('querystring');


router.post('/', async (req, res) => {
  //console.log('step 0', req.body);
  const formData = req.body;

  try {
    
    const accessToken = await getSalesforceAccessToken();  

    console.log('accessToken step 1', accessToken);

    //const result = await createSalesforce(accessToken, formData);
    
    //res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});




async function getSalesforceAccessToken() {
  /*client_id: process.env.SALESFORCE_CLIENT_ID,
      client_secret: process.env.SALESFORCE_CLIENT_SECRET,
      username: process.env.SALESFORCE_USERNAME,
      password: process.env.SALESFORCE_PASSWORD + process.env.SALESFORCE_SECURITY_TOKEN */
  //console.log('step 1', process.env.SALESFORCE_CLIENT_ID);
  //console.log('step 2', process.env.SALESFORCE_CLIENT_SECRET);
  //console.log('step 3', process.env.SALESFORCE_USERNAME);
  //console.log('step 4', process.env.SALESFORCE_PASSWORD);
  //console.log('step 5', process.env.SALESFORCE_SECURITY_TOKEN);
  const pss = process.env.SALESFORCE_PASSWORD + process.env.SALESFORCE_SECURITY_TOKEN;
  //console.log('pass: ', pss);
  try {
    //console.log('data1: ');

    const data = {
      grant_type: 'password',
      client_id: process.env.SALESFORCE_CLIENT_ID,
      client_secret: process.env.SALESFORCE_CLIENT_SECRET,
      username: process.env.SALESFORCE_USERNAME,
      password: process.env.SALESFORCE_PASSWORD + process.env.SALESFORCE_SECURITY_TOKEN
    };
    //console.log('data2: ');
    //console.log('Data:', data); 

    
    const stringifyData = querystring.stringify(data);
    //console.log('stringifyData:', stringifyData);

   
    const response = await axios.post('https://login.salesforce.com/services/oauth2/token', stringifyData, {  //wtf bad request status 400 
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    // + process.env.SALESFORCE_SECURITY_TOKEN

    console.log('step 6', response.data.access_token);
    return response.data.access_token;

  } catch (err) {
    console.error('error get access token:', err, err.response.data);
    throw err;
  }
}




async function createSalesforce(accessToken, formData) {
  try {
    
    
    
    //await saveSalesforceIdToDB(formData.email, salesforceId);

    return response.data;
  } catch (error) {
    console.error('error during create salesforce:', error);
    throw error;
  }
}

async function saveSalesforceIdToDB(email, salesforceId) {
  await User.update({ salesforceId: salesforceId }, { where: { email: email } });
}


module.exports = router; 