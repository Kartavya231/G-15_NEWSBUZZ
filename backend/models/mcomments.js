// const mongoose = require("mongoose");
import mongoose from 'mongoose';


const commentsSchema = new mongoose.Schema(
  {
    articleURL: {
      type: String,
      required: true, // Fixed typo from "require" to "required"
    },
    user: [
      {
        username: {
          type: String,
          required: true
        },
        comment: {
          type: String,
          required: true
        },
        timestamp: {
          type: Date,
          default: Date.now()
        },
        commentId: {
          type: String,
          required: true,
        }

      }
    ]
  },
  {
    timestamps: true
  }
);

const comment_model = mongoose.model('comment', commentsSchema);

export {comment_model};
