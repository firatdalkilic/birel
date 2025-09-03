# Bir El App - Otomatik Deployment Sistemi

Bu dokümantasyon, GitHub Webhook tabanlı otomatik deployment sisteminin kurulumunu ve kullanımını açıklar.

## 🚀 Sistem Genel Bakış

### Bileşenler:
- **Webhook Server**: GitHub push'larını dinler
- **Deploy Script**: Otomatik deployment işlemini gerçekleştirir
- **Backup System**: Otomatik yedekleme sistemi
- **Health Check**: Uygulama sağlık kontrolü
- **Log Management**: Kapsamlı log yönetimi

### Akış:
1. GitHub'a push yapılır
2. Webhook server push'u yakalar
3. Deploy script çalıştırılır
4. Uygulama build edilir ve deploy edilir
5. Health check yapılır
6. Backup oluşturulur

## 📋 Kurulum Adımları

### 1. Sunucuda Webhook Kurulumu

```bash
# Sunucuya SSH ile bağlan
ssh ubuntu@185.99.199.83

# Webhook kurulum script'ini çalıştır
cd /var/www/birelapp
chmod +x setup-webhook.sh
./setup-webhook.sh
```

### 2. Cron Job Kurulumu

```bash
# Cron job'ları kur
chmod +x setup-cron.sh
./setup-cron.sh
```

### 3. GitHub Webhook Ayarları

1. GitHub repository'ye git: https://github.com/firatdalkilic/birel
2. **Settings** > **Webhooks** > **Add webhook**
3. **Payload URL**: `http://webhook.birelapp.com/webhooks/birel-deploy`
4. **Content type**: `application/json`
5. **Secret**: (setup-webhook.sh'den alınan secret)
6. **Events**: `Just the push event`
7. **Active**: ✅
8. **Add webhook** butonuna tıkla

### 4. Test Deployment

```bash
# Test için küçük bir değişiklik yap
echo "# Test deployment" >> README.md
git add README.md
git commit -m "Test deployment"
git push origin main
```

## 🔧 Konfigürasyon Dosyaları

### Webhook Konfigürasyonu
- **Dosya**: `/var/www/webhook/hooks.json`
- **Port**: 9000
- **URL**: `http://webhook.birelapp.com/webhooks/birel-deploy`

### PM2 Ecosystem
- **Dosya**: `ecosystem.config.js`
- **Cluster Mode**: Aktif
- **Memory Limit**: 1GB
- **Auto Restart**: Aktif

### Nginx Konfigürasyonu
- **Ana Site**: `nginx.conf`
- **Webhook**: `/etc/nginx/sites-available/webhook`

## 📊 Monitoring ve Logs

### Log Dosyaları
- **Deploy Logs**: `/var/log/webhook/deploy.log`
- **App Logs**: `/var/log/birelapp/`
- **Webhook Logs**: `/var/log/webhook/webhook.log`
- **Nginx Logs**: `/var/log/nginx/`

### Monitoring Komutları
```bash
# PM2 durumu
pm2 status

# Webhook durumu
sudo systemctl status webhook

# Son deployment logları
tail -f /var/log/webhook/deploy.log

# App logları
pm2 logs birel-app

# Cron job logları
tail -f /var/log/birelapp/cron.log
```

## 🔄 Otomatik İşlemler

### Günlük Backup
- **Zaman**: 02:00 (her gün)
- **Script**: `backup.sh`
- **İçerik**: App files, database, logs

### Log Rotate
- **Zaman**: Her 6 saatte bir
- **İşlem**: Büyük log dosyalarını küçült

### Maintenance
- **Zaman**: 03:00 (her Pazar)
- **İşlem**: Cache temizleme, PM2 restart

## 🛠️ Manuel İşlemler

### Manuel Deployment
```bash
cd /var/www/birelapp
./deploy.sh
```

### Manuel Backup
```bash
cd /var/www/birelapp
./backup.sh
```

### Webhook Restart
```bash
sudo systemctl restart webhook
```

### PM2 Restart
```bash
pm2 restart birel-app
```

## 🔍 Sorun Giderme

### Webhook Çalışmıyor
```bash
# Webhook durumunu kontrol et
sudo systemctl status webhook

# Logları kontrol et
tail -f /var/log/webhook/webhook.log

# Port'u kontrol et
netstat -tlnp | grep 9000
```

### Deployment Başarısız
```bash
# Deploy loglarını kontrol et
tail -f /var/log/webhook/deploy.log

# PM2 durumunu kontrol et
pm2 status

# Build loglarını kontrol et
pm2 logs birel-app
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

### Nginx Caching
- Static dosyalar için cache
- Gzip compression
- Security headers

### Backup Optimizasyonu
- Sadece gerekli dosyalar
- Sıkıştırma
- Otomatik temizlik

## 🔒 Güvenlik

### Webhook Security
- HMAC-SHA256 signature verification
- IP whitelist (isteğe bağlı)
- Rate limiting

### File Permissions
- www-data user
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
- 30 gün retention
- Manifest dosyaları

---

**Son Güncelleme**: $(date)
**Versiyon**: 1.0.0

