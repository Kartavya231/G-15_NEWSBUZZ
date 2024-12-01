import express from "express";

const router = express.Router();

import { gethistory, addhistory, removehistory } from '../controllers/chistory.js';

router.post('/add', addhistory);

router.post('/remove', removehistory);

router.get("/get", gethistory);


export { router };