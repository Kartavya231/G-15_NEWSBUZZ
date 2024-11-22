// const router = require("express").Router();
// const { ForgotPassword, ForgotPasswordVarifyCode, ForgotPasswordResetPassword } = require("../controllers/csendemail.js");

import express from "express";
const router = express.Router();
import { ForgotPassword, ForgotPasswordVarifyCode, ForgotPasswordResetPassword } from "../controllers/csendemail.js";



router.post("/forgotpassword", ForgotPassword);

router.post("/forgotpassword/verifycode", ForgotPasswordVarifyCode);

router.post("/forgotpassword/resetpassword", ForgotPasswordResetPassword);

export default router;;