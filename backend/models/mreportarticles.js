// const mongoose = require("mongoose");
import mongoose from 'mongoose';


const mreportarticlesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  num: {
    type: Number,
  },
  feedback: [
    {
      type: String,
    },
  ]
});

const reportarticlesModel = mongoose.model("reportarticles", mreportarticlesSchema);

export {reportarticlesModel};