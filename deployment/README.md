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





