import mongoose, { Schema, Document } from 'mongoose';

export interface IGorevli extends Document {
  adSoyad: string;
  telefon: string;
  sehirIlce: string;
  gorevTurleri: string[];
  uygunSaat: string;
  referans?: string;
  kvkkOnayi: boolean;
  createdAt: Date;
}

const GorevliSchema = new Schema<IGorevli>({
  adSoyad: { type: String, required: true },
  telefon: { type: String, required: true },
  sehirIlce: { type: String, required: true },
  gorevTurleri: [{ type: String }],
  uygunSaat: { type: String, required: true },
  referans: { type: String },
  kvkkOnayi: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Gorevli || mongoose.model<IGorevli>('Gorevli', GorevliSchema);
