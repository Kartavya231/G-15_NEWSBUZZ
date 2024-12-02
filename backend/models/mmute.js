  // const mongoose = require("mongoose");
  // const User = require("./muser.js");
  // const Schema = mongoose.Schema;

  import mongoose from "mongoose";
  const Schema = mongoose.Schema;

  const muteschema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    mutedURL: [String]
  })

  const mute_model = mongoose.model("Mute", muteschema);

export default mute_model;