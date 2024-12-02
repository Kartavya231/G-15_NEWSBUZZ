import express from "express";
const router = express.Router();
import { addMute, removeMute, getMute } from '../controllers/cmute.js';

router.post('/add', addMute);

router.post('/remove', removeMute);

router.post("/get", getMute);


export { router };