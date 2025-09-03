# Bir El Platformu

Bir El, insanların hem görev verebildiği hem de görev alabildiği bir mikro hizmet platformudur (TaskRabbit benzeri). Kullanıcılar basit günlük görevler için platform üzerinden ilan oluşturuyor, diğer kullanıcılar bu görevlere teklif veriyor.

## 🚀 Özellikler

- **Kullanıcı Yönetimi**: Kayıt, giriş, profil yönetimi
- **Rol Tabanlı Sistem**: Görevli ve Görevveren rolleri
- **Görev Yönetimi**: Görev oluşturma, listeleme, güncelleme
- **Teklif Sistemi**: Görevlere teklif verme ve yönetimi
- **İletişim Formu**: SMTP ile e-posta gönderimi
- **Modern UI**: Tailwind CSS + shadcn/ui
- **Form Validasyonu**: React Hook Form + Zod
- **State Management**: Zustand

## 🛠️ Teknoloji Stack

- **Frontend**: React.js + Next.js 14 (App Router)
- **UI**: Tailwind CSS + shadcn/ui
- **Form Validasyonu**: React Hook Form + Zod
- **State Management**: Zustand
- **Backend**: Node.js API Routes (Next.js içinde)
- **Veritabanı**: MongoDB + Mongoose
- **Authentication**: JWT + bcryptjs
- **Email**: Nodemailer + SMTP
- **Deployment**: PM2 + Nginx

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
- MongoDB
- SMTP sunucu bilgileri

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone https://github.com/yourusername/birel.git
cd birel
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Environment variables oluşturun**
```bash
cp .env.example .env.local
```

`.env.local` dosyasını düzenleyin:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/birel

# Email Configuration
SMTP_HOST=mail.celebicephe.com
SMTP_PORT=465
SMTP_USER=info@celebicephe.com
SMTP_PASS=your_email_password

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## 🏗️ Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth sayfaları
│   ├── (dashboard)/       # Dashboard sayfaları
│   ├── api/               # API endpoints
│   └── globals.css
├── components/
│   ├── ui/                # shadcn/ui bileşenleri
│   ├── forms/             # Form bileşenleri
│   └── features/          # Özellik bazlı bileşenler
├── lib/
│   ├── validations.ts     # Zod şemaları
│   ├── api.ts            # API hata yönetimi
│   ├── email.ts          # Email servisi
│   └── utils.ts          # Yardımcı fonksiyonlar
├── store/                 # Zustand store'ları
├── hooks/                 # Custom hooks
└── types/                 # TypeScript tipleri
```

## 🚀 Production Deployment

### VDS Deployment

1. **Deployment script'ini çalıştırın**
```bash
chmod +x deploy.sh
./deploy.sh
```

2. **Domain ayarlarını yapın**
- `nginx.conf` dosyasında domain adresinizi güncelleyin
- SSL sertifikası alın: `sudo certbot --nginx -d yourdomain.com`

3. **Environment variables ayarlayın**
```bash
# Production environment variables
NEXT_PUBLIC_APP_URL=https://yourdomain.com
MONGODB_URI=mongodb://username:password@localhost:27017/birel
```

4. **Uygulamayı başlatın**
```bash
pm2 start ecosystem.config.js
```

### Vercel Deployment

1. **Vercel CLI kurun**
```bash
npm i -g vercel
```

2. **Deploy edin**
```bash
vercel --prod
```

## 📋 Geliştirme Fazları

### Faz 1: Temel Altyapı ✅
- [x] shadcn/ui entegrasyonu
- [x] Form validasyonu (React Hook Form + Zod)
- [x] İletişim formu ve email servisi
- [x] Zustand state management
- [x] API hata yönetimi

### Faz 2: Core Features (Devam Ediyor)
- [ ] Görev yönetimi sistemi
- [ ] Teklif sistemi
- [ ] Kullanıcı profilleri
- [ ] Bildirim sistemi

### Faz 3: Advanced Features (Planlanıyor)
- [ ] Mesajlaşma sistemi
- [ ] Ödeme entegrasyonu
- [ ] Yorum ve değerlendirme
- [ ] Arama ve filtreleme

## 🔧 Yardımcı Komutlar

```bash
# Geliştirme
npm run dev          # Geliştirme sunucusu
npm run build        # Production build
npm run start        # Production sunucusu
npm run lint         # ESLint kontrolü

# PM2 (Production)
pm2 status           # Uygulama durumu
pm2 logs birel       # Logları görüntüle
pm2 restart birel    # Uygulamayı yeniden başlat
pm2 stop birel       # Uygulamayı durdur

# Nginx
sudo systemctl restart nginx    # Nginx yeniden başlat
sudo nginx -t                   # Konfigürasyon kontrolü
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **E-posta**: info@celebicephe.com
- **Instagram**: [@birelapp](https://instagram.com/birelapp)
- **Website**: [birel.com](https://birel.com)
