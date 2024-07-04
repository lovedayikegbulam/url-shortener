// src/types.ts
export interface Url {
    _id: string;
    longUrl: string;
    shortUrl: string;
    customUrl?: string;
    userId: string;
    clicks: number; // Assuming you track clicks for analytics
  }
  