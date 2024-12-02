// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// import usermodel from '../models/muser';
// const usermodel = require('../models/muser');

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
// import usermodel from '../models/muser.js';

dotenv.config();


const checkAuth =  (req, res, next) => {


  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(210).json({ success: false, message: "Authorization header not found",caught:true });
  }

  const token = authHeader.split(' ')[1];

  if (token == null) {
    return res.status(210).json({ success: false, message: "Token not found" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(210).json({ success: false, message: 'Invalid or expired token', caught: true });
    }


    req.user = user; // Store the user info for use in other routes

    // const userExist = await usermodel.findById(user.id).select("-password");

    // return res.status(210).json({ success: false, message: "User not foundldsjflajsd" });
    
    // if (!userExist) {
      // return res.status(210).json({ success: false, message: "User not found" });
    // }
    next();
  });

};


// module.exports = checkAuth;

export { checkAuth };
