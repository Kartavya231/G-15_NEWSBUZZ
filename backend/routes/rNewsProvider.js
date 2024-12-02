// const router = require("express").Router();
// const { getAllProviders, getFollowingProviders, createChannel, getChannels, deleteChannel } = require("../controllers/cprovider.js");
// const checkAuth = require("../middleware/checkAuth.js");
// const multer = require('multer');

import express from "express";
const router = express.Router();
import { getAllProviders, getFollowingProviders, createChannel, getChannels, deleteChannel } from "../controllers/cNewsProvider.js";
import checkAuth from "../middleware/checkAuth.js";
import multer from 'multer';


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });


router.get("/get_all_providers", getAllProviders);
router.get("/get_following_providers", checkAuth, getFollowingProviders);

router.post("/createchannel", checkAuth, upload.single('logo'), createChannel);

router.get("/getchannels", checkAuth, getChannels);

router.delete("/deletechannel/:id", checkAuth, deleteChannel);

export default router;;
