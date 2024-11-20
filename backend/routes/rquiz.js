// const router = require("express").Router();
// const quiz = require("../models/mquizscehma.js");

import express from "express";
const router = express.Router();
import { getQuiz } from "../controllers/cquiz.js";

router.get("/getquestions",getQuiz)

export default router;

  