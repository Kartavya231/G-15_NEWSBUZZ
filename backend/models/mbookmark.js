// const mongoose = require('mongoose');
import mongoose from 'mongoose';

const bookmarkschema = new mongoose.Schema({

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  providerImg: {
    type: String,
  },
  providerName: {
    type: String,
  },
  imgURL: {
    type: String,
  },
  someText: {
    type: String,
  }

},
  {
    timestamps: true
  });


const bookmark_model = mongoose.model('bookmark', bookmarkschema);

export {bookmark_model};