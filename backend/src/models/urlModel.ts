// src/models/urlModel.ts
import { Schema, model, Document } from 'mongoose';

interface IUrl extends Document {
  longUrl: string;
  shortUrl: string;
  customUrl?: string;
  clicks: number;
}

const urlSchema = new Schema<IUrl>({
  longUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  customUrl: String,
  clicks: { type: Number, default: 0 },
});

const Url = model<IUrl>('Url', urlSchema);

export { Url, IUrl };
