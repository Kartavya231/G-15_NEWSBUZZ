const mongoose = require('mongoose');

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
  },
  followers: {
    type: [String],
  }
},
  {
    timestamps: true
  });

const newsProvidermodel = mongoose.model('newsProvider', newsProviderschema);

module.exports = newsProvidermodel;