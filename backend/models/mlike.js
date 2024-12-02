// const mongoose = require('mongoose');
import mongoose from 'mongoose';


const likeschema = new mongoose.Schema({

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  title: {
    type: String,
    required: true
  }

},
  {
    timestamps: true
  });


const like_model = mongoose.model('like', likeschema);

export {like_model};