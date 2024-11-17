// const router = require("express").Router();
// const { getQuickSearch, addQuickSearch, deleteQuickSearch } = require("../controllers/cquicksearch");

import express from "express";
const router = express.Router();
import { getQuickSearch, addQuickSearch, deleteQuickSearch } from "../controllers/cquicksearch.js";


router.get("/get", getQuickSearch);

router.post("/add", addQuickSearch);

router.delete("/delete", deleteQuickSearch);


export default router;