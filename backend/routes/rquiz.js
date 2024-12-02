import express from "express";
const router = express.Router();
import {getQuiz} from "../controllers/cquiz.js";


router.get("/getquestions",getQuiz)

// export default router;


export { router };

  