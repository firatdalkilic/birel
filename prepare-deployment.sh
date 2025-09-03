#!/bin/bash

# Bir El Platformu - Deployment Dosyaları Hazırlama Script'i
# Bu script deployment için gerekli dosyaları hazırlar

echo "📦 Bir El Platformu - Deployment Dosyaları Hazırlanıyor..."

# Deployment klasörü oluştur
mkdir -p deployment
cd deployment

# Gerekli dosyaları kopyala
echo "📋 Dosyalar kopyalanıyor..."

# Ana proje dosyaları
cp -r ../src ./
cp -r ../public ./
cp ../package.json ./
cp ../package-lock.json ./
cp ../next.config.js ./
cp ../tailwind.config.js ./
cp ../tsconfig.json ./
cp ../postcss.config.js ./
cp ../eslint.config.mjs ./

# Deployment dosyaları
cp ../ecosystem.config.js ./
cp ../nginx.conf ./
cp ../deploy.sh ./
cp ../DEPLOYMENT.md ./
cp ../env.example ./

# .gitignore oluştur
cat > .gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Next.js
.next/
out/

# Production
build/

# Environment variables
.env
.env.local
.env.production.local

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
EOF

# Deployment README oluştur
cat > README.md << 'EOF'
# Bir El Platformu - VDS Deployment

Bu klasör VDS'e deployment için gerekli tüm dosyaları içerir.

## 🚀 Hızlı Başlangıç

### 1. VDS'e Dosyaları Yükle
```bash
# SCP ile dosyaları yükle
scp -r deployment/* user@your-vds-ip:/tmp/birel/

# VDS'de dosyaları taşı
ssh user@your-vds-ip
sudo mv /tmp/birel/* /var/www/birel/
cd /var/www/birel
```

### 2. Deployment Script'ini Çalıştır
```bash
chmod +x deploy.sh
./deploy.sh
```

### 3. Uygulamayı Başlat
```bash
npm install --production
pm2 start ecosystem.config.js
```

### 4. SSL Sertifikası Al
```bash
sudo certbot --nginx -d yourdomain.com
```

## 📁 Dosya Yapısı

```
deployment/
├── src/                    # Uygulama kaynak kodları
├── public/                 # Statik dosyalar
├── package.json           # NPM bağımlılıkları
├── ecosystem.config.js    # PM2 konfigürasyonu
├── nginx.conf            # Nginx konfigürasyonu
├── deploy.sh             # Otomatik deployment script'i
├── DEPLOYMENT.md         # Detaylı deployment rehberi
├── env.example           # Environment variables örneği
└── README.md             # Bu dosya
```

## 🔧 Konfigürasyon

### Environment Variables
`.env` dosyasını oluşturun:
```bash
cp env.example .env
nano .env
```

### Domain Ayarları
`nginx.conf` dosyasında domain adresinizi güncelleyin:
```bash
nano nginx.conf
# yourdomain.com yerine kendi domain'inizi yazın
```

## 📊 Monitoring

### PM2 Monitoring
```bash
pm2 status
pm2 logs birel
pm2 monit
```

### Nginx Logs
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🔄 Backup

Otomatik backup her gece 02:00'de çalışır:
```bash
# Manuel backup
/var/backups/birel/backup.sh
```

## 🆘 Sorun Giderme

Detaylı sorun giderme için `DEPLOYMENT.md` dosyasını inceleyin.

## 📞 Destek

Sorun yaşarsanız:
- Logları kontrol edin: `pm2 logs birel`
- Nginx durumunu kontrol edin: `sudo systemctl status nginx`
- Sistem kaynaklarını kontrol edin: `htop`
EOF

# Deployment script'ini çalıştırılabilir yap
chmod +x deploy.sh

echo "✅ Deployment dosyaları hazırlandı!"
echo ""
echo "📁 Dosyalar 'deployment/' klasöründe"
echo ""
echo "🚀 Sonraki adımlar:"
echo "1. deployment/ klasörünü VDS'e yükleyin"
echo "2. VDS'de deploy.sh script'ini çalıştırın"
echo "3. Uygulamayı başlatın"
echo ""
echo "📖 Detaylı bilgi için: deployment/README.md"

