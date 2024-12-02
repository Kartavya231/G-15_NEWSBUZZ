// const mongoose = require("mongoose");
import mongoose from 'mongoose';
import { Schema, model, Types } from 'mongoose';

// const { Schema, model, Types } = mongoose;

const quickSearchSchema = new Schema(
  {
    user_id:
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true, ref: "User"
    },

    quickSearchText:
      [
        {
          type: String,
          required: true
        }
      ]
  },
  { timestamps: true }
);

const quickSearch_model = model("quicksearch", quickSearchSchema);

export {quickSearch_model};
