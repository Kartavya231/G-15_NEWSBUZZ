import express from "express";
const router = express.Router();
import { getAllProviders} from "../controllers/cNewsProvider.js";
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