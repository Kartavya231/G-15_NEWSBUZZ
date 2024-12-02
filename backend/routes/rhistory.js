import express from "express";

const router = express.Router();

import { gethistory, addhistory, removehistory, removeallhistory } from '../controllers/chistory.js';

router.post('/add', addhistory);

router.post('/remove', removehistory);

router.get("/get", gethistory);

router.get("/removeallhistory", removeallhistory);


export { router };

