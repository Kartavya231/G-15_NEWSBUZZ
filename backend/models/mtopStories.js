// const mongoose = require('mongoose');
import mongoose from 'mongoose';


const top_stories_schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  providerImg: {
    type: String,
    required: true
  }
},
  {
    timestamps: true
  });

const top_stories_model = mongoose.model('top_stories', top_stories_schema);

export default top_stories_model;