import cors, { CorsOptions } from 'cors';

// List of allowed origins
const allowedOrigins = ["http://localhost:5173/"];

// Configure CORS
const corsOptions: CorsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Check if the origin is in the allowedOrigins array
    if (allowedOrigins.indexOf(origin!) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  optionsSuccessStatus: 200,
};

export default corsOptions;
