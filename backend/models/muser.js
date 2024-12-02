// const mongoose = require('mongoose');
import mongoose from 'mongoose';


const userschema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['READER', 'PROVIDER'],
    default: "READER"
  },
  certificate: {
    type: String,
    required: function () {
      return this.role === 'PROVIDER';
    }
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  phoneNo: {
    type: String,
  },
  age: {
    type: Number,
  },
  topics: [
    {
      type: String
    }
  ],
  following: [String]
});

const usermodel = mongoose.model('user', userschema);

// export default usermodel;
export {usermodel};