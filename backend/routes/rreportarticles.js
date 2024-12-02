// const router = require("express").Router();
// const { AddreportArticles } = require("../controllers/creportarticles.js");

import express from "express";
const router = express.Router();
import { AddreportArticles } from "../controllers/creportarticles.js";

router.get("/", AddreportArticles);

export default router;;