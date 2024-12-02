// const mongoose = require("mongoose");
import mongoose from 'mongoose';

// const { Schema, model, Types } = mongoose;
import { Schema, model, Types } from 'mongoose';


const searchLocationSchema = new Schema(
  {
    user_id:
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true, ref: "User"
    },

    searchText:
      [
        {
          text: { type: String, required: true },
          count: { type: Number, default: 1, min: 0 },
          updatedAt: { type: Date, default: Date.now },
        },
      ],
  },
  { timestamps: true }
);

const searchLocation_model = model("searchLocation", searchLocationSchema);

export {searchLocation_model};
