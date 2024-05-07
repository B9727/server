import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";


// locals imports
import userRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import imageRouter from "./routes/images.js"
import postRouter from "./routes/post.js";
import { scheduler } from "./cron_jobs/boost.js";
// import { sendMail, sendPhotographerMail } from "./services/mailer/Mailer.js";

// initialise the app
const app = express()

dotenv.config();

// middlewareS
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

// routes
app.get("/", (req, res) => {
  const jsonData = {
    "Welcome to Shutterbug SERVER_V2.1.1": "200 status",
  };
  res.json(jsonData);
});
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/images", imageRouter)
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
// sendMail("nathomadri@gmail.com", "Nathan")
// sendPhotographerMail("nathomadri@gmail.com", "Mawaya")

// server listening PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started at port --localhost:${PORT}`);
});
