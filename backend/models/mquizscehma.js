// const mongoose=require('mongoose');
import mongoose from 'mongoose';


const Schema = mongoose.Schema;

const quizschema = new Schema({
    questions: {
        type: String,
        required: true
    },
    optionA: {
        type: String,
        required: true
    },
    optionB: {
        type: String,
        required: true
    },
    optionC: {
        type: String,
        required: true
    },
    optionD: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
});

const quiz = mongoose.model("quiz", quizschema);

export default quiz;