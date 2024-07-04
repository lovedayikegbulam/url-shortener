import express from "express";
import urlRoutes from "./routes/urlRoutes";
import authRoutes from './routes/authRoutes';
import redirectRoute from "./routes/redirectRoute"
import limiter from "./middlewares/rateLimiter";
import connectToMongoDb from "./db/connectToMongoDb";
import cors from 'cors';
import helmet from "helmet";
import corsOptions from "./utils/corsOptions";
import redis from "./db/connectToRedis";

const app = express();


app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet());
app.use(limiter);
app.use('', redirectRoute);
app.use('/api/auth', authRoutes);
app.use("/api", urlRoutes);

connectToMongoDb();
redis.connect();

export { app };
