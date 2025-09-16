import mongoose, { Schema, Document } from 'mongoose';

export interface IGorev extends Document {
  adSoyad: string;
  telefon: string;
  sehirIlce: string;
  baslik: string;
  aciklama: string;
  aciliyet: 'Hemen' | 'Bugün içinde' | 'Haftaiçinde';
  butce?: string;
  gizlilikOnayi: boolean;
  createdAt: Date;
}

const GorevSchema = new Schema<IGorev>({
  adSoyad: { type: String, required: true },
  telefon: { type: String, required: true },
  sehirIlce: { type: String, required: true },
  baslik: { type: String },
  aciklama: { type: String },
  aciliyet: { type: String, enum: ['Hemen', 'Bugün içinde', 'Haftaiçinde'], required: true },
  butce: { type: String },
  gizlilikOnayi: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Gorev || mongoose.model<IGorev>('Gorev', GorevSchema);
