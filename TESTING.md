# Bir El - Test Rehberi

Bu dokümanda Bir El projesinin test edilmesi için gerekli adımlar ve komutlar bulunmaktadır.

## 🚀 Hızlı Başlangıç

### 1. Geliştirme Ortamı Kurulumu

```bash
# Bağımlılıkları yükle
npm install

# Playwright browser'ları yükle
npm run test:install

# Environment dosyasını oluştur
cp env.example .env.local

# MongoDB bağlantısını ayarla (.env.local dosyasında)
MONGODB_URI=mongodb://localhost:27017/birel
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters
```

### 2. Geliştirme Sunucusunu Başlat

```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## 🧪 Test Komutları

### Smoke Test (Hızlı Test)

```bash
# Temel smoke test'leri çalıştır
npm run test:smoke

# Test'leri görsel olarak izle
npm run test:ui

# Test'leri browser'da görüntüle
npm run test:headed
```

### Tam Test Suite

```bash
# Tüm test'leri çalıştır
npm run test

# CI/CD için (retry ile)
CI=true npm run test
```

## 📋 Test Senaryoları

### 1. Anasayfa Testleri
- ✅ Sayfa başlığı doğru
- ✅ Hero section görünür
- ✅ Kategori kartları görünür
- ✅ CTA butonları çalışıyor
- ✅ Responsive tasarım

### 2. Auth Akışı Testleri
- ✅ Kayıt formu çalışıyor
- ✅ Giriş formu çalışıyor
- ✅ Form validasyonu
- ✅ Hata mesajları
- ✅ Başarı toast'ları

### 3. API Testleri
- ✅ Health endpoint (`/api/health`)
- ✅ Register endpoint (`/api/register`)
- ✅ Login endpoint (`/api/login`)
- ✅ Error handling
- ✅ Response formatları

### 4. UI/UX Testleri
- ✅ Navigation çalışıyor
- ✅ Footer links
- ✅ Mobile responsive
- ✅ Loading states

## 🔍 Manuel Test Senaryoları

### Anasayfa Testi
1. `http://localhost:3000` adresine git
2. Sayfanın yüklendiğini kontrol et
3. "Bir El" başlığının görünür olduğunu kontrol et
4. Kategori kartlarının görünür olduğunu kontrol et
5. "Kayıt Ol" ve "Giriş Yap" butonlarının çalıştığını kontrol et

### Kayıt Testi
1. `/kayit` sayfasına git
2. Form alanlarını doldur:
   - Ad: Test
   - Soyad: User
   - E-posta: test@example.com
   - Telefon: 5551234567
   - Şifre: testpassword123
   - Şifre Tekrar: testpassword123
3. "Kayıt Ol" butonuna tıkla
4. Başarı toast'ının göründüğünü kontrol et
5. Rol seçim sayfasına yönlendirildiğini kontrol et

### Giriş Testi
1. `/giris` sayfasına git
2. Geçersiz bilgilerle test et:
   - E-posta: wrong@example.com
   - Şifre: wrongpassword
3. "Giriş Yap" butonuna tıkla
4. Hata toast'ının göründüğünü kontrol et

### Health Endpoint Testi
1. `http://localhost:3000/api/health` adresine git
2. JSON response'un geldiğini kontrol et:
   ```json
   {
     "status": "healthy",
     "timestamp": 1234567890,
     "time": "2025-01-27T10:00:00.000Z",
     "uptime": 3600,
     "memory": {
       "used": 50,
       "total": 100,
       "rss": 120
     },
     "version": "v18.17.0",
     "environment": "development",
     "database": {
       "status": "connected"
     },
     "services": {
       "api": "running",
       "database": "connected"
     }
   }
   ```

## 🐛 Sorun Giderme

### Test'ler Çalışmıyor
```bash
# Browser'ları yeniden yükle
npm run test:install

# Cache'i temizle
rm -rf node_modules/.cache
npm run test
```

### MongoDB Bağlantı Hatası
```bash
# MongoDB'nin çalıştığını kontrol et
mongosh --eval "db.runCommand('ping')"

# Bağlantı string'ini kontrol et
echo $MONGODB_URI
```

### Port Çakışması
```bash
# Farklı port kullan
PORT=3001 npm run dev

# Test base URL'ini güncelle
TEST_BASE_URL=http://localhost:3001 npm run test
```

## 📊 Test Sonuçları

Test sonuçları şu dosyalarda saklanır:
- `test-results.json` - JSON formatında
- `test-results.xml` - JUnit formatında
- `playwright-report/` - HTML raporu

## 🔧 CI/CD Entegrasyonu

GitHub Actions için örnek workflow:

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:install
      - run: npm run build
      - run: npm run test
```

## 📝 Test Raporu

Her test çalıştırmasından sonra:
1. Console'da test sonuçlarını kontrol edin
2. HTML raporu için `npx playwright show-report` komutunu kullanın
3. Screenshot'lar ve video'lar `test-results/` klasöründe saklanır

## 🎯 Kabul Kriterleri

Tüm test'ler geçmeli:
- ✅ Anasayfa içeriği render oluyor
- ✅ Kayıt formu çalışıyor ve toast gösteriyor
- ✅ Giriş formu çalışıyor ve hata mesajları gösteriyor
- ✅ Health endpoint 200 döndürüyor
- ✅ API endpoint'leri doğru response veriyor
- ✅ Responsive tasarım çalışıyor
- ✅ Navigation linkleri çalışıyor

## 🚨 Önemli Notlar

1. **Test verileri**: Test'ler gerçek veritabanını kullanır, test sonrası temizlik yapılmalı
2. **Environment**: Test'ler için ayrı environment kullanılması önerilir
3. **MongoDB**: Test'ler için MongoDB'nin çalışır durumda olması gerekir
4. **Port**: Varsayılan port 3000, çakışma durumunda değiştirilebilir
