const mongoose = require("mongoose");
const User = require("./muser.js");
const Schema = mongoose.Schema;

const muteschema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    mutedURL : [{
        type: String,
        required: true
    },]
})

const Mute = mongoose.model("Mute", muteschema);
module.exports = Mute;
