// const mongoose = require('mongoose');
import mongoose from 'mongoose';


const verificationcodeschema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  code: {
    type: String,
  }
},
  {
    timestamps: true
  });

const verificationcodemodel = mongoose.model('verificationcode', verificationcodeschema);

export {verificationcodemodel};