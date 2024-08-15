import express from "express";
import urlRoutes from "./routes/urlRoutes";
import authRoutes from "./routes/authRoutes";
import redirectRoute from "./routes/redirectRoute";
import limiter from "./utils/rateLimiter";
import connectToMongoDb from "./db/connectToMongoDb";
import cors from "cors";
import helmet from "helmet";
import corsOptions from "./utils/corsOptions";
import redis from "./db/connectToRedis";

//initialize express
const app = express();

// parse body
app.use(express.json());

//security middlewares
app.use(cors(corsOptions));
app.use(helmet());
app.use(limiter);

//Routes
app.use("", redirectRoute);
app.use("/api/auth", authRoutes);
app.use("/api", urlRoutes);

// Handle the base route
app.get("", (req, res) => {
  res.status(200);
  res.json("Welcome");
});

// catch all route
app.all("*", (req, res) => {
  res.status(404);
  res.json({
    message: "Page Not found",
  });
});

//Connect to databases
connectToMongoDb();
redis.connect();

export default app;
