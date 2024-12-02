
import express from "express";

const router = express.Router();
// import { ScrapTop_stories } from "../algorithms/top_stories";
// const router = require("express").Router();

// const { ScrapTop_stories } = require("../algorithms/top_stories");

import {ScrapTop_stories} from "../algorithms/top_stories.js";

// import temp from "../algorithms/top_stories.js";



router.get("/top_stories", ScrapTop_stories);


// export default router;;

export { router };
