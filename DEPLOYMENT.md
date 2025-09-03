# Bir El Platformu - VDS Deployment Checklist

## 🚀 Deployment Öncesi Hazırlık

### 1. VDS Sunucu Gereksinimleri
- **OS**: Ubuntu 22.04 LTS
- **CPU**: Minimum 2 vCPU (İdeal: 4 vCPU)
- **RAM**: Minimum 4GB (İdeal: 8GB)
- **Storage**: Minimum 50GB SSD (İdeal: 100GB)
- **Bandwidth**: Minimum 1TB/ay

### 2. Domain Ayarları
- Domain adresinizi alın (örn: birel.com)
- DNS ayarlarını VDS IP adresine yönlendirin
- A kaydı: `@` → VDS IP adresi
- CNAME kaydı: `www` → `@`

### 3. VDS Sunucu Kurulumu

#### Temel Paketler:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git nginx postgresql postgresql-contrib redis-server
```

#### Node.js Kurulumu:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### PM2 Kurulumu:
```bash
sudo npm install -g pm2
```

### 4. Uygulama Deployment

#### Dosyaları Yükleme:
```bash
# Uygulama dizini oluştur
sudo mkdir -p /var/www/birel
sudo chown $USER:$USER /var/www/birel

# Proje dosyalarını kopyala
cp -r * /var/www/birel/
cd /var/www/birel

# Bağımlılıkları yükle
npm install --production
```

#### Environment Variables:
```bash
# .env dosyası oluştur
nano /var/www/birel/.env

# İçeriği:
NODE_ENV=production
MONGODB_URI=mongodb://username:password@localhost:27017/birel
SMTP_HOST=mail.birel.com
SMTP_PORT=465
SMTP_USER=info@birel.com
SMTP_PASS=your_email_password
JWT_SECRET=your_very_secure_jwt_secret_key
NEXT_PUBLIC_APP_URL=https://birel.com
```

### 5. Nginx Konfigürasyonu

#### Nginx Config:
```bash
# Config dosyasını kopyala
sudo cp nginx.conf /etc/nginx/sites-available/birel
sudo ln -sf /etc/nginx/sites-available/birel /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Domain adresini güncelle
sudo nano /etc/nginx/sites-available/birel
# yourdomain.com yerine birel.com yaz

# Syntax kontrolü
sudo nginx -t

# Nginx restart
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 6. SSL Sertifikası

#### Certbot Kurulumu:
```bash
sudo apt install certbot python3-certbot-nginx
```

#### SSL Sertifikası Alma:
```bash
sudo certbot --nginx -d birel.com -d www.birel.com
```

### 7. PM2 ile Uygulama Başlatma

#### PM2 Config:
```bash
# ecosystem.config.js dosyasını güncelle
nano ecosystem.config.js
# cwd: '/var/www/birel' olduğundan emin ol

# Uygulamayı başlat
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 8. Firewall Ayarları

```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable
```

### 9. Monitoring ve Logs

#### PM2 Monitoring:
```bash
pm2 status
pm2 logs birel
pm2 monit
```

#### Nginx Logs:
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 10. Backup Stratejisi

#### Otomatik Backup Script:
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/birel"

mkdir -p $BACKUP_DIR

# Database backup
pg_dump birel > $BACKUP_DIR/db_backup_$DATE.sql

# App files backup
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz /var/www/birel

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

#### Cron Job:
```bash
# Crontab'a ekle
crontab -e
# 0 2 * * * /path/to/backup.sh
```

## 🔧 Sorun Giderme

### Yaygın Sorunlar:

1. **Port 3000 erişilemiyor**
   ```bash
   sudo netstat -tlnp | grep :3000
   pm2 restart birel
   ```

2. **Nginx 502 hatası**
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   pm2 logs birel
   ```

3. **SSL sertifikası sorunu**
   ```bash
   sudo certbot renew --dry-run
   sudo certbot --nginx -d birel.com
   ```

4. **Database bağlantı hatası**
   ```bash
   sudo systemctl status postgresql
   sudo systemctl restart postgresql
   ```

## 📊 Performance Monitoring

### Sistem Kaynakları:
```bash
htop
df -h
free -h
```

### Uygulama Performance:
```bash
pm2 monit
pm2 logs birel --lines 100
```

## 🚀 Deployment Tamamlandı!

Uygulamanız artık `https://birel.com` adresinde çalışıyor olmalı.

### Test Edilecekler:
- ✅ Ana sayfa yükleniyor mu?
- ✅ İletişim formu çalışıyor mu?
- ✅ Kayıt/giriş sistemi çalışıyor mu?
- ✅ SSL sertifikası aktif mi?
- ✅ Mobil uyumluluk var mı?

