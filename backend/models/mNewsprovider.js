// const mongoose = require('mongoose');
import mongoose from 'mongoose';


const newsProviderschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  baseURL: {
    type: String,
    required: true,
    unique: true
  },
  logo: {
    type: String,
    required: true,
  },
  followers: {
    type: [String],
  },
  provider_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }
},
  {
    timestamps: true
  });

const newsProvidermodel = mongoose.model('newsProvider', newsProviderschema);

export {newsProvidermodel};