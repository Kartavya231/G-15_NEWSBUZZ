// const router = require("express").Router();
// const { ChangePassword } = require("../controllers/cchangepassword.js");

import express from "express";
const router = express.Router();
import {ChangePassword} from "../controllers/cchangepassword.js";

router.post("/", ChangePassword);

// export default router;;
// export default router;

export { router };

