import express from "express";
import urlRoutes from "./routes/urlRoutes";
import authRoutes from './routes/authRoutes';
import limiter from "./middlewares/rateLimiter";
import connectToMongoDb from "./db/connectToMongoDb";
import cors, { CorsOptions } from "cors";
// import corsOptions from "./middlewares/corsOptions";
import redis from "./db/connectToRedis";

const app = express();

app.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({}));
app.use(express.json());
app.use(limiter);
app.use('/api/auth', authRoutes);
app.use("/api", urlRoutes);

connectToMongoDb();
redis.connect();

export { app };
