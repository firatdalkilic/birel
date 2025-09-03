# Bir El App - Otomatik Deployment Sistemi

Bu dokümantasyon, GitHub Webhook tabanlı otomatik deployment sisteminin kurulumunu ve kullanımını açıklar.

## 🚀 Sistem Genel Bakış

### Bileşenler:
- **Webhook Server**: GitHub push'larını dinler (Port: 3200)
- **Deploy Script**: Release tabanlı deployment
- **Backup System**: Otomatik yedekleme sistemi (7 gün rotasyon)
- **Health Check**: Uygulama sağlık kontrolü
- **Log Management**: Kapsamlı log yönetimi
- **PM2 Cluster Mode**: Yüksek performans

### Akış:
1. GitHub'a push yapılır
2. Webhook server push'u yakalar (HMAC doğrulama)
3. Deploy script çalıştırılır
4. Yeni release oluşturulur
5. Uygulama build edilir ve deploy edilir
6. Health check yapılır
7. Current symlink güncellenir
8. Eski release'ler temizlenir

## 📋 Kurulum Adımları

### 1. Deploy Kullanıcısı Oluşturma

```bash
# Deploy kullanıcısı oluştur
sudo adduser deploy
sudo usermod -aG sudo deploy

# SSH anahtarı ekle
sudo mkdir -p /home/deploy/.ssh
sudo cp ~/.ssh/authorized_keys /home/deploy/.ssh/
sudo chown -R deploy:deploy /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
sudo chmod 600 /home/deploy/.ssh/authorized_keys
```

### 2. Proje Dizinleri Oluşturma

```bash
# Ana dizinler
sudo mkdir -p /var/www/birel
sudo mkdir -p /var/www/birel/releases
sudo mkdir -p /var/www/birel/current
sudo mkdir -p /home/deploy/logs
sudo mkdir -p /home/deploy/backups

# İzinleri ayarla
sudo chown -R deploy:deploy /var/www/birel
sudo chown -R deploy:deploy /home/deploy
```

### 3. Proje Dosyalarını Kopyalama

```bash
# Proje dosyalarını kopyala
cd /var/www/birel
sudo -u deploy git clone https://github.com/firatdalkilic/birel.git temp
sudo -u deploy cp -r temp/* .
sudo -u deploy cp -r temp/.* . 2>/dev/null || true
sudo rm -rf temp

# Current symlink oluştur
sudo -u deploy ln -sfn /var/www/birel /var/www/birel/current
```

### 4. Webhook Sistemi Kurulumu

```bash
# Deploy kullanıcısına geç
sudo su - deploy

# Webhook kurulumu
cd /var/www/birel
chmod +x setup-webhook.sh
./setup-webhook.sh
```

### 5. Cron Job Kurulumu

```bash
# Cron job'ları kur
chmod +x setup-cron.sh
./setup-cron.sh
```

### 6. PM2 ile Uygulamayı Başlatma

```bash
# PM2 ile başlat
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🔧 Konfigürasyon Dosyaları

### Webhook Konfigürasyonu
- **Dosya**: `/opt/birel-webhook/webhook-server.js`
- **Port**: 3200
- **URL**: `http://webhook.birelapp.com/webhooks/birel-deploy`

### PM2 Ecosystem
- **Dosya**: `ecosystem.config.js`
- **Web App**: `birel-web` (cluster mode)
- **Webhook**: `birel-webhook` (fork mode)

### Release Yapısı
```
/var/www/birel/
├── releases/
│   ├── 20241201_143022/
│   ├── 20241201_150145/
│   └── ...
├── current -> releases/20241201_150145/
└── ...
```

## 📊 Monitoring ve Logs

### Log Dosyaları
- **Deploy Logs**: `/home/deploy/logs/deploy.log`
- **Backup Logs**: `/home/deploy/backup.log`
- **App Logs**: `/home/deploy/logs/birel-web-*.log`
- **Webhook Logs**: `/home/deploy/logs/birel-webhook-*.log`

### Monitoring Komutları
```bash
# PM2 durumu
pm2 status

# Webhook durumu
pm2 status birel-webhook

# Son deployment logları
tail -f /home/deploy/logs/deploy.log

# App logları
pm2 logs birel-web

# Cron job logları
tail -f /home/deploy/backup.log
```

## 🔄 Otomatik İşlemler

### Günlük Backup
- **Zaman**: 03:30 (her gün)
- **Script**: `backup.sh`
- **İçerik**: App files, database, logs
- **Rotasyon**: 7 gün

### Log Rotate
- **Zaman**: Her 6 saatte bir
- **İşlem**: Büyük log dosyalarını küçült

### Maintenance
- **Zaman**: 04:00 (her Pazar)
- **İşlem**: Cache temizleme, PM2 restart

## 🛠️ Manuel İşlemler

### Manuel Deployment
```bash
cd /var/www/birel
./deploy.sh
```

### Manuel Backup
```bash
cd /var/www/birel
./backup.sh
```

### Webhook Restart
```bash
pm2 restart birel-webhook
```

### PM2 Restart
```bash
pm2 restart birel-web
```

## 🔍 Sorun Giderme

### Webhook Çalışmıyor
```bash
# Webhook durumunu kontrol et
pm2 status birel-webhook

# Logları kontrol et
pm2 logs birel-webhook

# Port'u kontrol et
netstat -tlnp | grep 3200
```

### Deployment Başarısız
```bash
# Deploy loglarını kontrol et
tail -f /home/deploy/logs/deploy.log

# PM2 durumunu kontrol et
pm2 status

# Build loglarını kontrol et
pm2 logs birel-web
```

### Health Check Başarısız
```bash
# Health endpoint'ini test et
curl http://localhost:3000/api/health

# Nginx durumunu kontrol et
sudo systemctl status nginx
```

## 📈 Performans Optimizasyonları

### PM2 Cluster Mode
- Tüm CPU çekirdeklerini kullanır
- Otomatik load balancing
- Yüksek availability

### Release Tabanlı Deployment
- Zero-downtime deployment
- Kolay rollback
- Temiz dosya yapısı

### Backup Optimizasyonu
- Sadece gerekli dosyalar
- Sıkıştırma
- Otomatik temizlik

## 🔒 Güvenlik

### Webhook Security
- HMAC-SHA256 signature verification
- Rate limiting (100 req/15min)
- IP whitelist (isteğe bağlı)

### File Permissions
- deploy user
- 755 permissions
- Secure file ownership

### SSL/TLS
- HTTPS zorunlu
- Security headers
- HSTS enabled

## 📞 Destek

### Log Dosyaları
- Tüm işlemler loglanır
- Hata durumları kaydedilir
- Performance metrics

### Monitoring
- PM2 monitoring
- Nginx access logs
- System metrics

### Backup
- Otomatik yedekleme
- 7 gün retention
- Manifest dosyaları

## 🚀 GitHub Webhook Ayarları

### 1. GitHub Repository Ayarları
1. **GitHub Repository**: https://github.com/firatdalkilic/birel
2. **Settings** > **Webhooks** > **Add webhook**

### 2. Webhook Konfigürasyonu
- **Payload URL**: `http://webhook.birelapp.com/webhooks/birel-deploy`
- **Content type**: `application/json`
- **Secret**: (setup-webhook.sh'den alınan secret)
- **Events**: `Just the push event`
- **Active**: ✅

### 3. Test Deployment
```bash
# Test değişikliği
echo "# Test deployment - $(date)" >> README.md
git add README.md
git commit -m "Test deployment"
git push origin main
```

---

**Son Güncelleme**: $(date)
**Versiyon**: 2.0.0

