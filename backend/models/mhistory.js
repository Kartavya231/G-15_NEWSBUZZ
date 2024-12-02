// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

import mongoose from "mongoose";
const { Schema } = mongoose;


const historyschema = new Schema({

    userid: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    historyData: [
        {
            title: {
                type: String,
                required: true,
            },
            link: {
                type: String,
                rrequired: true,
            },
            time: {
                type: Date,
                default: Date.now,
                required: true
            }
        }
    ]
});

const history_model = mongoose.model("History", historyschema);

export {history_model};