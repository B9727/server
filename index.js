import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";


// locals imports
import getUser from "./routes/users.js";
import createUser from "./routes/auth.js";
import imageProcessing from "./routes/images.js"
import postRouter from "./routes/post.js";
import { scheduler } from "./cron_jobs/boost.js";

// initialise the app
const app = express()

dotenv.config();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(helmet());
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// route
app.get("/", (req, res) => {
  const jsonData = {
    "Welcome to Shutter": "200 status",
    "api/auth/login": "Login",
    "api/auth/register": "Register",
    "api/images": "Images",
  };
  res.json(jsonData);
});
app.use("/api/users", getUser);
app.use("/api/auth", createUser);
app.use("/api/images", imageProcessing)
app.use("/api/postquiz", postRouter)


// mongodb connection
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("Connection to database --success");

// cron jobs
scheduler()

// server listening PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started at port --localhost:${PORT}`);
});
