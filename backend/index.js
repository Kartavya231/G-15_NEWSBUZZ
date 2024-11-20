import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import checkAuth from './middleware/checkAuth.js';
import userroute from './routes/ruser.js';
import quicksearchroute from './routes/rquicksearch.js';
import providerroute from './routes/rNewsProvider.js';
import quiz_router from './routes/rquiz.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

dotenv.config();

// Create __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const port = process.env.PORT || 9000;

app.use(express.static(path.join(__dirname, '../frontend/build')));
// Serve static files from the React app

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("connected to mongodb");
}).catch((err) => {
  console.log(`${err} \n error connecting mongoDB `);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "authorization"],
  credentials: true,
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get("/api/checkauth", checkAuth);
app.use("/api/user", userroute);
app.use("/api/quicksearch", checkAuth, quicksearchroute);
app.use("/api/provider", checkAuth, providerroute);
app.use("/api/quiz", checkAuth, quiz_router);
app.get('/',(req,res)=> {res.status(202).send("Hello Backend myproject1")});

app.listen(port, () => {
  console.log('listening at port : ${port}');
});