import express from 'express';
import urlRoutes from './routes/urlRoutes';
import limiter from './middlewares/rateLimiter';
import connectToMongoDb from './db/connectToMongoDb';
import redis from './db/connectToRedis'

const app = express();
app.use(express.json());
app.use(limiter);
app.use('/api', urlRoutes);

connectToMongoDb();
redis.connect();

export { app };
