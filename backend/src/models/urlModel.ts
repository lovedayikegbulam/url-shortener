import mongoose, { Schema, model, Document } from 'mongoose';

interface IUrl extends Document {
  longUrl: string;
  shortUrl: string;
  customUrl?: string;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
  user: mongoose.Schema.Types.ObjectId;
  
}

const urlSchema = new Schema<IUrl>({
  longUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  customUrl: String,
  clicks: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Url = model<IUrl>('Url', urlSchema);

export { Url, IUrl };
