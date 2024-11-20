// const router = require("express").Router();
// const quiz = require("../models/mquizscehma.js");

import express from "express";
const router = express.Router();
import quiz from "../models/mquizscehma.js";

router.get("/getquestions",async(req,res,next)=>{
    const questions = await quiz.aggregate([{$sample:{size:10}}]);
    res.send(questions);
})

// module.exports=router;
export default router;

  