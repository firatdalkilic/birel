import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Ad alanı zorunludur'],
  },
  lastName: {
    type: String,
    required: [true, 'Soyad alanı zorunludur'],
  },
  email: {
    type: String,
    required: [true, 'E-posta alanı zorunludur'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Geçerli bir e-posta adresi giriniz'],
  },
  phone: {
    type: String,
    required: [true, 'Telefon numarası zorunludur'],
    match: [/^\+90[0-9]{10}$/, 'Telefon numarası +90 ile başlamalı ve 10 haneli olmalıdır'],
  },
  passwordHash: {
    type: String,
    required: [true, 'Şifre zorunludur'],
  },
  lastSelectedRole: {
    type: String,
    enum: ['gorevli', 'gorevveren', null],
    default: null,
  },
  roles: [{
    type: String,
    enum: ['gorevli', 'gorevveren'],
  }],
  gorevliProfile: {
    tasks: [{
      type: String,
      enum: ['Ev işleri', 'İlaç alımı', 'Paket taşıma', 'Çocuk bakımı', 'Bahçe işleri'],
    }],
    transportation: {
      type: String,
      enum: ['Kendi aracı var', 'Yaya'],
    },
    availability: [{
      type: String,
      enum: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
    }],
    about: {
      type: String,
      maxlength: [300, 'Açıklama en fazla 300 karakter olabilir'],
    },
    rating: {
      type: Number,
      default: 0,
    },
    completedTasks: {
      type: Number,
      default: 0,
    },
  },
  gorevverenProfile: {
    postedTasks: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema); 