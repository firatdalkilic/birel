#!/bin/bash

# Bir El App Deployment Script
# Bu script production ortamına deploy işlemini gerçekleştirir

set -e

echo "🚀 Bir El App Deployment başlatılıyor..."

# Environment variables
APP_NAME="birel-app"
DEPLOY_PATH="/var/www/birelapp"
BACKUP_PATH="/var/backups/birelapp"
LOG_PATH="/var/log/birelapp"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "Bu script root olarak çalıştırılmamalıdır!"
   exit 1
fi

# Create necessary directories
print_status "Gerekli dizinler oluşturuluyor..."
sudo mkdir -p $DEPLOY_PATH
sudo mkdir -p $BACKUP_PATH
sudo mkdir -p $LOG_PATH
sudo chown -R $USER:$USER $DEPLOY_PATH
sudo chown -R $USER:$USER $BACKUP_PATH
sudo chown -R $USER:$USER $LOG_PATH

# Backup current version
if [ -d "$DEPLOY_PATH/.next" ]; then
    print_status "Mevcut versiyon yedekleniyor..."
    BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
    cp -r $DEPLOY_PATH $BACKUP_PATH/$BACKUP_NAME
fi

# Navigate to deploy directory
cd $DEPLOY_PATH

# Pull latest changes
print_status "En son değişiklikler çekiliyor..."
git pull origin main

# Install dependencies
print_status "Bağımlılıklar yükleniyor..."
npm ci --production

# Build the application
print_status "Uygulama build ediliyor..."
npm run build

# Set proper permissions
print_status "Dosya izinleri ayarlanıyor..."
sudo chown -R www-data:www-data $DEPLOY_PATH
sudo chmod -R 755 $DEPLOY_PATH

# Restart PM2 process
print_status "PM2 process yeniden başlatılıyor..."
pm2 reload $APP_NAME || pm2 start ecosystem.config.js --env production

# Check if the application is running
sleep 5
if pm2 list | grep -q $APP_NAME; then
    print_status "✅ Uygulama başarıyla başlatıldı!"
else
    print_error "❌ Uygulama başlatılamadı!"
    pm2 logs $APP_NAME --lines 20
    exit 1
fi

# Test the application
print_status "Uygulama test ediliyor..."
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    print_status "✅ Health check başarılı!"
else
    print_warning "⚠️ Health check başarısız, ancak uygulama çalışıyor olabilir"
fi

# Reload Nginx
print_status "Nginx yeniden yükleniyor..."
sudo systemctl reload nginx

# Cleanup old backups (keep last 5)
print_status "Eski yedekler temizleniyor..."
cd $BACKUP_PATH
ls -t | tail -n +6 | xargs -r rm -rf

print_status "🎉 Deployment tamamlandı!"
print_status "Uygulama: https://birelapp.com"
print_status "PM2 Status: pm2 status"
print_status "Logs: pm2 logs $APP_NAME"
