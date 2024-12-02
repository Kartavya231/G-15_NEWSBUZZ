// const router = require("express").Router();
// const { ByText1, ByText2, ByTopic1, ByText3, ByText4, ByTopic2 } = require("../algorithms/myFeed.js");

import express from "express";
const router = express.Router();
import { ByText,ByTopic } from "../algorithms/myFeed.js";


router.get("/getmyfeed/text/:textId", ByText);
// router.get("/getmyfeed/text/1", ByText1);
// router.get("/getmyfeed/text/2", ByText2);
// router.get("/getmyfeed/text/3", ByText3);
// router.get("/getmyfeed/text/4", ByText4);

router.get("/getmyfeed/topic/:topicId", ByTopic);
// router.get("/getmyfeed/topic/2", ByTopic2);

// export default router;;
// export default router;
export { router };

