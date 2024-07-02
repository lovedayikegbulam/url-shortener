// types.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      MONGODB_URI?: string;
      LOCAL_HOST?: string;
      SALT_ROUND?: string;
      JWT_SECRET?: string;
      REDIS_PASSWORD?: string;
      REDIS_HOST?: string;
      REDIS_PORT?: string;
    }
  }
  