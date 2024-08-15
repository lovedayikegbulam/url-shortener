import dotenv from 'dotenv';
dotenv.config();

interface Config {
  PORT?: number;
  MONGODB_URI?: string;
  LOCAL_HOST?: string;
  SALT_ROUND?: number;
  JWT_SECRET?: string;
  REDIS_PASSWORD?: string;
  REDIS_HOST?: string;
  REDIS_PORT?: number;
  NODE_ENV?: string
}

const config: Config = {
  PORT: Number(process.env.PORT),
  MONGODB_URI: process.env.MONGODB_URI,
  LOCAL_HOST: process.env.LOCAL_HOST,
  SALT_ROUND: Number(process.env.SALT_ROUND),
  JWT_SECRET: process.env.JWT_SECRET,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: Number(process.env.REDIS_PORT),
  NODE_ENV: process.env.NODE_ENV,
};

export default config;
